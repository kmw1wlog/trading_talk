"use client";

import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { PromptExamples } from "@/components/prompt-examples";
import { Textarea } from "@/components/textarea";
import { INVESTMENT_DISCLAIMER } from "@/lib/constants";

interface StrategyComposerProps {
  value: string;
  loading: boolean;
  error?: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function StrategyComposer({
  value,
  loading,
  error,
  onChange,
  onSubmit,
}: StrategyComposerProps) {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-brand-900 p-6 text-white sm:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-3 text-center sm:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-brand-100">
            <Sparkles className="h-4 w-4" />
            어떤 매매 아이디어를 정리해볼까요?
          </p>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              말로 적으면 AI가 전략 카드로 나눠드립니다
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              조건식 몰라도 괜찮습니다. 말로 적으면 AI가 진입·청산·종목 조건으로 나눠줍니다.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <Textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="예: 거래량이 갑자기 늘고 전고점을 돌파하면 관심종목으로 보고 싶어."
            className="border-white/20 bg-white text-slate-900 shadow-soft"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="beta" size="lg" disabled={loading} onClick={onSubmit}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  전략 카드 만드는 중
                </>
              ) : (
                "전략 카드 만들기"
              )}
            </Button>
            <p className="text-xs leading-5 text-slate-300">{INVESTMENT_DISCLAIMER}</p>
          </div>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        </div>
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-200">예시 아이디어</p>
          <PromptExamples onSelect={onChange} />
        </div>
      </div>
    </Card>
  );
}
