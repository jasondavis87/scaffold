import { useContext } from "react";

import { AccessibilityContext } from "@/contexts/AccessibilityContext";

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
