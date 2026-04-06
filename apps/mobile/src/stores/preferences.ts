import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface PreferencesState {
  // Internal
  _hasHydrated: boolean;

  // User preferences
  onboardingComplete: boolean;
  theme: "light" | "dark" | "system";

  // Actions
  updatePreferences: (
    updates: Partial<Pick<PreferencesState, "onboardingComplete" | "theme">>,
  ) => void;
  reset: () => void;
}

const initialState = {
  onboardingComplete: false,
  theme: "system" as const,
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      _hasHydrated: false,
      ...initialState,

      updatePreferences: (updates) => set(updates),

      reset: () => set(initialState),
    }),
    {
      name: "preferences",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => () => {
        usePreferencesStore.setState({ _hasHydrated: true });
      },
      partialize: (state) => ({
        onboardingComplete: state.onboardingComplete,
        theme: state.theme,
      }),
    },
  ),
);
