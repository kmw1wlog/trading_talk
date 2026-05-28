"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  ArrowUp,
  BellRing,
  BookOpen,
  ChartNoAxesCombined,
  Menu,
  PanelLeftClose,
  Shield,
  Sparkles,
} from "lucide-react";

import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { Card } from "@/components/card";
import { EmptyState } from "@/components/empty-state";
import { FakeDoorDialog } from "@/components/fake-door-dialog";
import { Sidebar, type DrawerFilter } from "@/components/sidebar";
import { SimulationReportPanel } from "@/components/simulation-report-panel";
import { StrategyCardView } from "@/components/strategy-card-view";
import { StrategyComposer } from "@/components/strategy-composer";
import { TopBar } from "@/components/top-bar";
import { buildConversionEvent, buildStrategyEvent } from "@/lib/analytics/event-builders";
import { INVESTMENT_DISCLAIMER } from "@/lib/constants";
import { createImprovedStrategyCard } from "@/lib/ai/mock-strategy-generator";
import { useStrategyStore } from "@/lib/storage/strategy-store";
import { PlatformSchema } from "@/lib/schemas";
import type { AnalyticsEvent } from "@/types/analytics";
import type { SimulationReport } from "@/types/simulation";
import type { ConditionCategory, Platform, StrategyCard } from "@/types/strategy";

const conditionCategories: ConditionCategory[] = [
  "entry",
  "exit",
  "screening",
  "analysis",
  "finance",
  "news",
  "risk",
  "combo",
];

function matchesFilter(strategy: StrategyCard, filter: DrawerFilter) {
  if (filter === "all" || filter === "recent") {
    return true;
  }
  if (filter === "simulated") {
    return Boolean(strategy.simulatedAt);
  }
  if (filter === "converted") {
    return strategy.conversionRequestedPlatforms.length > 0;
  }
  if (filter.startsWith("platform:")) {
    const value = filter.replace("platform:", "");
    const parsed = PlatformSchema.safeParse(value);
    return parsed.success ? strategy.conversionRequestedPlatforms.includes(parsed.data) : false;
  }

  return (conditionCategories as string[]).includes(filter)
    ? strategy.conditionCategories.includes(filter as ConditionCategory)
    : false;
}

const quickIdeas = [
  {
    label: "돌파식",
    icon: ChartNoAxesCombined,
    prompt: "거래량이 터지고 전고점을 돌파하는 종목을 찾고 싶어.",
  },
  {
    label: "반등식",
    icon: Sparkles,
    prompt: "RSI가 과매도였다가 반등할 때 알람 받고 싶어.",
  },
  {
    label: "손절식",
    icon: Shield,
    prompt: "손절은 ATR 기준으로 하고 싶어.",
  },
];

