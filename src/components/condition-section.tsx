import { Card } from "@/components/card";
import type { StrategyCondition } from "@/types/strategy";

export function ConditionSection({
  title,
  conditions,
}: {
  title: string;
  conditions: StrategyCondition[];
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</h3>
      </div>
      <div className="grid gap-3">
        {conditions.map((condition) => (
          <Card key={condition.id} className="border-slate-100 p-4 shadow-none">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">{condition.label}</p>
              <p className="text-sm leading-6 text-slate-600">{condition.plainKorean}</p>
              <p className="text-xs leading-5 text-slate-500">{condition.detail}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
