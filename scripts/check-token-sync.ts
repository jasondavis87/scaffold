#!/usr/bin/env bun
/**
 * Check that the token names used by web, mobile, and native navigation stay
 * synchronized. The representations differ because Tailwind, UniWind, and
 * React Navigation each consume tokens differently.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const WEB = join(ROOT, "packages/shared/tokens.css");
const WEB_GLOBALS = join(ROOT, "packages/ui/src/styles/globals.css");
const MOBILE = join(ROOT, "apps/mobile/src/global.css");
const NAV = join(ROOT, "apps/mobile/src/lib/theme.ts");

const errors: string[] = [];

function block(source: string, start: RegExp): string {
  const match = start.exec(source);
  if (!match) return "";

  const from = match.index + match[0].length;
  let depth = 1;
  let index = from;
  while (index < source.length && depth > 0) {
    if (source[index] === "{") depth++;
    if (source[index] === "}") depth--;
    index++;
  }
  return source.slice(from, index);
}

function names(source: string, prefix = ""): Set<string> {
  const found = new Set<string>();
  const declaration = new RegExp(`--${prefix}([a-z0-9-]+)\\s*:`, "g");
  let match: RegExpExecArray | null;
  while ((match = declaration.exec(source)) !== null) found.add(match[1]!);
  return found;
}

function addMissing(source: Set<string>, target: Set<string>, message: (name: string) => string) {
  for (const name of source) {
    if (!target.has(name)) errors.push(message(name));
  }
}

const webCss = readFileSync(WEB, "utf8");
const webGlobals = readFileSync(WEB_GLOBALS, "utf8");
const webLight = names(block(webCss, /:root\s*\{/));
const webDark = names(block(webCss, /\.dark\s*\{/));
const webTheme = block(webGlobals, /@theme\s+inline\s*\{/);
const webMappings = new Map<string, string>();
for (const match of webTheme.matchAll(/--color-([a-z0-9-]+)\s*:\s*var\(--([a-z0-9-]+)\)/g)) {
  webMappings.set(match[1]!, match[2]!);
}

if (webLight.size === 0 || webDark.size === 0 || webMappings.size === 0) {
  errors.push("could not parse web token blocks — did the file structure change?");
}

const schemeInvariant = new Set(["radius"]);
for (const name of webLight) {
  if (!schemeInvariant.has(name) && !webDark.has(name)) {
    errors.push(`tokens.css: --${name} in :root but not in .dark`);
  }
}
for (const name of webDark) {
  if (!schemeInvariant.has(name) && !webLight.has(name)) {
    errors.push(`tokens.css: --${name} in .dark but not in :root`);
  }
}

// Fix 1's bidirectional web invariant. Radius is a non-color token and is
// intentionally mapped under @theme as a radius scale, not a color utility.
const webTokenNames = new Set([...webLight, ...webDark]);
for (const name of webTokenNames) {
  if (!schemeInvariant.has(name) && !webMappings.has(name)) {
    errors.push(`tokens.css defines --${name} but globals.css has no --color-${name} mapping`);
  }
}
for (const [mapping, token] of webMappings) {
  if (!webTokenNames.has(token)) {
    errors.push(`globals.css maps --color-${mapping} to undefined --${token}`);
  }
}

if (!existsSync(MOBILE)) {
  if (existsSync(NAV)) errors.push("theme.ts exists but apps/mobile is absent");
} else {
  const mobileCss = readFileSync(MOBILE, "utf8");
  const navTs = readFileSync(NAV, "utf8");
  const mobileLight = names(block(mobileCss, /@variant\s+light\s*\{/), "");
  const mobileDark = names(block(mobileCss, /@variant\s+dark\s*\{/), "");
  const mobileTheme = block(mobileCss, /@theme\s+inline\s*\{/);
  const mobileMappings = names(mobileTheme, "color-");

  if (mobileLight.size === 0 || mobileDark.size === 0 || mobileMappings.size === 0) {
    errors.push("could not parse mobile token blocks — did the file structure change?");
  }
  addMissing(mobileLight, mobileDark, (name) => `global.css: --${name} in light but not in dark`);
  addMissing(mobileDark, mobileLight, (name) => `global.css: --${name} in dark but not in light`);

  const webOnly = new Set([
    "radius",
    "chart-1",
    "chart-2",
    "chart-3",
    "chart-4",
    "chart-5",
    "sidebar",
    "sidebar-foreground",
    "sidebar-primary",
    "sidebar-primary-foreground",
    "sidebar-accent",
    "sidebar-accent-foreground",
    "sidebar-border",
    "sidebar-ring",
  ]);
  for (const name of webLight) {
    if (!webOnly.has(name) && !mobileLight.has(name)) {
      errors.push(`tokens.css defines --${name} but global.css has no --${name} in mobile`);
    }
  }
  for (const name of mobileLight) {
    if (!webTokenNames.has(name)) errors.push(`global.css defines mobile-only --${name}`);
  }
  for (const name of mobileMappings) {
    if (!mobileLight.has(name)) errors.push(`global.css maps --color-${name} to no mobile token`);
  }

  const navLight = block(navTs, /light:\s*\{/);
  const navDark = block(navTs, /dark:\s*\{/);
  const navKeys = (source: string) =>
    new Set([...source.matchAll(/(\w+)\s*:\s*"/g)].map((match) => match[1]!));
  const navLightKeys = navKeys(navLight);
  const navDarkKeys = navKeys(navDark);
  addMissing(
    navLightKeys,
    navDarkKeys,
    (key) => `theme.ts: NAV_THEME.light.${key} has no dark counterpart`,
  );
  addMissing(
    navDarkKeys,
    navLightKeys,
    (key) => `theme.ts: NAV_THEME.dark.${key} has no light counterpart`,
  );
  if (navLightKeys.size === 0) errors.push("theme.ts: could not parse NAV_THEME");
}

if (errors.length > 0) {
  console.error("\n✖ Design tokens are out of sync:\n");
  for (const error of errors) console.error(`  · ${error}`);
  process.exit(1);
}

console.log(
  existsSync(MOBILE)
    ? "✓ web, mobile, and navigation token names are in sync"
    : "✓ web token names and @theme mappings are in sync (mobile disabled)",
);
