"use client";

import Link from "next/link";

import { PlanCards } from "@/components/plan-cards";
import { useStrategyStore } from "@/lib/storage/strategy-store";

export default function PricingPage() {
  const { addAnalyticsEvent } = useStrategyStore();

  const handleInterest = async (plan: string) => {
    const event = {
      id: crypto.randomUUID(),
      name: "paid_intent_clicked" as const,
      createdAt: new Date().toISOString(),
      metadata: {
        plan,
      },
    };
    addAnalyticsEvent(event);
    try {
      await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });
    } catch {
      // Best effort only.
    }
  };

  return (
    <main className="min-h-screen bg-shell">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">쿠키/플랜</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">관심 기반 베타 플랜 비교</h1>
          </div>
          <Link href="/" className="text-sm text-brand-700 hover:text-brand-800">
            메인으로 돌아가기
          </Link>
        </div>
        <p className="mb-6 rounded-2xl bg-slate-950 px-4 py-3 text-sm leading-6 text-white">
          실제 결제는 구현하지 않았습니다. 버튼은 관심 클릭만 기록합니다.
        </p>
        <PlanCards onInterestClick={handleInterest} />
      </div>
    </main>
  );
}
