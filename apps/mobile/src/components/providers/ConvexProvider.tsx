import { type ReactNode } from "react";
import { ConvexProvider as BaseConvexProvider, ConvexReactClient } from "convex/react";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;
let warnedAboutMissingConvex = false;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convex) {
    if (__DEV__ && !warnedAboutMissingConvex) {
      console.warn("EXPO_PUBLIC_CONVEX_URL is not set; mobile Convex client is disabled.");
      warnedAboutMissingConvex = true;
    }

    return <>{children}</>;
  }

  return <BaseConvexProvider client={convex}>{children}</BaseConvexProvider>;
}
