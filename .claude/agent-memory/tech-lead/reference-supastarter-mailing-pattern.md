---
name: supastarter-mailing-pattern
description: supastarter's packages/mail + apps/mail-preview structure — the closest reference architecture to DeesseJS for Resend + React Email
metadata:
  type: reference
---

supastarter (supastarter.dev) is the closest reference architecture to DeesseJS for the mail layer — same stack (Next.js + Hono + oRPC + Better Auth + Resend + i18n + pnpm monorepo). Verified 2026-06-22 via fresh fetch.

**Why this is a good reference:**
- Same Better Auth integration → same `send*` hooks to wire.
- Same monorepo layout (apps/* + packages/*).
- Same multi-tenant RBAC + organization context.
- Same i18n scope via `next-intl`.

**supastarter's packages/mail layout:**
```
packages/mail/
├── config.ts                  ← const config = { from: "example@example.com" }
├── provider/
│   ├── index.ts               ← export * from './resend' (switchable)
│   ├── resend.ts              ← Resend client wrapper
│   ├── postmark.ts            ← alternative
│   ├── plunk.ts               ← alternative
│   ├── nodemailer.ts          ← alternative
│   └── console.ts             ← dev fallback (← important pattern)
├── emails/
│   └── index.ts               ← mailTemplates = { magicLink: MagicLink, ... }
├── templates/
│   ├── MagicLink.tsx          ← per-template file, default export
│   ├── VerifyEmail.tsx
│   └── ...
├── components/
│   ├── Wrapper.tsx            ← shared <Html><Head><Tailwind config={brand}><Logo/></Container></Tailwind></Html>
│   └── PrimaryButton.tsx
├── types.ts                   ← BaseMailProps = { locale, translations }
└── tests/                     ← (not described in docs)
```

**Pattern takeaways for DeesseJS:**

1. **`provider/` folder with switch**: `provider/index.ts` exports one of the provider modules. `MAIL_PROVIDER` env or hardcoded. Lets you swap Resend → Postmark → Console without touching templates. The **`console.ts` provider** is critical — it lets dev/test run without a Resend key. Adapt this exactly in `packages/mail/src/provider/`.

2. **`config.ts` for `from` address only**: the `from` is in the repo (cleartext), the API key is in env. Don't conflate them.

3. **Templates registered in `emails/index.ts`**: single map of all mail templates. Gives type-safety on `sendMail({ template: 'magicLink', context: {...} })`.

4. **Per-template `.tsx` file in `templates/`**: each template is one file with default export. Use the file system as the registry source of truth. Adapt for DeesseJS as `packages/mail/src/templates/*.tsx`.

5. **Shared `<Wrapper>` component**: every template wraps its content in `<Wrapper>{children}</Wrapper>`. The Wrapper owns `<Html><Head><Tailwind config={brand}><Section><Container>{Logo}{children}</Container></Section></Tailwind></Html>`. Single edit site for brand. Pull the Logo from `@deessejs/ui` (when that package exists — currently empty, use a placeholder SVG).

6. **`<PrimaryButton>` reusable component**: shared CTA button. Styling consistent across all templates.

7. **`BaseMailProps = { locale, translations }`**: every template gets `locale` + pre-loaded translations. Translation loading happens before `sendMail` is called (probably in the auth callback or in a helper that resolves locale from `user.preferredLocale`). Uses `use-intl/core` `createTranslator` inside the template.

8. **Template example (MagicLink):**
```tsx
import { Link, Text } from "react-email"
import { createTranslator } from "use-intl/core"
import type { BaseMailProps } from "../types"
import PrimaryButton from "./components/PrimaryButton"
import Wrapper from "./components/Wrapper"

export function MagicLink({ url, name, otp, locale, translations }) {
  const t = createTranslator({ locale, messages: translations, namespace: "mail" })
  return (
    <Wrapper>
      <Text>{t("magicLink.body", { name })}</Text>
      <Text>
        {t("common.otp")}
        <br />
        <strong className="text-2xl font-bold">{otp}</strong>
      </Text>
      <Text>{t("common.useLink")}</Text>
      <PrimaryButton href={url}>{t("magicLink.login")} →</PrimaryButton>
      <Text className="text-muted-foreground text-sm">
        {t("common.openLinkInBrowser")}
        <Link href={url}>{url}</Link>
      </Text>
    </Wrapper>
  )
}
export default MagicLink
```

9. **`apps/mail-preview` is a Next.js app on port 3005** that imports templates from `packages/mail` and renders them with sample props. Lets you preview all templates + switch locales + switch providers without sending real emails. **DeesseJS decision: NOT for M1** (see [[project-packages-mail-architecture]]).

10. **`sendMail` API**: simple `{ to, template, context }` shape. Context type comes from the registered template component.

**i18n:** supastarter splits translations into 4 scopes: `marketing`, `saas`, `mail`, `shared`. Mail translations live in `packages/i18n/translations/<locale>/mail.json`. Locales supported: en, de, es, fr.

**Why this matters for DeesseJS:** supastarter has already solved the exact pattern we need. Adopt the structure, skip `apps/mail-preview` for M1, defer i18n to M2 (after `packages/i18n` is implemented).

**Sources (2026-06-22 via fresh):**
- `supastarter.dev/docs/nextjs/mailing/overview`
- `supastarter.dev/docs/nextjs/mailing/resend`
- `supastarter.dev/docs/nextjs/codebase/structure`
- `supastarter.dev/docs/nextjs/internationalization`

**How to apply:**
- For `packages/mail` structure, follow the supastarter layout adapted for DeesseJS conventions — see [[project-packages-mail-architecture]] for the full proposal.
- The `provider/` switch is the key pattern — adopt it. The `console.ts` provider is non-negotiable for dev ergonomics.
- The `Wrapper` component is the key DRY pattern — adopt it (single edit site for brand).
- The mail templates registry (`emails/index.ts` in supastarter, `registry.ts` in our proposal) gives type-safe `sendMail` calls — adopt it.
- **Skip i18n for M1**: hardcode English. DeesseJS `packages/i18n` is empty. Revisit when i18n ships.
- **Skip `apps/mail-preview` for M1**: use `pnpm --filter @deessejs/mail dev` (`email dev -p 3005`) instead. Reconsider at M2.