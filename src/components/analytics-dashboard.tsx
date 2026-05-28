"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { compactNumber } from "@/lib/utils";
import { useStrategyStore } from "@/lib/storage/strategy-store";
import type { Platform } from "@/types/strategy";

const platforms: Platform[] = ["tradingview", "kiwoom", "yestrader", "mts", "webhook", "telegram"];

export function AnalyticsDashboard() {
  const { analyticsEvents, mounted } = useStrategyStore();

  const totalCreated = analyticsEvents.filter((event) => event.name === "strategy_created").length;
  const totalSaved = analyticsEvents.filter((event) => event.name === "strategy_saved").length;
  const totalSimulated = analyticsEvents.filter((event) => event.name === "simulation_run").length;
  const totalImproved = analyticsEvents.filter((event) => event.name === "improvement_clicked").length;
  const paidIntentCount = analyticsEvents.filter((event) => event.name === "paid_intent_clicked").length;

  const conversionClicksByPlatform = Object.fromEntries(
    platforms.map((platform) => [
      platform,
      analyticsEvents.filter((event) => event.name === "conversion_clicked" && event.platform === platform).length,
    ]),
  ) as Record<Platform, number>;

  const waitlistsByPlatform = Object.fromEntries(
    platforms.map((platform) => [
      platform,
      analyticsEvents.filter((event) => event.name === "waitlist_joined" && event.platform === platform).length,
    ]),
  ) as Record<Platform, number>;

  const waitlistRateByPlatform = Object.fromEntries(
    platforms.map((platform) => [
      platform,
      conversionClicksByPlatform[platform] === 0
        ? 0
        : waitlistsByPlatform[platform] / conversionClicksByPlatform[platform],
    ]),
  ) as Record<Platform, number>;

  const topPlatforms = [...platforms].sort(
    (left, right) => conversionClicksByPlatform[right] - conversionClicksByPlatform[left],
  );

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(analyticsEvents, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "siktalk-analytics-events.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!mounted) {
    return <Card className="p-6 text-sm text-slate-500">로컬 이벤트를 불러오는 중입니다.</Card>;
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric title="전략 카드 생성 수" value={compactNumber(totalCreated)} />
        <Metric title="저장 수" value={compactNumber(totalSaved)} />
        <Metric title="모의검증 실행 수" value={compactNumber(totalSimulated)} />
        <Metric title="20분 개선 클릭 수" value={compactNumber(totalImproved)} />
        <Metric title="Paid intent 클릭 수" value={compactNumber(paidIntentCount)} />
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">플랫폼별 전환 수요</h2>
            <p className="text-sm text-slate-600">변환 클릭, waitlist 등록, 등록률을 로컬 이벤트 기준으로 집계합니다.</p>
          </div>
          <Button variant="secondary" onClick={exportJson}>
            <Download className="mr-2 h-4 w-4" />
            JSON export
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="px-3 py-3">플랫폼</th>
                <th className="px-3 py-3">conversion</th>
                <th className="px-3 py-3">waitlist</th>
                <th className="px-3 py-3">등록률</th>
              </tr>
            </thead>
            <tbody>
              {topPlatforms.map((platform) => (
                <tr key={platform} className="border-b border-slate-50">
                  <td className="px-3 py-3 font-medium text-slate-900">{platform}</td>
                  <td className="px-3 py-3 text-slate-600">{conversionClicksByPlatform[platform]}</td>
                  <td className="px-3 py-3 text-slate-600">{waitlistsByPlatform[platform]}</td>
                  <td className="px-3 py-3 text-slate-600">
                    {(waitlistRateByPlatform[platform] * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-slate-950">최근 이벤트 {analyticsEvents.length}개</h2>
        <div className="mt-4 space-y-3">
          {analyticsEvents.slice(0, 12).map((event) => (
            <div key={event.id} className="rounded-2xl border border-slate-100 px-4 py-3 text-sm">
              <p className="font-medium text-slate-900">{event.name}</p>
              <p className="mt-1 text-slate-600">
                strategyId: {event.strategyId ?? "-"} / platform: {event.platform ?? "-"} / createdAt: {event.createdAt}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
    </Card>
  );
}
