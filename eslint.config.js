// eslint.config.js

// @ts-check
import js from "@eslint/js";
import react from "@eslint-react/eslint-plugin";
import * as tsParser from "@typescript-eslint/parser";

export default [
  //js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    ...react.configs.recommended,
    languageOptions: {
      parser: tsParser,
    },
  },
];
