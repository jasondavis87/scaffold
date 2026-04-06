import { type ReactNode } from "react";
import { ConvexProvider as BaseConvexProvider, ConvexReactClient } from "convex/react";

import { Text, View } from "@/lib/react-native";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convex) {
    if (__DEV__) {
      return (
        <View className="bg-background flex-1 items-center justify-center p-8">
          <Text className="text-foreground text-center text-lg font-bold">
            Convex not configured
          </Text>
          <Text className="text-muted-foreground mt-2 text-center text-sm">
            Set EXPO_PUBLIC_CONVEX_URL in apps/mobile/.env.local{"\n\n"}
            Run: cd packages/backend {"&&"} bunx convex dev
          </Text>
        </View>
      );
    }
    return <>{children}</>;
  }

  return <BaseConvexProvider client={convex}>{children}</BaseConvexProvider>;
}
