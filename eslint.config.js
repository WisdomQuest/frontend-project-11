import globals from 'globals'
import path from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import pluginJs from '@eslint/js'
import importPlugin from 'eslint-plugin-import'

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: pluginJs.configs.recommended,
})

export default [
  {
    ignores: ["eslint.config.js"],
  },
  {
    languageOptions: {
      globals: {
        // Combine all required global variables here
        ...globals.node,
        ...globals.jest,
        ...globals.browser, // Replaces `env: { browser: true }`
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: { import: importPlugin },
    rules: {
      ...importPlugin.configs.recommended.rules,
    },
    // REMOVED the invalid 'env' section
  },
  ...compat.extends('airbnb-base'),
  {
    rules: {
      'semi': ['error', 'never'],
      'brace-style': ['error', 'stroustrup'],
      'arrow-parens': ['off'],
      'no-param-reassign': ['off'],
      'no-underscore-dangle': [
        'error',
        {
          allow: ['__filename', '__dirname'],
        },
      ],
      'import/extensions': [
        'error',
        {
          js: 'always',
        },
      ],
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'no-console': 'off',
      'import/no-extraneous-dependencies': 'off',
    },
  },
]
