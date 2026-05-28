"use client";

import { Button } from "@/components/button";
import { Card } from "@/components/card";

interface PlanCardsProps {
  onInterestClick: (plan: string) => void;
}

const plans = [
  {
    name: "Free",
    price: "₩0",
    description: "전략 카드 생성, 식 서랍 저장, 기본 가상 검증",
    cta: "계속 무료로 써보기",
  },
  {
    name: "Plus",
    price: "베타 준비 중",
    description: "더 많은 저장 슬롯, 공유 템플릿, 개선 플로우 확장",
    cta: "베타 가격 알림 받기",
  },
  {
    name: "Pro",
    price: "수요 확인 중",
    description: "팀 공유, 더 깊은 리포트, 변환 우선순위 요청 기능 구상 중",
    cta: "이 기능에 관심 있어요",
  },
];

export function PlanCards({ onInterestClick }: PlanCardsProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {plans.map((plan, index) => (
        <Card
          key={plan.name}
          className={`p-6 ${index === 1 ? "bg-gradient-to-b from-brand-50 to-white" : ""}`}
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">{plan.name}</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">{plan.price}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{plan.description}</p>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>실제 결제는 아직 열려 있지 않습니다.</li>
              <li>관심 클릭만 기록하고 수요를 확인합니다.</li>
              <li>자동매매나 실거래 연결은 제공하지 않습니다.</li>
            </ul>
            <Button
              variant={index === 1 ? "beta" : "secondary"}
              className="w-full"
              onClick={() => onInterestClick(plan.name)}
            >
              {plan.cta}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
