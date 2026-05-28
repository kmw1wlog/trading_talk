import type { AnalyticsEvent } from "@/types/analytics";
import type { Platform, StrategyCard } from "@/types/strategy";

export function buildStrategyEvent(
  name: AnalyticsEvent["name"],
  strategy: StrategyCard,
  overrides?: Partial<AnalyticsEvent>,
): AnalyticsEvent {
  return {
    id: crypto.randomUUID(),
    name,
    strategyId: strategy.id,
    strategyTypes: strategy.strategyTypes,
    conditionCategories: strategy.conditionCategories,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

export function buildConversionEvent(strategy: StrategyCard, platform: Platform): AnalyticsEvent {
  const createdAt = Date.now();
  const strategyCreatedAt = new Date(strategy.createdAt).getTime();

  return buildStrategyEvent("conversion_clicked", strategy, {
    platform,
    elapsedSecondsFromCreation: Math.max(0, Math.round((createdAt - strategyCreatedAt) / 1000)),
    metadata: {
      createdAt: strategy.createdAt,
    },
  });
}
