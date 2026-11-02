import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  { ignores: ['.next/**', 'node_modules/**'] },
  eslint.configs.recommended,
  prettier,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        window: 'readonly',
        document: 'readonly',
        fetch: 'readonly',
        process: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        URL: 'readonly',
        Blob: 'readonly',
      },
    },
    rules: { 'no-console': ['warn', { allow: ['warn', 'error'] }], 'no-unused-vars': 'off' },
  },
];
