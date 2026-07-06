import { useEffect, useRef, type PropsWithChildren } from "react";
import { usePathname } from "expo-router";

import { AnalyticsEvents, track } from "@packages/shared/analytics";

function toScreenName(pathname: string) {
  return (
    pathname
      .replace(/^\/\([^)]+\)\//, "")
      .replace(/^\//, "")
      .replace(/-/g, "_")
      .replace(/\//g, "_")
      .replace(/_$/, "") || "home"
  );
}

export function ScreenTrackingProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const previousPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname === previousPathnameRef.current) return;

    const previousPathname = previousPathnameRef.current;
    track(AnalyticsEvents.SCREEN_VIEWED, {
      screen_name: toScreenName(pathname),
      previous_screen: previousPathname ? toScreenName(previousPathname) : undefined,
    });
    previousPathnameRef.current = pathname;
  }, [pathname]);

  return <>{children}</>;
}
