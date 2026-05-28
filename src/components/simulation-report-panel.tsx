import { Badge } from "@/components/badge";
import { Card } from "@/components/card";
import { OraclePanel } from "@/components/oracle-panel";
import { formatPercent } from "@/lib/utils";
import type { SimulationReport } from "@/types/simulation";

export function SimulationReportPanel({ report }: { report: SimulationReport }) {
  return (
    <div className="space-y-5">
      <Card className="p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">가상 모의검증 리포트</h2>
            <p className="mt-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
              {report.disclaimer}
            </p>
          </div>
          <Badge tone="warning">가상 데이터</Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <Metric title="전체 수익률" value={formatPercent(report.totalReturnPct)} />
          <Metric title="승률" value={formatPercent(report.winRatePct)} />
          <Metric title="평균 손익" value={formatPercent(report.averagePnlPct)} />
          <Metric title="MDD" value={formatPercent(report.maxDrawdownPct)} />
          <Metric title="거래 횟수" value={`${report.tradeCount}회`} />
        </div>
      </Card>

      <Card className="p-6">
        <div className="grid gap-5 xl:grid-cols-2">
          <ListBlock title="이 전략의 장점" items={report.strengths} />
          <ListBlock title="가장 큰 약점" items={report.weaknesses} />
          <InsightBlock title="잘 먹힌 시간대" items={report.bestTimeSegments} />
          <InsightBlock title="안 먹힌 시간대" items={report.worstTimeSegments} />
        </div>
      </Card>

      <Card className="p-6">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">개선 후보</h3>
            <ul className="space-y-2 text-sm leading-6 text-slate-600">
              {report.improvementCandidates.map((item) => (
                <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">20분 개선 제안</h3>
            <p className="rounded-2xl bg-brand-50 px-4 py-4 text-sm leading-6 text-brand-900">
              {report.twentyMinuteSuggestion}
            </p>
            <div className="space-y-2 text-sm text-slate-600">
              <p>잘 먹힌 자산군: {report.bestAssets.join(", ")}</p>
              <p>안 먹힌 자산군: {report.weakAssets.join(", ")}</p>
            </div>
          </div>
        </div>
      </Card>

      <OraclePanel oracle={report.oracle} />
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <ul className="space-y-2 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item} className="rounded-2xl border border-slate-100 px-4 py-3">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function InsightBlock({
  title,
  items,
}: {
  title: string;
  items: SimulationReport["bestTimeSegments"];
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={`${title}-${item.label}`} className="rounded-2xl border border-slate-100 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-slate-900">{item.label}</p>
              <Badge tone="accent">점수 {item.score}</Badge>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
