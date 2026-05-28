import type { ConditionCategory, Platform, StrategyType } from "./strategy";

export type AnalyticsEventName =
  | "strategy_created"
  | "strategy_saved"
  | "simulation_run"
  | "improvement_clicked"
  | "conversion_clicked"
  | "waitlist_joined"
  | "priority_requested"
  | "paid_intent_clicked"
  | "share_clicked";

export interface AnalyticsEvent {
  id: string;
  name: AnalyticsEventName;
  strategyId?: string;
  platform?: Platform;
  strategyTypes?: StrategyType[];
  conditionCategories?: ConditionCategory[];
  elapsedSecondsFromCreation?: number;
  email?: string;
  metadata?: Record<string, string | number | boolean | null>;
  createdAt: string;
}
