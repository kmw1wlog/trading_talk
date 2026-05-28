import { Sparkles } from "lucide-react";

import { Card } from "@/components/card";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="flex min-h-[280px] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="rounded-full bg-brand-50 p-4 text-brand-600">
        <Sparkles className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="max-w-md text-sm leading-6 text-slate-600">{description}</p>
      </div>
    </Card>
  );
}
