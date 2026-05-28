import { SIMULATION_DISCLAIMER } from "@/lib/constants";
import { hashString, seededNumber } from "@/lib/simulation/hash";
import type { SimulationReport, SegmentInsight } from "@/types/simulation";
import type { AssetClass, StrategyCard } from "@/types/strategy";

const assetPool: AssetClass[] = ["국장", "미장", "코인", "선물", "옵션", "공통"];
const timePool = ["시초 30분", "오전장", "점심 이후", "오후장", "장 막판", "야간"];

function pickAssets(seed: string, offset: number) {
  const start = (hashString(`${seed}-${offset}`) % assetPool.length) || 0;
  return [assetPool[start], assetPool[(start + 2) % assetPool.length]];
}

function makeSegment(seed: string, label: string, positive: boolean): SegmentInsight {
  const score = Number(seededNumber(`${seed}-${label}`, positive ? 58 : 28, positive ? 87 : 49).toFixed(1));

  return {
    label,
    description: positive
      ? `${label} 구간에서 조건 충족 후 추세 연장이 비교적 안정적으로 관찰됐습니다.`
      : `${label} 구간에서는 신호가 잦아도 추세 지속력이 약한 편으로 나타났습니다.`,
    score,
  };
}

export function simulateStrategy(strategy: StrategyCard): SimulationReport {
  const seed = `${strategy.id}-${strategy.title}`;
  const totalReturnPct = Number(seededNumber(seed, -4.5, 18.9).toFixed(1));
  const winRatePct = Number(seededNumber(`${seed}-win`, 38, 71).toFixed(1));
  const averagePnlPct = Number(seededNumber(`${seed}-avg`, -0.8, 2.4).toFixed(2));
  const maxDrawdownPct = Number(seededNumber(`${seed}-mdd`, -12.8, -3.2).toFixed(1));
  const tradeCount = Math.round(seededNumber(`${seed}-trades`, 24, 146));
  const bestTimeSegments = [
    makeSegment(seed, timePool[hashString(`${seed}-best-1`) % timePool.length], true),
    makeSegment(seed, timePool[hashString(`${seed}-best-2`) % timePool.length], true),
  ];
  const worstTimeSegments = [
    makeSegment(seed, timePool[hashString(`${seed}-worst-1`) % timePool.length], false),
    makeSegment(seed, timePool[hashString(`${seed}-worst-2`) % timePool.length], false),
  ];
  const bestAssets = pickAssets(seed, 1);
  const weakAssets = pickAssets(seed, 2);
  const currentReturnPct = totalReturnPct;
  const thresholdSweepBestPct = Number((currentReturnPct + seededNumber(`${seed}-thr`, 1.2, 6.2)).toFixed(1));
  const timeFilterBestPct = Number((currentReturnPct + seededNumber(`${seed}-time`, 0.8, 5.1)).toFixed(1));
  const assetSwitchBestPct = Number((currentReturnPct + seededNumber(`${seed}-asset`, 0.5, 4.4)).toFixed(1));
  const overfitRiskScore = hashString(`${seed}-overfit`) % 3;
  const overfitRisk = overfitRiskScore === 0 ? "낮음" : overfitRiskScore === 1 ? "보통" : "높음";

  return {
    id: crypto.randomUUID(),
    strategyId: strategy.id,
    generatedAt: new Date().toISOString(),
    disclaimer: SIMULATION_DISCLAIMER,
    totalReturnPct,
    winRatePct,
    averagePnlPct,
    maxDrawdownPct,
    tradeCount,
    bestTimeSegments,
    worstTimeSegments,
    bestAssets,
    weakAssets,
    strengths: [
      "조건이 문장형으로 정리되어 있어 진입 근거를 다시 점검하기 쉽습니다.",
      "손절과 필터 조건이 분리되어 있어 개선 포인트를 찾기 좋습니다.",
      `${strategy.suitableTimeframes[0]} 중심으로 관찰할 때 신호 해석이 비교적 단순합니다.`,
    ],
    weaknesses: [
      "변동성이 급격히 줄어드는 구간에서는 신호 효율이 떨어질 수 있습니다.",
      "조건이 겹치는 구간에서 진입 타이밍이 늦어질 가능성이 있습니다.",
      "자산군이 바뀌면 동일한 문장 조건도 체감 성능이 달라질 수 있습니다.",
    ],
    improvementCandidates: [
      "거래량 또는 변동성 임계치를 한 단계 더 분리해보기",
      "시간대 필터를 추가해 신호가 약한 구간 줄이기",
      "손절 이후 재진입 제한 규칙을 붙여 과잉 매매 줄이기",
    ],
    twentyMinuteSuggestion:
      "거래량 필터, 시간대 필터, ATR 손절 중 하나만 먼저 추가해 20분 안에 재정리해보세요.",
    oracle: {
      currentReturnPct,
      thresholdSweepBestPct,
      timeFilterBestPct,
      assetSwitchBestPct,
      overfitRisk,
      note: "이 수치는 실제 미래 수익이 아니라, 가상 데이터에서 관찰된 개선 가능성입니다.",
    },
  };
}
