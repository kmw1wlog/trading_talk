import Link from "next/link";

import { Card } from "@/components/card";
import { exampleStrategies } from "@/data/example-strategies";
import { INVESTMENT_DISCLAIMER } from "@/lib/constants";

export default function LibraryPage() {
  return (
    <main className="min-h-screen bg-shell">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">자료실</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">예시 전략 카드 보관함</h1>
          </div>
          <Link href="/" className="text-sm text-brand-700 hover:text-brand-800">
            메인으로 돌아가기
          </Link>
        </div>
        <p className="mb-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          {INVESTMENT_DISCLAIMER}
        </p>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {exampleStrategies.slice(0, 5).map((item, index) => (
            <Card key={item} className="p-6">
              <p className="text-sm text-slate-500">예시 카드 {index + 1}</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950">{item}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                실제 투자 추천이 아닌 예시 카드입니다. 입력 아이디어를 전략 카드처럼 어떻게 나누는지 미리 보는 용도입니다.
              </p>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
