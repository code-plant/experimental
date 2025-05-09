// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.cjs", "*.mjs"],
        },
      },
    },
  },
  {
    ignores: [
      "**/.yarn/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/*.js",
      "**/*.d.ts",
      "**/*.cjs",
      "**/*.mjs",
    ],
  },
);
