"use client";

import { type ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convex) {
    if (process.env.NODE_ENV === "development") {
      return (
        <div className="flex min-h-screen items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-lg font-bold">Convex not configured</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Set NEXT_PUBLIC_CONVEX_URL in apps/landing/.env.local
              <br />
              Run: cd packages/backend &amp;&amp; bunx convex dev
            </p>
          </div>
        </div>
      );
    }
    return <>{children}</>;
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
