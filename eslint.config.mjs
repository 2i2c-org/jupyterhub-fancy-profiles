import react from "eslint-plugin-react";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    files: ["**/src/**/*.js", "**/src/**/*.jsx"],
  },
  {
    ignores: [
      "jupyterhub_fancy_profiles/static/*.js",
      "**/webpack.config.js",
      "**/babel.config.js",
    ],
  },
  ...compat.extends("eslint:recommended", "plugin:react/recommended"),
  {
    plugins: {
      react,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      ecmaVersion: "latest",
      sourceType: "module",
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      // Temporarily turn off prop-types
      "react/prop-types": "off",

      "no-unused-vars": [
        "error",
        {
          args: "after-used",
        },
      ],
    },
  },
];
