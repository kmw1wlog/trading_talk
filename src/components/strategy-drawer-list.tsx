import { Clock3, FlaskConical, Radio, Save } from "lucide-react";

import { Badge } from "@/components/badge";
import { Card } from "@/components/card";
import { formatDateTime } from "@/lib/utils";
import type { StrategyCard } from "@/types/strategy";

export function StrategyDrawerList({
  items,
  selectedId,
  emptyLabel,
  onSelect,
}: {
  items: StrategyCard[];
  selectedId?: string;
  emptyLabel: string;
  onSelect: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <Card className="border-dashed border-slate-200 p-4 text-sm leading-6 text-slate-500">
        {emptyLabel}
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isSelected = item.id === selectedId;

        return (
          <button
            key={item.id}
            type="button"
            className={`w-full text-left transition ${isSelected ? "scale-[1.01]" : ""}`}
            onClick={() => onSelect(item.id)}
          >
            <Card
              className={`p-4 ${isSelected ? "border-brand-300 ring-2 ring-brand-100" : "border-white/80 hover:border-brand-100"}`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm leading-5 text-slate-600">{item.oneLineSummary}</p>
                  </div>
                  <Badge tone="brand">{item.strategyTypes[0]}</Badge>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    {formatDateTime(item.createdAt)}
                  </span>
                  {item.simulatedAt ? (
                    <span className="inline-flex items-center gap-1">
                      <FlaskConical className="h-3.5 w-3.5" />
                      최근 검증
                    </span>
                  ) : null}
                  {item.conversionRequestedPlatforms.length > 0 ? (
                    <span className="inline-flex items-center gap-1">
                      <Radio className="h-3.5 w-3.5" />
                      변환 요청 {item.conversionRequestedPlatforms.length}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1">
                    <Save className="h-3.5 w-3.5" />
                    저장됨
                  </span>
                </div>
              </div>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
