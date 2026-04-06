// Reference config for UniWind theme tokens.
// UniWind uses its own Metro plugin — this file documents the shared token contract.
// Actual theming is done in apps/mobile/src/global.css via @variant directives.

export const themeTokens = {
  colors: {
    background: "hsl(0 0% 100%)",
    foreground: "hsl(0 0% 3.9%)",
    primary: "hsl(0 0% 9%)",
    "primary-foreground": "hsl(0 0% 98%)",
    secondary: "hsl(0 0% 96.1%)",
    "secondary-foreground": "hsl(0 0% 9%)",
    muted: "hsl(0 0% 96.1%)",
    "muted-foreground": "hsl(0 0% 45.1%)",
    accent: "hsl(0 0% 96.1%)",
    "accent-foreground": "hsl(0 0% 9%)",
    destructive: "hsl(0 84.2% 60.2%)",
    border: "hsl(0 0% 89.8%)",
    ring: "hsl(0 0% 3.9%)",
  },
} as const;
