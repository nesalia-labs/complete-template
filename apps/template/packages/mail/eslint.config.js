// ESLint flat config for @deessejs/mail
// Enforces the package boundary: only `provider/resend.ts` may import from `resend`.

import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', '.react-email/**', 'node_modules/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['resend', 'resend/*'],
              message:
                'Import Resend via @deessejs/mail only. Use the Mailer interface.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/provider/resend.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
);