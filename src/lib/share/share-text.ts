import type { StrategyCard } from "@/types/strategy";

export function buildShareText(strategy: StrategyCard) {
  const entry = strategy.entryConditions.slice(0, 2).map((item) => `- ${item.plainKorean}`).join("\n");
  const exit = strategy.exitConditions.slice(0, 2).map((item) => `- ${item.plainKorean}`).join("\n");

  return [
    `[식톡 전략 카드] ${strategy.title}`,
    strategy.oneLineSummary,
    "",
    "주요 진입 조건",
    entry,
    "",
    "주요 청산 조건",
    exit,
    "",
    "식톡에서 생성",
  ].join("\n");
}
