import type { AssetClass } from "./strategy";

export interface SegmentInsight {
  label: string;
  description: string;
  score: number;
}

export interface OracleAnalysis {
  currentReturnPct: number;
  thresholdSweepBestPct: number;
  timeFilterBestPct: number;
  assetSwitchBestPct: number;
  overfitRisk: "낮음" | "보통" | "높음";
  note: string;
}

export interface SimulationReport {
  id: string;
  strategyId: string;
  generatedAt: string;
  disclaimer: string;
  totalReturnPct: number;
  winRatePct: number;
  averagePnlPct: number;
  maxDrawdownPct: number;
  tradeCount: number;
  bestTimeSegments: SegmentInsight[];
  worstTimeSegments: SegmentInsight[];
  bestAssets: AssetClass[];
  weakAssets: AssetClass[];
  strengths: string[];
  weaknesses: string[];
  improvementCandidates: string[];
  twentyMinuteSuggestion: string;
  oracle: OracleAnalysis;
}