export function AppShell() {
  const {
    strategyCards,
    selectedStrategy,
    selectedStrategyId,
    selectedReport,
    addStrategy,
    updateStrategy,
    deleteStrategy,
    selectStrategy,
    addAnalyticsEvent,
    addSimulationReport,
  } = useStrategyStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawerFilter, setDrawerFilter] = useState<DrawerFilter>("all");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [simulateLoading, setSimulateLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [activeStrategy, setActiveStrategy] = useState<StrategyCard>();
  const [currentReport, setCurrentReport] = useState<SimulationReport>();
  const [dialogPlatform, setDialogPlatform] = useState<Platform>();

  useEffect(() => {
    if (selectedStrategy) {
      setActiveStrategy(selectedStrategy);
    }
  }, [selectedStrategy]);

  useEffect(() => {
    if (selectedReport) {
      setCurrentReport(selectedReport);
    }
  }, [selectedReport]);

  const filteredCards = useMemo(
    () =>
      [...strategyCards]
        .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
        .filter((strategy) => matchesFilter(strategy, drawerFilter)),
    [drawerFilter, strategyCards],
  );

  const isSaved = activeStrategy ? strategyCards.some((card) => card.id === activeStrategy.id) : false;

  const recordEvent = async (event: AnalyticsEvent) => {
    addAnalyticsEvent(event);
    try {
      await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });
    } catch {
      // Logging API is best-effort only.
    }
  };

  const handleGenerate = async (nextInput?: string) => {
    setError(undefined);
    const requestInput = (nextInput ?? input).trim();

    if (requestInput.length < 5) {
      setError("아이디어를 5자 이상 적어주세요.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/strategy/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: requestInput, mode: "general" }),
      });
      const data = (await response.json()) as StrategyCard | { error: string };

      if (!response.ok || "error" in data) {
        setError("error" in data ? data.error : "전략 카드를 만드는 중 오류가 발생했습니다.");
        return;
      }

      setActiveStrategy(data);
      setCurrentReport(undefined);
      setInput("");
      await recordEvent(buildStrategyEvent("strategy_created", data));
    } catch {
      setError("전략 카드를 만드는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!activeStrategy) {
      return;
    }

    if (isSaved) {
      updateStrategy({
        ...activeStrategy,
        updatedAt: new Date().toISOString(),
      });
    } else {
      addStrategy(activeStrategy);
    }

    await recordEvent(buildStrategyEvent("strategy_saved", activeStrategy));
  };

  const handleDelete = () => {
    if (!activeStrategy) {
      return;
    }

    deleteStrategy(activeStrategy.id);
    setActiveStrategy(undefined);
    setCurrentReport(undefined);
  };

  const handleSimulate = async () => {
    if (!activeStrategy) {
      return;
    }

    try {
      setSimulateLoading(true);
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ strategy: activeStrategy }),
      });
      const data = (await response.json()) as SimulationReport | { error: string };

      if (!response.ok || "error" in data) {
        setError("error" in data ? data.error : "가상 모의검증에 실패했습니다.");
        return;
      }

      const updatedStrategy = {
        ...activeStrategy,
        simulatedAt: data.generatedAt,
        updatedAt: data.generatedAt,
      };
      setActiveStrategy(updatedStrategy);
      setCurrentReport(data);
      if (isSaved) {
        updateStrategy(updatedStrategy);
      }
      addSimulationReport(data);
      await recordEvent(buildStrategyEvent("simulation_run", updatedStrategy));
    } catch {
      setError("가상 모의검증에 실패했습니다.");
    } finally {
      setSimulateLoading(false);
    }
  };

  const handleImprove = async () => {
    if (!activeStrategy) {
      return;
    }
    const improved = createImprovedStrategyCard(activeStrategy);
    setActiveStrategy(improved);
    setCurrentReport(undefined);
    await recordEvent(
      buildStrategyEvent("improvement_clicked", activeStrategy, {
        metadata: {
          parentId: activeStrategy.id,
        },
      }),
    );
  };

  const handleSelectSavedStrategy = (id: string) => {
    selectStrategy(id);
    const nextStrategy = strategyCards.find((card) => card.id === id);
    if (nextStrategy) {
      setActiveStrategy(nextStrategy);
      const nextReport = nextStrategy.id === selectedReport?.strategyId ? selectedReport : undefined;
      setCurrentReport(nextReport);
    }
    setSidebarOpen(false);
  };

  const handleConversionOpen = async (platform: Platform) => {
    if (!activeStrategy) {
      return;
    }

    const requestedPlatforms = Array.from(
      new Set([...activeStrategy.conversionRequestedPlatforms, platform]),
    );
    const updatedStrategy = {
      ...activeStrategy,
      conversionRequestedPlatforms: requestedPlatforms,
      updatedAt: new Date().toISOString(),
    };
    setActiveStrategy(updatedStrategy);
    if (isSaved) {
      updateStrategy(updatedStrategy);
    }
    setDialogPlatform(platform);
    await recordEvent(buildConversionEvent(updatedStrategy, platform));
  };

  const handleDialogWaitlist = async (platform: Platform, email?: string) => {
    if (!activeStrategy) {
      return;
    }

    await recordEvent(
      buildStrategyEvent("waitlist_joined", activeStrategy, {
        platform,
        email,
      }),
    );
    setDialogPlatform(undefined);
  };

  const handleDialogPriority = async (platform: Platform) => {
    if (!activeStrategy) {
      return;
    }

    await recordEvent(
      buildStrategyEvent("priority_requested", activeStrategy, {
        platform,
      }),
    );
    setDialogPlatform(undefined);
  };

  const handleShared = async () => {
    if (!activeStrategy) {
      return;
    }

    await recordEvent(buildStrategyEvent("share_clicked", activeStrategy));
  };

  return (
    <div className="min-h-dvh bg-white text-slate-950 lg:bg-shell">
      <div className="hidden lg:block">
        <TopBar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((current) => !current)} />
      </div>

      <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center bg-white/95 px-4 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="식 서랍 열기"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 text-slate-950"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="rounded-full bg-slate-50 px-4 py-2 text-base font-semibold text-slate-950">
            식톡
          </div>
        </div>
      </header>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-40 bg-black/20 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div
            className="h-full w-[86vw] max-w-sm bg-white p-3 shadow-soft"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="text-lg font-semibold">식 서랍</span>
              <button
                type="button"
                aria-label="식 서랍 닫기"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50"
                onClick={() => setSidebarOpen(false)}
              >
                <PanelLeftClose className="h-5 w-5" />
              </button>
            </div>
            <Sidebar
              items={filteredCards}
              selectedId={selectedStrategyId ?? activeStrategy?.id}
              activeFilter={drawerFilter}
              onChangeFilter={setDrawerFilter}
              onSelectStrategy={handleSelectSavedStrategy}
            />
          </div>
        </div>
      ) : null}

      <div className="mx-auto hidden max-w-[1600px] gap-6 px-4 py-6 lg:grid lg:grid-cols-[280px,minmax(0,1fr),420px] lg:px-6">
        <div>
          <Sidebar
            items={filteredCards}
            selectedId={selectedStrategyId ?? activeStrategy?.id}
            activeFilter={drawerFilter}
            onChangeFilter={setDrawerFilter}
            onSelectStrategy={handleSelectSavedStrategy}
          />
        </div>

        <main className="space-y-6">
          <StrategyComposer value={input} loading={loading} error={error} onChange={setInput} onSubmit={handleGenerate} />

          {activeStrategy ? (
            <StrategyCardView
              strategy={activeStrategy}
              report={currentReport}
              isSaved={isSaved}
              onSave={handleSave}
              onDelete={handleDelete}
              onSimulate={handleSimulate}
              onImprove={handleImprove}
              onConversionRequest={handleConversionOpen}
              onShared={handleShared}
            />
          ) : (
            <EmptyState
              title="첫 전략 카드를 만들어보세요"
              description="거래량 돌파, RSI 반등, 장 막판 강세처럼 말로 적은 아이디어를 전략 카드로 정리하고 식 서랍에 저장할 수 있습니다."
            />
          )}
          <p className="text-xs leading-6 text-slate-500">{INVESTMENT_DISCLAIMER}</p>
        </main>

        <aside className="space-y-5">
          {simulateLoading ? (
            <EmptyState
              title="가상 모의검증을 돌리는 중입니다"
              description="실제 시장 데이터가 아니라 전략 문장과 인앱 가상 규칙을 바탕으로 리포트를 만들고 있습니다."
            />
          ) : currentReport ? (
            <SimulationReportPanel report={currentReport} />
          ) : (
            <EmptyState
              title="리포트가 아직 없습니다"
              description="전략 카드에서 모의검증하기를 누르면 전체 수익률, 승률, 약점, 오라클 개선 가능성을 포함한 리포트가 표시됩니다."
            />
          )}
        </aside>
      </div>

      <main className="min-h-dvh px-4 pb-40 pt-20 lg:hidden">
        {activeStrategy ? (
          <div className="space-y-4">
            <StrategyCardView
              strategy={activeStrategy}
              report={currentReport}
              isSaved={isSaved}
              onSave={handleSave}
              onDelete={handleDelete}
              onSimulate={handleSimulate}
              onImprove={handleImprove}
              onConversionRequest={handleConversionOpen}
              onShared={handleShared}
            />
            {simulateLoading ? (
              <MobileStatus label="검증 중" />
            ) : currentReport ? (
              <SimulationReportPanel report={currentReport} />
            ) : null}
          </div>
        ) : (
          <div className="flex min-h-[calc(100dvh-14rem)] items-center justify-center">
            <div className="grid grid-cols-3 gap-4">
              <MobileShortcut icon={Archive} label={`${strategyCards.length}`} />
              <MobileShortcut icon={BellRing} label="요청" />
              <MobileShortcut icon={BookOpen} label="자료" />
            </div>
          </div>
        )}
      </main>

      <form
        className="fixed inset-x-0 bottom-0 z-30 bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-3 lg:hidden"
        onSubmit={(event) => {
          event.preventDefault();
          void handleGenerate();
        }}
      >
        {!activeStrategy ? (
          <div className="mb-3 grid gap-3">
            {quickIdeas.map((idea) => {
              const Icon = idea.icon;

              return (
                <button
                  key={idea.label}
                  type="button"
                  className="flex h-11 items-center gap-4 text-left text-base text-slate-950"
                  onClick={() => {
                    setInput(idea.prompt);
                    void handleGenerate(idea.prompt);
                  }}
                >
                  <Icon className="h-6 w-6" />
                  <span>{idea.label}</span>
                </button>
              );
            })}
          </div>
        ) : null}

        {error ? <p className="mb-2 px-2 text-sm text-rose-600">{error}</p> : null}
        <div className="flex min-h-14 items-end gap-2 rounded-full bg-slate-50 px-3 py-2 shadow-[0_10px_40px_rgba(15,23,42,0.10)]">
          <button
            type="button"
            aria-label="예시 열기"
            className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-950"
            onClick={() => setInput(quickIdeas[0].prompt)}
          >
            <Sparkles className="h-5 w-5" />
          </button>
          <button
            type="submit"
            aria-label="전략 카드 만들기"
            disabled={loading}
            className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white disabled:opacity-40"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
          <textarea
            rows={1}
            value={input}
            aria-label="매매 아이디어 입력"
            placeholder="매매 아이디어"
            className="max-h-28 min-h-10 min-w-0 flex-1 resize-none bg-transparent py-2 text-base leading-6 text-slate-950 outline-none placeholder:text-slate-400"
            onChange={(event) => setInput(event.target.value)}
          />
        </div>
      </form>

      <FakeDoorDialog
        open={Boolean(dialogPlatform)}
        platform={dialogPlatform}
        strategy={activeStrategy}
        onClose={() => setDialogPlatform(undefined)}
        onWaitlist={handleDialogWaitlist}
        onPriority={handleDialogPriority}
        onShare={handleShared}
        onSaveAsSentence={handleSave}
      />
    </div>
  );
}

function MobileShortcut({
  icon: Icon,
  label,
}: {
  icon: typeof Archive;
  label: string;
}) {
  return (
    <div className="flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-full bg-slate-50 text-slate-800">
      <Icon className="h-5 w-5" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}

function MobileStatus({ label }: { label: string }) {
  return (
    <Card className="rounded-lg border-slate-100 p-4 text-sm text-slate-600">
      {label}
    </Card>
  );
}

export function AdminShell() {
  return (
    <div className="min-h-screen bg-shell">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <p className="text-sm text-slate-500">식톡 운영자 화면</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">로컬 수요 이벤트 대시보드</h1>
        </div>
        <AnalyticsDashboard />
      </div>
    </div>
  );
}
