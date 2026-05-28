"use client";

import { ANALYTICS_STORAGE_KEY } from "@/lib/analytics/analytics-types";
import { AnalyticsEventSchema } from "@/lib/schemas";
import type { AnalyticsEvent } from "@/types/analytics";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function readAnalyticsEvents(): AnalyticsEvent[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => AnalyticsEventSchema.safeParse(item))
      .filter((item) => item.success)
      .map((item) => item.data);
  } catch {
    return [];
  }
}

export function writeAnalyticsEvents(events: AnalyticsEvent[]) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(events));
  } catch {
    // Ignore local storage failures in MVP mode.
  }
}

export async function trackAnalyticsEvent(event: AnalyticsEvent) {
  const events = readAnalyticsEvents();
  writeAnalyticsEvents([event, ...events]);

  try {
    await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });
  } catch {
    // Server logging is best-effort only.
  }
}
