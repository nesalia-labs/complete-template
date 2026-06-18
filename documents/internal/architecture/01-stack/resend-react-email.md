# Resend + React Email

## Decision

**Resend** as the email transport. **React Email** for component-composed email templates.

- **Decision date:** 2026-06-17
- **Decision owner:** tech lead
- **Status:** Locked

## Scope

Resend handles every transactional and marketing email:

- **Auth templates** (verify, reset, magic link, invite) — via Better Auth defaults + buyer overrides.
- **Billing templates** (receipt, dunning, trial ending) — Stripe webhook → React Email → Resend.
- **Transactional templates** (notification digests, password change confirmations).
- **Marketing templates** (announcements, newsletters) — buyer uses their own list management.

## What we use

### Resend

- **HTTP API.** Simple POST to send a message.
- **Webhooks** for bounce / complaint / open / click tracking.
- **Per-domain DKIM/SPF/DMARC** — the buyer verifies their sending domain.
- **Sandbox mode** in dev — captures emails without sending, with screenshot capability for testing.

### React Email

- **Component-composed templates.** Emails are React components, versioned in code.
- **Type-safe props.** Each template has a typed props interface.
- **Tailwind-compatible.** Styling via Tailwind classes (or inline styles for max compat).
- **Preview server** in dev (`email dev`) — opens a browser to see rendered emails.

## Why Resend + React Email (not SendGrid + Handlebars, not Postmark + MJML, not AWS SES + raw HTML)

| Alternative | Why not |
|---|---|
| **SendGrid** | Older API. Templates are stored in their dashboard, not in our code. |
| **Postmark + MJML** | MJML is good but different mental model from our React stack. |
| **AWS SES** | Lower-level. We'd build the templates and the send flow ourselves. |
| **Mailgun** | Similar to SendGrid. |
| **Loops** | Great product, but transactional-only niche. |
| **DIY with Nodemailer** | We'd rebuild Resend badly. |

Resend + React Email wins on:

- **Resend's API is the cleanest in the industry.** One POST, modern DX.
- **React Email templates** live in our repo, versioned with our code. The buyer can customize without leaving the codebase.
- **Type-safe props** match our TypeScript stack.
- **Sandbox mode** is great for dev and testing.

## Architecture

```
App → React Email template → Resend HTTP API → Recipient
   │                                              │
   │                                              ├── Delivered
   │                                              ├── Bounced (webhook)
   │                                              ├── Complained (webhook)
   │                                              └── Opened / Clicked (webhook)
   │
   └── Email events stored in our DB
```

All email sending goes through `apps/template/packages/email/` — a single module.

## Example template

```tsx
// apps/template/packages/email/templates/welcome.tsx
import { Body, Button, Container, Head, Html, Preview, Text } from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
  loginUrl: string;
}

export function WelcomeEmail({ name, loginUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to DeesseJS</Preview>
      <Body style={{ fontFamily: 'sans-serif' }}>
        <Container>
          <Text>Hi {name},</Text>
          <Text>Welcome aboard. Click below to log in.</Text>
          <Button href={loginUrl}>Log in</Button>
        </Container>
      </Body>
    </Html>
  );
}
```

```ts
// apps/template/packages/email/send.ts
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { WelcomeEmail } from './templates/welcome';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to: string, props: { name: string }) {
  const html = render(<WelcomeEmail {...props} loginUrl="https://..." />);
  await resend.emails.send({
    from: 'welcome@yourdomain.com',
    to,
    subject: 'Welcome',
    html,
  });
}
```

## Webhooks

Resend webhooks flow into our app at `/api/resend/webhook`:

- **Bounced / complained** — recipient suppressed, future sends skip them.
- **Opened / clicked** — optional analytics, stored if the buyer enables.

## Constraints

- **All email goes through `packages/email/`.** No direct Resend calls from feature modules.
- **Templates are React components** in `packages/email/templates/`. No HTML strings inlined.
- **Bounced addresses are suppressed** automatically (per feature 5.7).
- **Per-category unsubscribe** (per feature 5.9, 5.10) — not just global.

## What the buyer can replace

The buyer can swap Resend for any other provider (SendGrid, Postmark, AWS SES, self-hosted) by:

1. Replacing `apps/template/packages/email/send.ts` with their own implementation.
2. Templates stay (React Email is provider-agnostic).
3. The rest of the app continues to work.

## Cross-references

- [`../10-decisions/`](../10-decisions/) — ADR for email (when written).
- [`../../product/features/05-mail.md`](../../product/features/05-mail.md) — the mail feature inventory.
- [`./stripe.md`](./stripe.md) — billing webhooks trigger billing emails.
- [`./better-auth.md`](./better-auth.md) — auth templates via Better Auth defaults.
