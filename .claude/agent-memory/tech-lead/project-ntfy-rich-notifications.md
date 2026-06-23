---
name: project-ntfy-rich-notifications
description: ntfy.sh capabilities verified 2026-06-22 — full header/action/template reference for agent→Android push notifications
metadata:
  type: project
---

User confirmed preference (2026-06-22): only **native Android notifications**, no Telegram/Discord. ntfy.sh is the chosen service. Test topic used: `deessejs_main`.

**Why:** Lightweight agent→mobile ping pipeline. Claude Code (or any agent) publishes via curl/CLI; user receives a native Android notification on his phone, with action buttons when needed. Free, no account required, open source.

**How to apply:** When the user wants an agent to ping his phone, an alert pipeline, a webhook→mobile bridge, or "tell me when X is done from anywhere", default to ntfy. Don't suggest Telegram/Discord/Slack (explicitly rejected). Pushover/Pushbullet are second-tier options if ntfy doesn't fit.

## ntfy verified capabilities (2026-06-22, from official `docs/publish.md`)

**17 headers** (each has aliases — see source): `X-Message`, `X-Title`, `X-Priority` (1-5), `X-Tags` (emoji shortcodes), `X-Click`, `X-Icon` (PNG/JPEG), `X-Markdown`, `X-Actions`, `X-Attach`, `X-Filename`, `X-Delay`/`X-At`/`X-In` (10s–3 days), `X-Sequence-ID`, `X-Email`, `X-Call` (Pro), `X-Cache`, `X-Firebase`, `X-UnifiedPush`, `X-Template`.

**4 action types** (max 3 per notif):
- `view` — open URL (any scheme: http/mailto/geo/ntfy:// + app deep links)
- `http` — send HTTP request on tap (default POST, custom headers/body, clear=true dismisses on success only)
- `broadcast` — Android intent (default `io.heckel.ntfy.USER_ACTION`, string extras) — Tasker/MacroDroid integration
- `copy` — clipboard (Android + Firefox, not desktop notif)

**Live progress pattern** (killer feature for agents): `X-Sequence-ID` + same ID on subsequent posts = updates the existing notification in place. `PUT /<topic>/<id>/clear` dismisses, `DELETE /<topic>/<id>` removes.

**Templating** (game-changer for webhooks): `?template=github|grafana|alertmanager` parses JSON webhooks into readable notifs. Custom YAML templates in `/etc/ntfy/templates/`. Inline Go templates via `?template=yes`.

**Multi-modal delivery**: same notif can be pushed to Android + email forward + phone call (TTS, Pro only) via `X-Email` + `X-Call` headers.

**Android specifics**: per-priority notification channels (configurable sound/vibration independently), F-Droid build = no Firebase, instant delivery via foreground service, UnifiedPush distributor, intent reception via `io.heckel.ntfy.MESSAGE_RECEIVED`, ntfy:// deep links, 30+ languages including French.

**Free tier limits (ntfy.sh)**: 250 msg/day, 5 emails/day, 2 MB attachments, 20 MB/day total per visitor, 4096 bytes max message body, 30 subscriber connections, 15k topics.

## Three power patterns for Claude Code agents

1. **Live progress** — same sequence_id across multiple posts, Android shows ONE notif that updates in place
2. **Interactive agent** — `http` action button taps back to the agent's HTTP server (e.g. `http://agent:8080/approve/X`) for human-in-the-loop decisions
3. **Multi-channel cascade** — agent pings ntfy, ntfy fans out to Android + email + phone call

## Sending pattern (curl baseline)

```bash
curl -fsS -m 10 \
  -H "Content-Type: text/plain; charset=utf-8" \
  -H "Title: <title>" \
  -H "Priority: <1-5>" \
  -H "Tags: <emoji-shortcodes>" \
  -H "Icon: <https-url-png>" \
  -H "Click: <url>" \
  -H "Actions: <action1>, <label1>, <url>, clear=true; <action2>, <label2>, <url>, clear=true" \
  -H "X-Sequence-ID: <stable-id>" \
  --data-binary $'<markdown or plain body>' \
  https://ntfy.sh/<topic>
```

**Caveat seen in testing**: missing `Content-Type: text/plain; charset=utf-8` on multi-line bodies with non-ASCII causes ntfy to treat the body as a file attachment instead of message text. Always set the content-type explicitly.

## ⚠️ Markdown rendering limitation on Android (confirmed 2026-06-22)

Despite the docs saying "Markdown supported on Android", the `X-Markdown: yes` / `Content-Type: text/markdown` flag is **only rendered in the web app and in the ntfy app's internal topic view** — **NOT in the Android system notification shade**. The native system notif shows the raw Markdown source (literal `**bold**`, `# heading`, etc.).

This is an Android `Notification.Builder` limitation, not an ntfy bug. Server correctly stores `content_type: text/markdown`, but Android's notification framework can't render custom Markdown inline.

**Workaround for agent use case**: keep Android notifications short (title + 2-3 lines) and push details to action buttons (e.g. `view, Open logs, <url>`). Rely on tags/emojis for visual structure in the notif. Save real Markdown for when the user taps `view` and opens the web app or ntfy app.
