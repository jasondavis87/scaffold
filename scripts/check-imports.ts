#!/usr/bin/env bun

/**
 * Checks for banned direct imports from 'react-native' in the mobile app.
 * Components should import from '@/lib/react-native' or '@/components/ui/*' instead.
 *
 * Exceptions: files in src/components/ui/ and src/lib/react-native.tsx
 */

import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";

const MOBILE_SRC = join(import.meta.dir, "..", "apps", "mobile", "src");

const BANNED_IMPORTS = [
  "Text",
  "View",
  "ScrollView",
  "Pressable",
  "TouchableOpacity",
  "TextInput",
  "FlatList",
  "SectionList",
  "Image",
];

const EXEMPT_PATTERNS = [
  /components\/ui\//,
  /lib\/react-native\.tsx$/,
];

const IMPORT_REGEX = new RegExp(
  `import\\s+\\{[^}]*(${BANNED_IMPORTS.join("|")})[^}]*\\}\\s+from\\s+['"]react-native['"]`,
  "g",
);

interface Violation {
  file: string;
  line: number;
  content: string;
  imports: string[];
}

async function getFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".expo") continue;
        files.push(...(await getFiles(fullPath)));
      } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
  } catch {
    // Directory doesn't exist
  }
  return files;
}

function isExempt(filePath: string): boolean {
  const rel = relative(MOBILE_SRC, filePath);
  return EXEMPT_PATTERNS.some((pattern) => pattern.test(rel));
}

async function checkFile(filePath: string): Promise<Violation[]> {
  const violations: Violation[] = [];
  const content = await Bun.file(filePath).text();
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const matches = line.matchAll(IMPORT_REGEX);
    for (const match of matches) {
      const importedNames = BANNED_IMPORTS.filter((name) => match[0].includes(name));
      if (importedNames.length > 0) {
        violations.push({
          file: relative(process.cwd(), filePath),
          line: i + 1,
          content: line.trim(),
          imports: importedNames,
        });
      }
    }
  }

  return violations;
}

async function main() {
  const files = await getFiles(MOBILE_SRC);
  const violations: Violation[] = [];

  for (const file of files) {
    if (isExempt(file)) continue;
    violations.push(...(await checkFile(file)));
  }

  if (violations.length === 0) {
    console.log("✅ No banned react-native imports found.");
    process.exit(0);
  }

  console.error("❌ Found banned react-native imports:\n");

  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}`);
    console.error(`    ${v.content}`);
    console.error(`    Banned: ${v.imports.join(", ")}`);
    console.error(`    → Import from '@/lib/react-native' or '@/components/ui/*' instead.\n`);
  }

  console.error(`\nFound ${violations.length} violation(s).`);
  process.exit(1);
}

main();
