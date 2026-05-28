"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ZodType } from "zod";

import { AnalyticsEventSchema, SimulationReportSchema, StrategyCardSchema } from "@/lib/schemas";
import type { AnalyticsEvent } from "@/types/analytics";
import type { SimulationReport } from "@/types/simulation";
import type { StrategyCard } from "@/types/strategy";

const strategyCardsKey = "siktalk.strategyCards";
const analyticsKey = "siktalk.analyticsEvents";
const reportsKey = "siktalk.simulationReports";
const selectedStrategyIdKey = "siktalk.selectedStrategyId";

interface StrategyStoreContextValue {
  mounted: boolean;
  strategyCards: StrategyCard[];
  analyticsEvents: AnalyticsEvent[];
  simulationReports: SimulationReport[];
  selectedStrategyId?: string;
  selectedStrategy?: StrategyCard;
  selectedReport?: SimulationReport;
  addStrategy: (card: StrategyCard) => void;
  updateStrategy: (card: StrategyCard) => void;
  deleteStrategy: (id: string) => void;
  selectStrategy: (id: string) => void;
  addAnalyticsEvent: (event: AnalyticsEvent) => void;
  getEvents: () => AnalyticsEvent[];
  addSimulationReport: (report: SimulationReport) => void;
}

const StrategyStoreContext = createContext<StrategyStoreContextValue | undefined>(undefined);

function parseArray<T>(key: string, parser: ZodType<T>) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return [];
    }
    const value = JSON.parse(raw);
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => parser.safeParse(item))
      .filter((item): item is { success: true; data: T } => item.success)
      .map((item) => item.data);
  } catch {
    return [];
  }
}

export function StrategyStoreProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [strategyCards, setStrategyCards] = useState<StrategyCard[]>([]);
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>([]);
  const [simulationReports, setSimulationReports] = useState<SimulationReport[]>([]);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>();

  useEffect(() => {
    setStrategyCards(parseArray(strategyCardsKey, StrategyCardSchema));
    setAnalyticsEvents(parseArray(analyticsKey, AnalyticsEventSchema));
    setSimulationReports(parseArray(reportsKey, SimulationReportSchema));
    setSelectedStrategyId(window.localStorage.getItem(selectedStrategyIdKey) ?? undefined);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }
    window.localStorage.setItem(strategyCardsKey, JSON.stringify(strategyCards));
  }, [mounted, strategyCards]);

  useEffect(() => {
    if (!mounted) {
      return;
    }
    window.localStorage.setItem(analyticsKey, JSON.stringify(analyticsEvents));
  }, [analyticsEvents, mounted]);

  useEffect(() => {
    if (!mounted) {
      return;
    }
    window.localStorage.setItem(reportsKey, JSON.stringify(simulationReports));
  }, [mounted, simulationReports]);

  useEffect(() => {
    if (!mounted) {
      return;
    }
    if (selectedStrategyId) {
      window.localStorage.setItem(selectedStrategyIdKey, selectedStrategyId);
    } else {
      window.localStorage.removeItem(selectedStrategyIdKey);
    }
  }, [mounted, selectedStrategyId]);

  const addStrategy = useCallback((card: StrategyCard) => {
    setStrategyCards((current) => [card, ...current]);
    setSelectedStrategyId(card.id);
  }, []);

  const updateStrategy = useCallback((card: StrategyCard) => {
    setStrategyCards((current) => current.map((item) => (item.id === card.id ? card : item)));
  }, []);

  const deleteStrategy = useCallback(
    (id: string) => {
      setStrategyCards((current) => current.filter((item) => item.id !== id));
      setSimulationReports((current) => current.filter((item) => item.strategyId !== id));
      setAnalyticsEvents((current) => current.filter((item) => item.strategyId !== id));
      if (selectedStrategyId === id) {
        setSelectedStrategyId(undefined);
      }
    },
    [selectedStrategyId],
  );

  const selectStrategy = useCallback((id: string) => {
    setSelectedStrategyId(id);
  }, []);

  const addAnalyticsEvent = useCallback((event: AnalyticsEvent) => {
    setAnalyticsEvents((current) => [event, ...current]);
  }, []);

  const getEvents = useCallback(() => analyticsEvents, [analyticsEvents]);

  const addSimulationReport = useCallback((report: SimulationReport) => {
    setSimulationReports((current) => {
      const rest = current.filter((item) => item.strategyId !== report.strategyId);
      return [report, ...rest];
    });
  }, []);

  const selectedStrategy = useMemo(
    () => strategyCards.find((card) => card.id === selectedStrategyId),
    [selectedStrategyId, strategyCards],
  );
  const selectedReport = useMemo(
    () => simulationReports.find((report) => report.strategyId === selectedStrategyId),
    [selectedStrategyId, simulationReports],
  );

  const value = useMemo<StrategyStoreContextValue>(
    () => ({
      mounted,
      strategyCards,
      analyticsEvents,
      simulationReports,
      selectedStrategyId,
      selectedStrategy,
      selectedReport,
      addStrategy,
      updateStrategy,
      deleteStrategy,
      selectStrategy,
      addAnalyticsEvent,
      getEvents,
      addSimulationReport,
    }),
    [
      mounted,
      strategyCards,
      analyticsEvents,
      simulationReports,
      selectedStrategyId,
      selectedStrategy,
      selectedReport,
      addStrategy,
      updateStrategy,
      deleteStrategy,
      selectStrategy,
      addAnalyticsEvent,
      getEvents,
      addSimulationReport,
    ],
  );

  return <StrategyStoreContext.Provider value={value}>{children}</StrategyStoreContext.Provider>;
}

export function useStrategyStore() {
  const context = useContext(StrategyStoreContext);

  if (!context) {
    throw new Error("useStrategyStore must be used inside StrategyStoreProvider");
  }

  return context;
}
