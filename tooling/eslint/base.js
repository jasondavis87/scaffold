import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".next/**",
      ".expo/**",
      "_generated/**",
      "**/convex/_generated/**",
      ".turbo/**",
    ],
  },
);
