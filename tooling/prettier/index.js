/** @type {import("prettier").Config} */
const config = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  tabWidth: 2,
  printWidth: 100,
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [
    "^react(-native)?$",
    "^react-dom(/.*)?$",
    "^expo(-.*)?(/.*)?$",
    "^next(/.*)?$",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@packages/(.*)$",
    "",
    "^@/(.*)$",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  tailwindFunctions: ["cn", "cva"],
};

export default config;
