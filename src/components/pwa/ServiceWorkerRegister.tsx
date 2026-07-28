"use client";

import { useEffect } from "react";

/**
 * Kill leftover offline SW immediately (dev + first paint).
 * A stale SW was serving a dead shell where buttons did nothing.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const wipe = async () => {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("loomos-") || k.includes("workbox"))
          .map((k) => caches.delete(k)),
      );
    };

    void wipe();

    if (process.env.NODE_ENV !== "production") return;

    const onLoad = () => {
      void navigator.serviceWorker.register("/sw.js").catch(() => {});
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}
