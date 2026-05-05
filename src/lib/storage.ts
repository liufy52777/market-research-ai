import type { ReportRecord } from "./types";

export const STORAGE_KEY = "market-research-reports";
export const MAX_REPORTS = 20;

export function readReports(): ReportRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

export function writeReports(reports: ReportRecord[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch {
    // localStorage write failed — silently ignore
  }
}
