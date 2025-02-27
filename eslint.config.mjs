import react from "eslint-plugin-react";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    files: ["**/src/**/*.{ts,tsx,js,jsx}"],
  },
  {
    ignores: [
      "jupyterhub_fancy_profiles/static/*.js",
      "**/webpack.config.js",
      "**/babel.config.js",
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    plugins: {
      react: react,
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
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
      indent: ["error", 2, { SwitchCase: 1 }],
      quotes: ["error", "double"],
      "jsx-quotes": ["error", "prefer-double"],
      semi: [2, "always"],
      "eol-last": ["error", "always"],
      "no-console": 1,
      "no-extra-semi": 2,
      "semi-spacing": [2, { before: false, after: true }],
      "no-dupe-else-if": 0,
      "no-setter-return": 0,
      "prefer-promise-reject-errors": 0,
      "react/button-has-type": 2,
      "react/default-props-match-prop-types": 2,
      "react/jsx-closing-bracket-location": 2,
      "react/jsx-closing-tag-location": 2,
      "react/jsx-curly-spacing": 2,
      "react/jsx-curly-newline": 2,
      "react/jsx-equals-spacing": 2,
      "react/jsx-max-props-per-line": [2, { maximum: 1, when: "multiline" }],
      "react/jsx-first-prop-new-line": 2,
      "react/jsx-curly-brace-presence": [
        2,
        { props: "never", children: "never" },
      ],
      "react/jsx-pascal-case": 2,
      "react/jsx-props-no-multi-spaces": 2,
      "react/jsx-tag-spacing": [2, { beforeClosing: "never" }],
      "react/jsx-wrap-multilines": 2,
      "react/no-array-index-key": 2,
      "react/no-typos": 2,
      "react/no-unsafe": 2,
      "react/no-unused-prop-types": 2,
      "react/no-unused-state": 2,
      "react/self-closing-comp": 2,
      "react/sort-comp": 2,
      "react/style-prop-object": 2,
      "react/void-dom-elements-no-children": 2,
    },
  },
);
