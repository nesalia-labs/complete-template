---
name: project-console-mailer-html-entity-gotcha
description: ConsoleMailer.extractLinks regex-extracts URLs from rendered HTML, but React Email escapes & to &amp; in href attributes — without HTML-decoding, the extracted URL has &amp; and breaks query string parsing when pasted in a browser URL bar
metadata:
  type: project
---

## The bug

When `ConsoleMailer` (in `packages/mail/src/provider/console.ts`) renders a React Email component to HTML and extracts URLs with a regex, the URLs carry the HTML-escaped form of `&` — i.e. `&amp;`. The renderer escapes `&` to keep the HTML valid, and regex-extracting the raw HTML string preserves the escape.

When the user copy-pastes the URL from the dev console into a browser URL bar:
- The browser sends the URL as-is (no HTML-decoding)
- The server's query string parser sees `?token=X&amp;callbackURL=Y`
- Splits on `&`: `token=X` and `amp;callbackURL=Y`
- The `callbackURL` param is not recognized
- Better Auth falls back to the default `callbackURL="/"` → 302 to home → silent drop

## The fix

Added `decodeHtmlEntities()` in `extractLinks()`, called before returning:

```ts
function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}
```

Five entities — covers everything that can show up in a `href` value.

## Why this is dev-only

In production (ResendMailer), the user receives the email and clicks the link in their email client. The client parses the HTML, decodes `&amp;` back to `&`, and the resulting `href` is correct. The bug is purely in the dev console log path.

## The fuller picture

This was the second of TWO bugs in the verification flow that I hit on 2026-06-23:

1. **`signUp.email()` without `callbackURL`** — Better Auth defaults to `/` (silent drop on marketing). Fixed by passing `callbackURL: "/login?verified=1"`. (See `project-better-auth-verify-email-redirect.md`.)

2. **`ConsoleMailer.extractLinks()`** returning `&amp;` instead of `&` — the dev console shows a URL that, when pasted in a browser, has a broken query string. Fixed by HTML-decoding.

Together, they created a confusing chain: signup worked, the verification email was sent, the user copy-pasted the URL from the console, the browser navigated, Better Auth processed the token, but redirected to `/` (the home) instead of `/login?verified=1`. The user saw "rien ne se passe" because the marketing page is the default state.

If the user had clicked the link directly inside the email client (production path), bug 2 wouldn't apply. If `signUp.email` had passed `callbackURL`, bug 1 wouldn't apply. We hit both because we were in dev with copy-paste from the console.

## How to apply

- Never trust a regex-extracted URL from rendered HTML — always HTML-decode.
- When the user reports "rien ne se passe" with auth flows, check both: the URL they pasted (is `&amp;` or `&`?) and the `callbackURL` passed in the original API call.
- For any new console-style dev inspector that surfaces HTML-rendered URLs, HTML-decode at extraction time.
