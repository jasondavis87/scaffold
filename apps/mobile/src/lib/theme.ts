/**
 * Navigation theme for APIs that cannot take a className or CSS variable.
 *
 * React Navigation options take raw color strings, so this is the third copy
 * of the palette. The other copies live in packages/shared/tokens.css (web)
 * and apps/mobile/src/global.css (mobile). Keep this list short and update all
 * three files together; scripts/check-token-sync.ts checks their names.
 */

export interface NavTheme {
  background: string;
  border: string;
  primary: string;
  text: string;
  muted: string;
}

export const NAV_THEME: Record<"light" | "dark", NavTheme> = {
  light: {
    background: "#ffffff",
    border: "#e4e4e7",
    primary: "#18181b",
    text: "#09090b",
    muted: "#71717a",
  },
  dark: {
    background: "#09090b",
    border: "#27272a",
    primary: "#fafafa",
    text: "#fafafa",
    muted: "#a1a1aa",
  },
} as const;

export function getNavTheme(isDark: boolean): NavTheme {
  return isDark ? NAV_THEME.dark : NAV_THEME.light;
}
