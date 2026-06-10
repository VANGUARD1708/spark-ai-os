# SPARK Memory

- [PWA Build Setup](pwa-build.md) — Vite config requires PORT/BASE_PATH env vars; use defaults for builds
- [TypeScript Schema Evolution](schema-evolution.md) — When adding API fields (e.g. stats.totalGenerations), use `as any` cast in frontend to avoid schema regeneration blocking builds
- [API Caching Pattern](api-cache.md) — In-memory TTL cache (5 min) for GPT-heavy endpoints prevents timeouts
- [Sidebar Navigation](sidebar-nav.md) — All 27 links must be verified against both App.tsx routes and page files
- [Page Guide System](page-guide.md) — Contextual help covers 28+ pages; add entries when adding new routes
- [Free Tier Limits](free-tier.md) — 50 generations/30 days, displayed in sidebar usage bar
