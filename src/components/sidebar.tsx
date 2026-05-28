"use client";

import Link from "next/link";
import { Archive, BookOpen, Boxes, CreditCard, FlaskConical, FolderOpen, Share2, Users } from "lucide-react";

import { Badge } from "@/components/badge";
import { StrategyDrawerList } from "@/components/strategy-drawer-list";
import type { ConditionCategory, Platform, StrategyCard } from "@/types/strategy";

export type DrawerFilter =
  | "all"
  | "recent"
  | "simulated"
  | "converted"
  | ConditionCategory
  | `platform:${Platform}`;

interface SidebarProps {
  items: StrategyCard[];
  selectedId?: string;
  activeFilter: DrawerFilter;
  onChangeFilter: (filter: DrawerFilter) => void;
  onSelectStrategy: (id: string) => void;
}

const categoryLabels: Record<ConditionCategory, string> = {
  entry: "진입식",
  exit: "청산식",
  screening: "종목식",
  analysis: "분석식",
  finance: "재무식",
  news: "뉴스식",
  risk: "리스크 관리식",
  combo: "조합식",
};

const platformFilters: Array<{ value: `platform:${Platform}`; label: string }> = [
  { value: "platform:tradingview", label: "트레이딩뷰 변환 요청함" },
  { value: "platform:kiwoom", label: "키움 변환 요청함" },
  { value: "platform:yestrader", label: "예스트레이더 변환 요청함" },
  { value: "platform:mts", label: "MTS 알람 변환 요청함" },
];

export function Sidebar({
  items,
  selectedId,
  activeFilter,
  onChangeFilter,
  onSelectStrategy,
}: SidebarProps) {
  return (
    <aside className="flex h-full flex-col gap-5 rounded-[32px] border border-white/70 bg-white/75 p-4 shadow-soft backdrop-blur">
      <div className="space-y-3">
        <div className="rounded-3xl bg-slate-950 p-4 text-white">
          <p className="text-sm text-slate-300">식 서랍</p>
          <p className="mt-2 text-xl font-semibold">저장된 전략 카드</p>
          <div className="mt-4 flex items-center gap-2">
            <Badge tone="accent">{items.length}개 저장</Badge>
            <Badge tone="default">베타 수요 수집 중</Badge>
          </div>
        </div>

        <FilterButton current={activeFilter} label="시간순 전체" value="all" onChange={onChangeFilter} />
        <FilterButton current={activeFilter} label="최근 생성한 전략 카드" value="recent" onChange={onChangeFilter} />
        <FilterButton current={activeFilter} label="최근 모의검증한 전략" value="simulated" onChange={onChangeFilter} />
        <FilterButton current={activeFilter} label="변환 요청한 전략" value="converted" onChange={onChangeFilter} />
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">조건 유형</p>
        {Object.entries(categoryLabels).map(([value, label]) => (
          <FilterButton
            key={value}
            current={activeFilter}
            label={label}
            value={value as ConditionCategory}
            onChange={onChangeFilter}
          />
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">플랫폼 요청함</p>
        {platformFilters.map((platform) => (
          <FilterButton
            key={platform.value}
            current={activeFilter}
            label={platform.label}
            value={platform.value}
            onChange={onChangeFilter}
          />
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <StrategyDrawerList
          items={items}
          selectedId={selectedId}
          emptyLabel="아직 이 필터에 저장된 전략 카드가 없습니다."
          onSelect={onSelectStrategy}
        />
      </div>

      <div className="grid gap-2 border-t border-slate-100 pt-4">
        <SidebarLink href="/" icon={FlaskConical} label="모의검증" />
        <SidebarLink href="/library" icon={BookOpen} label="자료실" />
        <SidebarLink href="/community" icon={Users} label="공유" />
        <SidebarLink href="/community" icon={Share2} label="커뮤니티" />
        <SidebarLink href="/" icon={Archive} label="내 보관함" />
        <SidebarLink href="/pricing" icon={CreditCard} label="쿠키/플랜" />
        <SidebarLink href="/admin" icon={Boxes} label="운영자 대시보드" />
        <SidebarLink href="/library" icon={FolderOpen} label="자료실 예시" />
      </div>
    </aside>
  );
}

function FilterButton<T extends DrawerFilter>({
  label,
  value,
  current,
  onChange,
}: {
  label: string;
  value: T;
  current: DrawerFilter;
  onChange: (value: T) => void;
}) {
  const active = current === value;

  return (
    <button
      type="button"
      className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition ${
        active ? "bg-brand-50 text-brand-800 ring-1 ring-brand-200" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
      }`}
      onClick={() => onChange(value)}
    >
      {label}
    </button>
  );
}

function SidebarLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof FlaskConical;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
