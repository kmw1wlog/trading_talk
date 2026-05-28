"use client";

import type { ReactNode } from "react";

import { StrategyStoreProvider } from "@/lib/storage/strategy-store";

export function AppProviders({ children }: { children: ReactNode }) {
  return <StrategyStoreProvider>{children}</StrategyStoreProvider>;
}
