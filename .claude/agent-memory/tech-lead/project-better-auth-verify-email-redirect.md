---
name: project-better-auth-verify-email-redirect
description: Better Auth's /api/auth/verify-email responds with 302 to callbackURL on success — but if signUp.email is called without callbackURL, Better Auth defaults to "/" (root), not the app's intended landing. Always pass callbackURL explicitly.
metadata:
  type: project
---

Better Auth's email verification flow has a subtle gotcha around `callbackURL` defaults.

## The behavior

`POST /api/auth/sign-up/email` with `requireEmailVerification: true` triggers the `sendVerificationEmail` hook, which embeds a verification URL like:

```
/api/auth/verify-email?token=<jwt>&callbackURL=<encoded>
```

The user clicks the link. The browser GETs the URL. Better Auth verifies the token, sets a session cookie, and responds with **302** to the `callbackURL` value. The browser follows the redirect transparently — the user never sees the verify-email endpoint.

## The gotcha

If `authClient.signUp.email({ ... })` is called **without a `callbackURL`** param, Better Auth defaults `callbackURL` to **`/`** (just the home page). The verification works, but the user lands on the marketing landing page — not on the app surface they signed up for. From there they have to navigate manually to /login, with no "Email verified" feedback.

This is what bit us on 2026-06-23. The user reported "rien ne se passe" because the verification was succeeding, the session cookie was set, but they were being silently dropped on the marketing page with no signal that anything had changed.

## Curl test (sanity check)

```bash
# Both invalid and valid tokens return 302 to callbackURL
curl -i "http://localhost:3000/api/auth/verify-email?token=fake&callbackURL=/login?verified=1"
# → 302 location: /login?verified=1&error=INVALID_TOKEN

curl -i "http://localhost:3000/api/auth/verify-email?token=<valid>&callbackURL=/login?verified=1"
# → 302 location: /login?verified=1  (and a Set-Cookie for the session)
```

The 302 is the canonical behavior — confirmed on Better Auth 1.6.19 against the project's setup.

## Why the user saw `{ "status": true, "user": null }` JSON

The user copy-pasted the URL into a tool that doesn't follow 302 redirects (curl, Postman, HTTPie, an HTTP client extension). The body of the 302 response is JSON (Better Auth always sets `content-type: application/json` on this endpoint) — and the body is shown because the tool didn't follow the Location header.

In a real browser, the 302 is followed transparently and the user never sees the JSON. If you want to test the verify-email flow end-to-end, **click the link from the email in a real browser** — don't paste it into curl.

## The fix

Always pass `callbackURL` explicitly when calling Better Auth's email-related client methods:

```ts
// Signup form
await signUp.email({
  name, email, password,
  callbackURL: "/login?verified=1",
})

// Resend button on /verify-email
await sendVerificationEmail({
  email,
  callbackURL: "/login?verified=1",
})
```

## How to apply

- For any future sign-up flow, set `callbackURL: "/login?verified=1"` (or the app's chosen post-verification route).
- For any future password-reset flow, set `redirectTo: "/reset-password"` (this is the path appended with `?token=...`).
- For the reset-password page's form submission, `authClient.resetPassword` doesn't need a callbackURL — it just consumes the token and the user is already on the reset page.
- The "JSON page" pattern is normal — only appears when the URL is opened in a non-browser tool. Don't mistake it for a bug.

Same trap likely exists for `requestPasswordReset` (no `redirectTo` → default). Memo for M1: check the email log carefully when debugging auth flows.
