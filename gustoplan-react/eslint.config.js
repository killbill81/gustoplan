import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactRefresh from "eslint-plugin-react-refresh";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default tseslint.config(
  {
    ignores: ["dist", "node_modules"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...compat.extends("plugin:react/recommended", "plugin:react-hooks/recommended"),
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
    plugins: {
      "react-refresh": pluginReactRefresh,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  }
);