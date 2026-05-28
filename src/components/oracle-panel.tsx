import { Badge } from "@/components/badge";
import { Card } from "@/components/card";
import { formatPercent } from "@/lib/utils";
import type { OracleAnalysis } from "@/types/simulation";

export function OraclePanel({ oracle }: { oracle: OracleAnalysis }) {
  return (
    <Card className="border-brand-100 bg-gradient-to-br from-brand-50 to-cyan-50 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">오라클 분석</h3>
          <p className="text-sm text-slate-600">미래 수익 보장이 아니라, 가상 데이터 안의 개선 가능성입니다.</p>
        </div>
        <Badge tone={oracle.overfitRisk === "높음" ? "warning" : "brand"}>
          과최적화 위험 {oracle.overfitRisk}
        </Badge>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Metric title="현재 전략 수익률" value={formatPercent(oracle.currentReturnPct)} />
        <Metric title="거래량 임계치 조정 후 최고" value={formatPercent(oracle.thresholdSweepBestPct)} />
        <Metric title="시간대 필터 추가 후 최고" value={formatPercent(oracle.timeFilterBestPct)} />
        <Metric title="자산군 변경 후 최고" value={formatPercent(oracle.assetSwitchBestPct)} />
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{oracle.note}</p>
    </Card>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/80 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{title}</p>
      <p className="mt-2 text-xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}
