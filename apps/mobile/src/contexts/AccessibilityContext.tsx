import { createContext, useEffect, useState, type ReactNode } from "react";
import { AccessibilityInfo, Dimensions, useColorScheme } from "react-native";

export interface AccessibilityState {
  reduceMotionEnabled: boolean;
  screenReaderEnabled: boolean;
  fontScale: number;
  screenWidth: number;
  screenHeight: number;
  colorScheme: "light" | "dark" | "unspecified" | null;
}

export const AccessibilityContext = createContext<AccessibilityState>({
  reduceMotionEnabled: false,
  screenReaderEnabled: false,
  fontScale: 1,
  screenWidth: Dimensions.get("window").width,
  screenHeight: Dimensions.get("window").height,
  colorScheme: null,
});

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();
  const [state, setState] = useState<Omit<AccessibilityState, "colorScheme">>({
    reduceMotionEnabled: false,
    screenReaderEnabled: false,
    fontScale: 1,
    screenWidth: Dimensions.get("window").width,
    screenHeight: Dimensions.get("window").height,
  });

  useEffect(() => {
    async function init() {
      const [reduceMotion, screenReader] = await Promise.all([
        AccessibilityInfo.isReduceMotionEnabled(),
        AccessibilityInfo.isScreenReaderEnabled(),
      ]);
      setState((prev) => ({
        ...prev,
        reduceMotionEnabled: reduceMotion,
        screenReaderEnabled: screenReader,
      }));
    }

    init();

    const reduceMotionSub = AccessibilityInfo.addEventListener("reduceMotionChanged", (enabled) =>
      setState((prev) => ({ ...prev, reduceMotionEnabled: enabled })),
    );

    const screenReaderSub = AccessibilityInfo.addEventListener("screenReaderChanged", (enabled) =>
      setState((prev) => ({ ...prev, screenReaderEnabled: enabled })),
    );

    const dimensionsSub = Dimensions.addEventListener("change", ({ window }) => {
      setState((prev) => ({
        ...prev,
        screenWidth: window.width,
        screenHeight: window.height,
        fontScale: window.fontScale,
      }));
    });

    return () => {
      reduceMotionSub.remove();
      screenReaderSub.remove();
      dimensionsSub.remove();
    };
  }, []);

  return (
    <AccessibilityContext.Provider value={{ ...state, colorScheme: colorScheme ?? null }}>
      {children}
    </AccessibilityContext.Provider>
  );
}
