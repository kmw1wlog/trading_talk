export type StrategyType =
  | "scalping"
  | "day_trading"
  | "swing"
  | "closing_bet"
  | "breakout"
  | "pullback"
  | "mean_reversion"
  | "volatility"
  | "news_disclosure"
  | "finance_filter"
  | "market_regime_filter";

export type ConditionCategory =
  | "entry"
  | "exit"
  | "screening"
  | "analysis"
  | "finance"
  | "news"
  | "risk"
  | "combo";

export type AssetClass = "국장" | "미장" | "코인" | "선물" | "옵션" | "공통";

export type Platform =
  | "tradingview"
  | "kiwoom"
  | "yestrader"
  | "mts"
  | "webhook"
  | "telegram";

export interface StrategyCondition {
  id: string;
  label: string;
  detail: string;
  plainKorean: string;
  category: ConditionCategory;
}

export interface StrategyCard {
  id: string;
  parentId?: string;
  sourceInput: string;
  title: string;
  oneLineSummary: string;
  strategyTypes: StrategyType[];
  conditionCategories: ConditionCategory[];
  entryConditions: StrategyCondition[];
  exitConditions: StrategyCondition[];
  screeningConditions: StrategyCondition[];
  filterConditions: StrategyCondition[];
  suitableAssets: AssetClass[];
  suitableTimeframes: string[];
  avoidRegimes: string[];
  riskSummary: string;
  validationIdeas: string[];
  nextActions: string[];
  conversionRequestedPlatforms: Platform[];
  createdAt: string;
  updatedAt: string;
  simulatedAt?: string;
}
