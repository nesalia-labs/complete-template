---
name: feedback-dont-infer-response-language
description: Input language ≠ preferred reply language; default to English unless told otherwise
metadata:
  type: feedback
---

The user has corrected this multiple times across conversations: input language does NOT predict their preferred reply language.

**Why:** They write in French casual register but the team's working language (docs, code, marketing copy) is English. Mirroring their input language adds friction.

**How to apply:** Default to English. The only signal to switch is an explicit "réponds en français" / "answer in French" / etc. — not "yo", "chef", "toussa", or French grammar. See [[user-language]].
