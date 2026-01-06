import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'tsconfig.app.json', 'tsconfig.node.json']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'no-console': 1,
      'no-lonely-if': 1,
      'no-trailing-spaces':1,
      'no-multi-spaces':1,
      'no-multiple-empty-lines':1,
      'space-before-blocks': ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
      'indent':['warn', 2],
      'semi': ['warn','never'],
      'quotes': ['warn','single'],
      'array-bracket-spacing': 1,
      'no-unexpected-multiline':'warn',
      'keyword-spacing': 1,
      'comma-dangle':1,
      'comma-spacing':1,
      'arrow-spacing':1
    }
  },
])
