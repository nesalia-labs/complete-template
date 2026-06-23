---
name: project-local-code-indexing-landscape
description: Local-first codebase indexer options for AI coding agents (Claude Code) — verified candidates as of 2026-06-22, with offline/no-external-model filter
metadata:
  type: project
---

User is evaluating local code indexers for an AI agent workflow (likely DeesseJS context) with a hard requirement: no external model, code stays on the machine. Verified via fresh CLI web research on 2026-06-22.

**Why:** Privacy-first posture for proprietary code; doesn't want to ship source to cloud indexing services. Wants to give Claude Code/Codex/OpenCode better aim without paying for cloud embeddings.

**How to apply:** When the user mentions code indexing, MCP servers, "better context for Claude Code", or repo navigation pain, default to recommending from this shortlist. Don't suggest zilliztech/claude-context (needs Zilliz Cloud) or Sourcegraph (enterprise-only now).

## Tier 1 — Recommend first

- **zzet/gortex** (Go, Apache-2.0, 670★): single signed binary, 257 langs via tree-sitter, 100+ MCP tools, **GloVe-50d baked (3.8 MB, no model download)**, default semantic is offline. SLSA 3 + Sigstore. Best for: turnkey solution, broad language coverage.
- **denfry/codebase-index** (Python, MIT-ish): Claude Code plugin via `/plugin marketplace`, FTS5 + Tree-sitter + graph, **fully offline by default** (embeddings are opt-in and gated). Best for: Claude Code-specific integration.

## Tier 2 — Verify before adopting

- **tazhate/claude-context-local** (Python, MIT): ONNX embeddings ~200 MB (no Ollama needed), ChromaDB embedded. 0★, very new.
- **getlien/lien** (AGPL-3.0): local embeddings + Qdrant for cross-repo. AGPL is restrictive — avoid for proprietary integration.
- **sourcebot** (TypeScript, 3510★): Sourcegraph-like, Docker Compose, code search fully local, Ask Sourcebot LLM is optional/configurable.

## Tier 3 — With caveats

- **isink17/codegraph** (Go, license unclear): needs Ollama, 0★.
- **masihmoloodian/sema** (Python, MIT, 15★): lexical/symbolic only, no semantic, marked experimental.

## Avoid

- zilliztech/claude-context — needs Milvus/Zilliz Cloud + external embedding provider, despite the "claude" branding.
- OpenGrok — JVM/Tomcat/8 GB heap, no MCP.
- Zoekt — search-only, no native MCP (community bridge only).
- Sourcegraph — enterprise-only, core repo private since 2024-08.

## Market consensus (2026)

Hybrid retrieval (BM25 + structural + graph) beat pure-embedding approaches. Sourcegraph/Cody themselves dropped pure embeddings for BM25F over code graph. Embeddings go stale after renames; disk is always current. See [[reference-vercel-30min-changelog]] for the general pattern of vendors revising their assumptions.

## Gortex deep-dive (2026-06-22)

When recommending gortex specifically, surface these nuances — they're not obvious from the README and matter for adoption:

- **Pre-1.0** (v0.47.0 as of 2026-06-16). Bus factor = 1 (Andrey Kumanyaev @zzet, 1691 contributions; avfirsov #2 with 31). Real production risk.
- **"256 langages" claim is misleading** — only ~30 have full bespoke tree-sitter extraction (Go/TS/JS/Python/Rust/Java/C#/Kotlin/Swift/Scala/PHP/Ruby/Elixir/C/C++/Dart/OCaml/Lua/Bash/SQL/HTML/CSS/Markdown/OrgMode/Protobuf/YAML/TOML/HCL/Dockerfile). ~60 are regex-tier, ~165 are "forest signature-only" (definitions + EdgeDefines only, no call resolution, no scope). For DeesseJS stack (TS/Go/Python): full coverage.
- **Scale cost is real**: 5.07 GB peak heap on torvalds/linux (70k files, 1.69M nodes). 580 MB on vscode (10k files). Plan memory accordingly.
- **Benchmark critique**: BENCHMARK.md is vendor-curated — most numbers are against gortex's own repo or hand-curated fixtures. The 96.8% R@5 on exact-symbol lookup is real and excellent; concept/multi-hop recall is only 25-30%. The "3-50× fewer tokens" headline is honest but the 50× is identifier-lookup peak, not median.
- **Subagent confinement pattern** (genuinely novel): gortex writes subagents (`gortex-search`, `gortex-impact`) to `~/.claude/agents/` with `tools: mcp__gortex__…` frontmatter — **graph-only by construction**, no Bash/Grep/Glob. CI validates the allowlist (`subagents_test.go`) so a tool rename can't silently drop access. **Worth replicating this pattern** for any DeesseJS internal tooling that exposes graph ops.
- **Limitation #70** (open issue, acknowledged): PreCompact hook can't prevent Claude Code harness from re-injecting raw file reads as `system-reminder` blocks post-compaction. Hooks fire before summarization; harness's re-injection decision happens after, outside gortex's reach. Affects real token savings on long sessions.
- **Supply chain is excellent** — cosign-signed, SLSA-3 provenance, VirusTotal 0/72 on latest release. Reasonable for security-conscious enterprise.
- **MCP contract is well-designed for lean context**: ~34 tools published eagerly by default (preset `core` in `defer` mode); the other ~146 reachable via `tools_search` that promotes them on demand. Presets: `core | full | readonly | edit | nav`. `plan_turn` tool returns ranked next-calls with pre-filled args for ~200 tokens — replaces the agent's instinct to grep everything.
- **GCX1 wire format** (custom binary, −27% tokens vs JSON at same fidelity) is published and round-trippable. Not widely adopted but interesting if bandwidth matters.
