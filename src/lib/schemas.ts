import { z } from "zod";

export const StrategyTypeSchema = z.enum([
  "scalping",
  "day_trading",
  "swing",
  "closing_bet",
  "breakout",
  "pullback",
  "mean_reversion",
  "volatility",
  "news_disclosure",
  "finance_filter",
  "market_regime_filter",
]);

export const ConditionCategorySchema = z.enum([
  "entry",
  "exit",
  "screening",
  "analysis",
  "finance",
  "news",
  "risk",
  "combo",
]);

export const AssetClassSchema = z.enum(["국장", "미장", "코인", "선물", "옵션", "공통"]);

export const PlatformSchema = z.enum([
  "tradingview",
  "kiwoom",
  "yestrader",
  "mts",
  "webhook",
  "telegram",
]);

export const StrategyConditionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  detail: z.string().min(1),
  plainKorean: z.string().min(1),
  category: ConditionCategorySchema,
});

export const StrategyCardSchema = z.object({
  id: z.string().min(1),
  parentId: z.string().optional(),
  sourceInput: z.string().min(5),
  title: z.string().min(1),
  oneLineSummary: z.string().min(1),
  strategyTypes: z.array(StrategyTypeSchema).min(1),
  conditionCategories: z.array(ConditionCategorySchema).min(1),
  entryConditions: z.array(StrategyConditionSchema).min(1),
  exitConditions: z.array(StrategyConditionSchema).min(1),
  screeningConditions: z.array(StrategyConditionSchema).min(1),
  filterConditions: z.array(StrategyConditionSchema).min(1),
  suitableAssets: z.array(AssetClassSchema).min(1),
  suitableTimeframes: z.array(z.string().min(1)).min(1),
  avoidRegimes: z.array(z.string().min(1)).min(1),
  riskSummary: z.string().min(1),
  validationIdeas: z.array(z.string().min(1)).min(1),
  nextActions: z.array(z.string().min(1)).min(1),
  conversionRequestedPlatforms: z.array(PlatformSchema),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  simulatedAt: z.string().optional(),
});

export const GenerateStrategyRequestSchema = z.object({
  input: z.string().min(5),
  mode: z.enum(["general", "entry", "exit", "screening", "cleanup"]).optional(),
});

export const SimulationRequestSchema = z.object({
  strategy: StrategyCardSchema,
});

export const SegmentInsightSchema = z.object({
  label: z.string().min(1),
  description: z.string().min(1),
  score: z.number(),
});

export const OracleAnalysisSchema = z.object({
  currentReturnPct: z.number(),
  thresholdSweepBestPct: z.number(),
  timeFilterBestPct: z.number(),
  assetSwitchBestPct: z.number(),
  overfitRisk: z.enum(["낮음", "보통", "높음"]),
  note: z.string().min(1),
});

export const SimulationReportSchema = z.object({
  id: z.string().min(1),
  strategyId: z.string().min(1),
  generatedAt: z.string().min(1),
  disclaimer: z.string().min(1),
  totalReturnPct: z.number(),
  winRatePct: z.number(),
  averagePnlPct: z.number(),
  maxDrawdownPct: z.number(),
  tradeCount: z.number().int(),
  bestTimeSegments: z.array(SegmentInsightSchema).min(1),
  worstTimeSegments: z.array(SegmentInsightSchema).min(1),
  bestAssets: z.array(AssetClassSchema).min(1),
  weakAssets: z.array(AssetClassSchema).min(1),
  strengths: z.array(z.string().min(1)).min(1),
  weaknesses: z.array(z.string().min(1)).min(1),
  improvementCandidates: z.array(z.string().min(1)).min(1),
  twentyMinuteSuggestion: z.string().min(1),
  oracle: OracleAnalysisSchema,
});

export const AnalyticsEventSchema = z.object({
  id: z.string().min(1),
  name: z.enum([
    "strategy_created",
    "strategy_saved",
    "simulation_run",
    "improvement_clicked",
    "conversion_clicked",
    "waitlist_joined",
    "priority_requested",
    "paid_intent_clicked",
    "share_clicked",
  ]),
  strategyId: z.string().optional(),
  platform: PlatformSchema.optional(),
  strategyTypes: z.array(StrategyTypeSchema).optional(),
  conditionCategories: z.array(ConditionCategorySchema).optional(),
  elapsedSecondsFromCreation: z.number().optional(),
  email: z.string().email().optional(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
  createdAt: z.string().min(1),
});
