"use client";

import Link from "next/link";
import { Menu, PanelLeftClose } from "lucide-react";

import { Button } from "@/components/button";

interface TopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function TopBar({ sidebarOpen, onToggleSidebar }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            aria-label="식 서랍 열기"
            className="lg:hidden"
            onClick={onToggleSidebar}
          >
            {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
          <div>
            <p className="text-lg font-semibold text-slate-950">식톡</p>
            <p className="text-sm text-slate-500">말하면 전략 카드가 된다</p>
          </div>
        </div>
        <nav className="hidden items-center gap-2 md:flex">
          <Link className="rounded-full px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100" href="/library">
            자료실
          </Link>
          <Link className="rounded-full px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100" href="/community">
            커뮤니티
          </Link>
          <Link className="rounded-full px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100" href="/pricing">
            쿠키/플랜
          </Link>
          <Link className="rounded-full px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100" href="/admin">
            운영자 화면
          </Link>
        </nav>
      </div>
    </header>
  );
}
