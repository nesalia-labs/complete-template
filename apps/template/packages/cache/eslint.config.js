/**
 * ESLint 9 flat config for `@deessejs/cache`.
 *
 * Baseline tseslint recommended + type-aware linting. No project-
 * specific rules yet — this package is small enough that the type
 * system + tests are the primary safety net.
 */
import tseslint from 'typescript-eslint'

export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    ignores: ['dist/**', '.turbo/**', 'node_modules/**', 'eslint.config.js'],
  },
  // Pin the tsconfig root so type-aware linting doesn't try to pick
  // between multiple tsconfig.json files in sibling packages
  // (we hit this when running ESLint at the workspace root).
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
)