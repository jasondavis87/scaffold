import { useEffect, useMemo, useRef, type PropsWithChildren } from "react";
import { AppState, Platform } from "react-native";
import Constants from "expo-constants";
import { PostHogProvider as BasePostHogProvider, usePostHog } from "posthog-react-native";

import {
  AnalyticsEvents,
  registerSuperProperties,
  setAnalyticsClient,
  track,
  type AnalyticsClient,
} from "@packages/shared/analytics";

const SITE = "scaffold.mobile";

function resolveEnvironment() {
  return __DEV__ ? "development" : "production";
}

function PostHogStatus({ children }: PropsWithChildren) {
  const posthog = usePostHog();
  const readyRef = useRef(false);

  useEffect(() => {
    if (!posthog || readyRef.current) return;

    setAnalyticsClient(posthog as unknown as AnalyticsClient);
    registerSuperProperties({
      site: SITE,
      environment: resolveEnvironment(),
      platform: Platform.OS,
      app_version: Constants.expoConfig?.version ?? "0.1.0",
    });
    track(AnalyticsEvents.APP_OPENED);
    readyRef.current = true;
  }, [posthog]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active" && readyRef.current) {
        track(AnalyticsEvents.APP_OPENED);
      }
    });

    return () => subscription.remove();
  }, []);

  return <>{children}</>;
}

export function PostHogProvider({ children }: PropsWithChildren) {
  const apiKey = process.env.EXPO_PUBLIC_POSTHOG_KEY;
  const host = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

  const options = useMemo(
    () => ({
      host,
      captureAppLifecycleEvents: true,
      disabled: !apiKey,
    }),
    [host, apiKey],
  );

  const autocapture = useMemo(
    () => ({
      captureScreens: false,
      captureTouches: false,
    }),
    [],
  );

  if (!apiKey) {
    setAnalyticsClient(null);
    return <>{children}</>;
  }

  return (
    <BasePostHogProvider apiKey={apiKey} options={options} autocapture={autocapture}>
      <PostHogStatus>{children}</PostHogStatus>
    </BasePostHogProvider>
  );
}
