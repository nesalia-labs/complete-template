---
name: feedback-never-run-dev-server
description: Never launch dev servers or background processes — always note issues without running
metadata:
  type: feedback
---

# Never run dev servers

Never run `next dev`, `pnpm dev`, `npm run dev`, or any background server process.

**Why:** The user wants to review changes and test themselves. Launching servers wastes time and creates zombie processes.

**How to apply:** If there's a module resolution error, investigate and fix the configuration. Do not start servers to test.
