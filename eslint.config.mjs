// Flat ESLint config without FlatCompat to avoid circular structure issues
// Uses official flat configs from @eslint/js, typescript-eslint, and react
import js from "@eslint/js"
import * as tseslint from "typescript-eslint"
import react from "eslint-plugin-react"
import globals from "globals"

export default [
  // Ignore build artifacts and dependencies
  {
    ignores: [
      "**/.next/**",
      "**/node_modules/**",
      "**/out/**",
      "**/build/**",
      "**/coverage/**",
      "**/.turbo/**",
      "**/tests/**",
      "vitest.config.ts",
      "vitest.setup.ts",
      "**/*.stories.tsx",
    ],
  },
  // Base JS recommended rules
  js.configs.recommended,
  // Our project rules
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      react,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...react.configs.recommended.rules,
      // Rely on TypeScript's rule and avoid duplicate reporting
      "no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "react/no-unescaped-entities": "off",
      // React 17+ automatic JSX runtime doesn't require React in scope
      "react/react-in-jsx-scope": "off",
      // TypeScript handles undefined vars; base rule misfires on types
      "no-undef": "off",
      "prefer-const": "warn",
      // Ban direct localStorage usage (must use storage abstraction)
      "no-restricted-globals": [
        "error",
        {
          name: "localStorage",
          message:
            "Direct localStorage usage is not allowed. Use the storage abstraction from @/lib/storage instead (storage.get/set, useStorage, useCRUD).",
        },
      ],
    },
  },
  // Exception: storage adapter implementation needs direct localStorage access
  {
    files: ["lib/storage/storage-adapter.ts"],
    rules: {
      "no-restricted-globals": "off",
    },
  },
]
