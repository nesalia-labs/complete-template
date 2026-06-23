---
name: project-deessejs-cloud-feasibility-outdated-assumption
description: 2026-06-16 DeesseJS Cloud feasibility doc has a known-stale 300s Vercel Function ceiling claim; superseded by 2026-06-15 changelog
metadata:
  type: project
---

# Feasibility doc has outdated 300s Vercel Function claim

**Affected file:** `documents/internal/product/deessejs-cloud-feasibility-2026-06.md`

**Issue:** The feasibility doc, dated 2026-06-16 (one day AFTER the Vercel 30-min changelog of 2026-06-15), states the Vercel Function ceiling is **300 seconds**. The actual value was 800s (long-standing) and went to 1800s on 2026-06-15. The research workflow that produced the feasibility missed the changelog.

**Cascading impact on the doc:**
- **Risk #5** ("Vercel Function 300s duration ceiling blocks long agent loops") is **obsolete**
- The justification for **Trigger.dev** as a queue primitive partly collapses
- The 4.x job architecture (4.9 wiring) needs re-design
- The AI-heavy tenant cost model (Risk #2, 54% margin) needs re-modeling under Fluid Compute active-CPU billing
- The Edge runtime gap is unaddressed (control plane on Edge is unaffected by the changelog)

**Why:** The prior research workflow ran on 2026-06-16 but didn't validate the foundational Vercel Function duration assumption against the live changelog. The user caught this on 2026-06-18 before launching a new tech-stack workflow.

**How to apply:**
- Do NOT cite Risk #5 or the 300s ceiling as a constraint for Cloud work
- Treat the 2026-06-16 feasibility as a **business case** (still valid) but not as a **tech spec** (superseded)
- The replacement tech-stack report will live at `documents/internal/product/cloud/tech-2026-06.md` — see [[project-deessejs-cloud-tech-2026-06]] when complete
- For all future Cloud architecture work, anchor on [[reference-vercel-30min-changelog]] as the baseline
