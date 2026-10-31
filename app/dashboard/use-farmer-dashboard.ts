"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { FarmerDashboardData } from "@/lib/farmer-dashboard-types";

export type SyncState = "loading" | "syncing" | "ready" | "partial" | "offline";
const INTERVAL = 5000;

function isDashboard(value: unknown): value is FarmerDashboardData {
  if (!value || typeof value !== "object") return false;
  const data = value as FarmerDashboardData;
  return (
    typeof data.profile?.name === "string" &&
    typeof data.generated_at === "string" &&
    [data.farms, data.crops, data.harvests, data.activities].every(
      (section) =>
        section &&
        ["available", "unavailable", "error"].includes(section.status) &&
        (section.data === null || Array.isArray(section.data)),
    ) &&
    !!data.credit_score &&
    !!data.list_limits
  );
}

/** Single-flight reads, paused when hidden/offline, with no domain mutations. */
export function useFarmerDashboard() {
  const router = useRouter();
  const [data, setData] = useState<FarmerDashboardData | null>(null);
  const [sync, setSync] = useState<SyncState>("loading");
  const [error, setError] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const controls = useRef({
    refresh: () => {},
    stop: () => {},
    resume: () => {},
  });

  useEffect(() => {
    let active = true;
    let stopped = false;
    let inFlight = false;
    let failures = 0;
    let fingerprint = "";
    let timer: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;
    const visible = () => document.visibilityState === "visible";
    const cancelTimer = () => {
      clearTimeout(timer);
      timer = undefined;
    };
    const schedule = () => {
      cancelTimer();
      if (active && !stopped && visible() && navigator.onLine)
        timer = setTimeout(
          () => void read(),
          Math.min(30000, INTERVAL * 2 ** failures),
        );
    };
    async function read() {
      if (!active || stopped || inFlight || !visible()) return;
      cancelTimer();
      if (!navigator.onLine) {
        setSync("offline");
        setError("Anda sedang offline. Data terakhir tetap tersedia.");
        return;
      }
      inFlight = true;
      controller = new AbortController();
      const requestController = controller;
      setSync((previous) => (previous === "loading" ? "loading" : "syncing"));
      try {
        const response = await fetch("/api/dashboard", {
          cache: "no-store",
          signal: requestController.signal,
        });
        const value = await response.json();
        if (!active || stopped || requestController.signal.aborted) return;
        if ([401, 403].includes(response.status)) {
          stopped = true;
          setData(null);
          setError("");
          router.replace("/login");
          return;
        }
        if (!response.ok)
          throw new Error(
            typeof value?.error === "string"
              ? value.error
              : "Data belum dapat dimuat.",
          );
        if (!isDashboard(value))
          throw new Error("Data belum dapat dibaca. Silakan coba lagi.");
        const nextFingerprint = JSON.stringify({
          farms: value.farms,
          crops: value.crops,
          harvests: value.harvests,
          activities: value.activities,
          credit: value.credit_score,
        });
        if (nextFingerprint !== fingerprint) {
          setAnnouncement(
            fingerprint
              ? "Catatan kebun Anda telah diperbarui."
              : "Catatan kebun Anda siap ditampilkan.",
          );
          fingerprint = nextFingerprint;
        }
        failures = 0;
        setData(value);
        setError("");
        setSync(
          [
            value.farms,
            value.crops,
            value.harvests,
            value.activities,
            value.credit_score,
          ].some((section) => section.status === "error")
            ? "partial"
            : "ready",
        );
      } catch (failure) {
        if (active && !stopped && !requestController.signal.aborted) {
          failures = Math.min(failures + 1, 3);
          setSync("offline");
          setError(
            failure instanceof Error
              ? failure.message
              : "Koneksi terputus. Data terakhir tetap tersedia.",
          );
        }
      } finally {
        inFlight = false;
        if (active && !stopped) schedule();
      }
    }
    const visibility = () => {
      cancelTimer();
      if (visible()) void read();
    };
    const offline = () => {
      cancelTimer();
      controller?.abort();
      setSync("offline");
      setError("Anda sedang offline. Data terakhir tetap tersedia.");
    };
    const refresh = () => void read();
    controls.current = {
      refresh,
      stop: () => {
        stopped = true;
        cancelTimer();
        controller?.abort();
        // Next's cached routes can retain hidden component trees. Erase the
        // private snapshot before navigation, not just when unmounting.
        setData(null);
        setAnnouncement("");
        setError("");
        setSync("loading");
      },
      resume: () => {
        stopped = false;
        void read();
      },
    };
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("online", refresh);
    window.addEventListener("offline", offline);
    window.addEventListener("focus", refresh);
    void Promise.resolve().then(read);
    return () => {
      active = false;
      cancelTimer();
      controller?.abort();
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", offline);
      window.removeEventListener("focus", refresh);
      controls.current = {
        refresh: () => {},
        stop: () => {},
        resume: () => {},
      };
    };
  }, [router]);

  return {
    data,
    sync,
    error,
    announcement,
    refresh: useCallback(() => controls.current.refresh(), []),
    stop: useCallback(() => controls.current.stop(), []),
    resume: useCallback(() => controls.current.resume(), []),
  };
}
