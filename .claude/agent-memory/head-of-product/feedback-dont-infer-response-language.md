---
name: feedback-dont-infer-response-language
description: Don't infer the user's preferred response language from the language they write in
metadata:
  type: feedback
---

Don't assume the user wants replies in the language they happen to write in. The user may write in French but still want English replies (or vice versa).

- **Why:** I assumed "user writes in French → reply in French" and was corrected. Language of input ≠ language of preference.
- **How to apply:** Default to English unless the user explicitly says otherwise. If a user message is in another language, it's fine to ask once, or just default to English — never silently mirror without checking.
- Related: [[user-language]]
