// eslint.config.mjs
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import globals from "globals";

export default [
  {
    ignores: [".next/", "dist/", "node_modules/", "coverage/", "build/"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
      parser: tsparser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
      },
    },
    plugins: { "@typescript-eslint": tseslint },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "none",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "no-undef": "off",
    },
  },
];
