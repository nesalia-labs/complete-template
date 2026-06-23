---
name: project-apps-lite-workspace-setup
description: apps/lite is a nested pnpm workspace (mirroring apps/template), v0.0.1 = Next.js scaffold only. Re-scoped from the original "post-v1 OSS lead magnet" definition in lead-magnets.md to a pragmatic demo-first instance.
metadata:
  type: project
---

`apps/lite/` is a **nested pnpm workspace**, structured identically to `apps/template/`:

```
apps/lite/
├── apps/web/                  Next.js 16.2.9 scaffold (v0.0.1)
├── packages/                  empty for v0.0.1 — future home of auth/api/database/etc. for this instance
├── package.json               { "name": "deessejs-lite-root", "type": "module", packageManager pnpm@9.15.0 }
├── pnpm-workspace.yaml        globs: apps/web, packages/*
└── tsconfig.base.json         base TS config (target ES2022, module ESNext, strict)
```

It is **NOT** in the root `pnpm-workspace.yaml` — root only lists `apps/web`, `apps/cloud`, `packages/*`. Per ADR-0012 each app is its own instance.

**Why:** The literal "lite = OSS subset" definition in [[reference-deessejs-product-overview]] / [[project-deessejs-overview]] requires billing + mail packages that don't exist yet (M3 of build-roadmap). User wanted "something to show ASAP" so we re-scoped lite to a demoable vertical slice built incrementally. v0.0.1 ships just the Next.js scaffold; v0.0.2 wires auth; v0.0.3 adds orgs/RBAC; v0.0.4 = Projects CRUD + landing page = first demoable build.

**How to apply:**
- Future `apps/lite/packages/*` work mirrors `apps/template/packages/*` but starts from zero (don't import across instances per ADR-0012).
- Pragmatic exception (v0.0.2 → v0.0.4) will import from `apps/template/packages/*` for speed; document as ADR-0013 "Demo-phase cross-instance imports."
- Once `scripts/extract-instance/` ships, lite gets proper self-contained packages.
- To work in this workspace: `cd apps/lite && pnpm install` (separate lockfile from root).