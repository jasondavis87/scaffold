import "../global.css";

import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import { AnimatedIcon } from "@/components/animated-icon";
import { AppTabs } from "@/components/app-tabs";
import { ConvexClientProvider } from "@/components/providers/ConvexProvider";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { View } from "@/lib/react-native";
import { usePreferencesStore } from "@/stores/preferences";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({});
  const [_splashDone, setSplashDone] = useState(false);
  const hasHydrated = usePreferencesStore((s) => s._hasHydrated);

  useEffect(() => {
    if (loaded && hasHydrated) {
      SplashScreen.hideAsync();
    }
  }, [loaded, hasHydrated]);

  if (!loaded || !hasHydrated) {
    return (
      <View className="bg-background flex-1 items-center justify-center">
        <AnimatedIcon onComplete={() => setSplashDone(true)} />
      </View>
    );
  }

  return (
    <ConvexClientProvider>
      <AccessibilityProvider>
        <AppTabs />
        <StatusBar style="auto" />
      </AccessibilityProvider>
    </ConvexClientProvider>
  );
}
