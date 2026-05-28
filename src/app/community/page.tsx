import Link from "next/link";

import { Card } from "@/components/card";

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-shell">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">커뮤니티</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">전략 카드 공유소 준비 중</h1>
          </div>
          <Link href="/" className="text-sm text-brand-700 hover:text-brand-800">
            메인으로 돌아가기
          </Link>
        </div>
        <Card className="p-6">
          <p className="text-sm leading-7 text-slate-600">
            공유 단위 예시: 전략 카드, 진입 조건, 청산 조건, 검증 리포트 일부
          </p>
        </Card>
      </div>
    </main>
  );
}
