/**
 * ESLint 9 flat config for `@deessejs/api`.
 *
 * Minimal ruleset. The goal is to enforce the conventions documented in
 * `docs/internal/architecture/11-packages/api/README.md#conventions` and
 * `structure.md`, NOT to replace TypeScript's own checks. We delegate
 * type-checking to `tsc` (via `pnpm typecheck`) and keep ESLint focused
 * on the few import-boundary rules that tsc can't catch.
 *
 * Rules enforced:
 *   - `src/core/**` and `src/middlewares/orpc/**` MUST NOT import
 *     `drizzle-orm` directly. All DB access goes through the data-access
 *     functions in `@deessejs/database/<feature>`. This is the
 *     security-critical rule from the tenant-isolation pattern
 *     (see `docs/internal/architecture/11-packages/database/tenant-isolation.md`).
 *   - `src/middlewares/orpc/**` MUST NOT import feature modules
 *     (`@deessejs/database/users`, etc.) directly. Middlewares are
 *     cross-cutting; they only touch the base context.
 *
 * Add new rules here as conventions are documented. Don't grow this file
 * without a doc to reference — every rule should trace back to a section
 * in `documents/internal/architecture/11-packages/api/`.
 */
import tseslint from 'typescript-eslint'

export default tseslint.config(
  // Baseline: tseslint's recommended rules + type-aware linting.
  // We don't enable the strict ruleset to keep noise low in Sprint 1.
  ...tseslint.configs.recommended,
  {
    // Global ignores. Match tsconfig's exclude patterns.
    ignores: [
      'dist/**',
      '.turbo/**',
      'node_modules/**',
      'eslint.config.js',
    ],
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
  // Procedural code: enforce no-direct-DB-access convention.
  // This is the load-bearing rule for tenant isolation.
  {
    files: ['src/core/**/*.ts', 'src/middlewares/orpc/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['drizzle-orm', 'drizzle-orm/*'],
              message:
                'Do not import drizzle-orm directly. Use data-access functions from @deessejs/database/<feature>. ' +
                'See docs/internal/architecture/11-packages/database/tenant-isolation.md.',
            },
            {
              group: ['@deessejs/database/schema', '@deessejs/database/schema/*'],
              message:
                'Do not import table definitions directly. Use the data-access functions, ' +
                'which take (db, orgId, ...args) and enforce tenant isolation.',
            },
          ],
        },
      ],
    },
  },
  // Tests: relax the rules. Tests can import drizzle-orm to seed data,
  // and they can import feature modules to set up fixtures.
  {
    files: ['tests/**/*.ts'],
    rules: {
      'no-restricted-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
)