"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";

import {
  AnalyticsEvents,
  registerSuperProperties,
  setAnalyticsClient,
  track,
  type AnalyticsClient,
} from "@packages/shared/analytics";

const SITE = "scaffold.landing";
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "0.1.0";

function resolveEnvironment() {
  return process.env.NODE_ENV === "production" ? "production" : "development";
}

function toScreenName(pathname: string) {
  return pathname.replace(/^\//, "").replace(/\//g, "_") || "home";
}

export function PostHogProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const initializedRef = useRef(false);
  const previousPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    if (initializedRef.current || typeof window === "undefined") return;

    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!apiKey) {
      setAnalyticsClient(null);
      return;
    }

    posthog.init(apiKey, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      person_profiles: "identified_only",
    });

    setAnalyticsClient(posthog as unknown as AnalyticsClient);
    registerSuperProperties({
      site: SITE,
      environment: resolveEnvironment(),
      platform: "web",
      app_version: APP_VERSION,
    });
    track(AnalyticsEvents.APP_OPENED);
    initializedRef.current = true;
  }, []);

  useEffect(() => {
    if (!initializedRef.current || !pathname) return;

    const previousPathname = previousPathnameRef.current;
    if (previousPathname === pathname) return;

    track(AnalyticsEvents.SCREEN_VIEWED, {
      screen_name: toScreenName(pathname),
      previous_screen: previousPathname ? toScreenName(previousPathname) : undefined,
    });
    previousPathnameRef.current = pathname;
  }, [pathname]);

  return <>{children}</>;
}
