"use client";

import { useRef, useState } from "react";
import { Copy, Download, Save, Share2, Trash2 } from "lucide-react";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { ConditionSection } from "@/components/condition-section";
import { FakeDoorButtons } from "@/components/fake-door-buttons";
import { downloadCardImage } from "@/lib/share/download-card-image";
import { buildShareText } from "@/lib/share/share-text";
import type { SimulationReport } from "@/types/simulation";
import type { Platform, StrategyCard } from "@/types/strategy";

interface StrategyCardViewProps {
  strategy: StrategyCard;
  report?: SimulationReport;
  isSaved: boolean;
  onSave: () => void;
  onDelete: () => void;
  onSimulate: () => void;
  onImprove: () => void;
  onConversionRequest: (platform: Platform) => void;
  onShared: () => void;
}

export function StrategyCardView({
  strategy,
  report,
  isSaved,
  onSave,
  onDelete,
  onSimulate,
  onImprove,
  onConversionRequest,
  onShared,
}: StrategyCardViewProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [shareMessage, setShareMessage] = useState<string>();

  const handleDownload = async () => {
    const text = buildShareText(strategy);

    try {
      if (cardRef.current) {
        await downloadCardImage(cardRef.current, `${strategy.title}.png`);
        setShareMessage("전략 카드 이미지를 다운로드했습니다.");
      } else {
        await navigator.clipboard.writeText(text);
        setShareMessage("이미지 저장이 어려워 공유용 텍스트를 복사했습니다.");
      }
    } catch {
      try {
        await navigator.clipboard.writeText(text);
        setShareMessage("이미지 저장이 어려워 공유용 텍스트를 복사했습니다.");
      } catch {
        setShareMessage("공유 이미지 저장에 실패했습니다.");
      }
    } finally {
      onShared();
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(buildShareText(strategy));
      setShareMessage("공유용 텍스트를 복사했습니다.");
      onShared();
    } catch {
      setShareMessage("텍스트 복사에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-5">
      <Card ref={cardRef} className="p-6 sm:p-7">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {strategy.strategyTypes.map((type) => (
                  <Badge key={type} tone="brand">
                    {type}
                  </Badge>
                ))}
                {strategy.suitableAssets.map((asset) => (
                  <Badge key={asset} tone="accent">
                    {asset}
                  </Badge>
                ))}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">{strategy.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{strategy.oneLineSummary}</p>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button variant={isSaved ? "secondary" : "primary"} onClick={onSave}>
                <Save className="mr-2 h-4 w-4" />
                {isSaved ? "저장됨" : "식 서랍 저장"}
              </Button>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                공유 이미지 다운로드
              </Button>
              <Button variant="secondary" onClick={handleCopyText}>
                <Copy className="mr-2 h-4 w-4" />
                공유용 텍스트 복사
              </Button>
              {isSaved ? (
                <Button
                  variant="danger"
                  onClick={() => {
                    if (window.confirm("이 전략 카드를 식 서랍에서 삭제할까요?")) {
                      onDelete();
                    }
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  삭제
                </Button>
              ) : null}
            </div>
          </div>

          {shareMessage ? (
            <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">{shareMessage}</p>
          ) : null}

          <div className="grid gap-6">
            <ConditionSection title="진입 조건" conditions={strategy.entryConditions} />
            <ConditionSection title="청산 조건" conditions={strategy.exitConditions} />
            <ConditionSection title="종목 조건" conditions={strategy.screeningConditions} />
            <ConditionSection title="필터 조건" conditions={strategy.filterConditions} />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <InfoBlock title="적합한 시간봉" items={strategy.suitableTimeframes} />
            <InfoBlock title="피해야 할 장세" items={strategy.avoidRegimes} />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <TextBlock title="리스크 요약" text={strategy.riskSummary} />
            <TextBlock title="모의검증 아이디어" text={strategy.validationIdeas.join(" / ")} />
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={onSimulate}>모의검증하기</Button>
              <Button variant="secondary" disabled={!report} onClick={onImprove}>
                20분 개선하기
              </Button>
              <Button variant="outline" onClick={handleCopyText}>
                <Share2 className="mr-2 h-4 w-4" />
                공유하기
              </Button>
            </div>
            <FakeDoorButtons onClick={onConversionRequest} />
          </div>
        </div>
      </Card>
    </div>
  );
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={`${title}-${item}`}>{item}</Badge>
        ))}
      </div>
    </div>
  );
}

function TextBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}
