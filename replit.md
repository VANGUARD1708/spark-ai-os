# Spark

**Spark** is an AI-powered commerce operating system that takes users from idea → product → content → sales.

## Stack

- **Frontend**: React 19 + Vite + TailwindCSS + shadcn/ui — at `artifacts/spark/`
- **Backend**: Express 5 — at `artifacts/api-server/`
- **Database**: PostgreSQL via Drizzle ORM — at `lib/db/`
- **AI**: OpenAI (gpt-5.2) via Replit AI Integrations — at `lib/integrations-openai-ai-server/`
- **API Layer**: OpenAPI spec + Orval codegen — at `lib/api-spec/`

## Architecture

### Shared Libraries (`lib/`)
- `lib/api-spec/` — OpenAPI 3.1 spec (source of truth)
- `lib/api-zod/` — Generated Zod schemas from OpenAPI
- `lib/api-client-react/` — Generated React Query hooks
- `lib/db/` — Drizzle ORM + PostgreSQL schema
- `lib/integrations-openai-ai-server/` — OpenAI client wrapper

### Apps (`artifacts/`)
- `artifacts/spark/` — React frontend, preview at `/`
- `artifacts/api-server/` — Express API, prefix at `/api`

## Phase 1 MVP Features (Built)

1. **Idea Generator** (`/ideas`) — Enter a niche, get AI-generated product ideas with demand/competition scores, profit potential, saturation level
2. **Bundle Builder** (`/bundle`) — Turn a product idea into a high-converting offer with bonuses, pricing, guarantee, bullets
3. **TikTok Script Generator** (`/scripts`) — Generate viral TikTok scripts with hooks, timestamps, hashtags, captions, viral score
4. **Saved Ideas** (`/saved`) — Persist and manage your best ideas
5. **Dashboard** (`/`) — Stats overview + quick-start navigation

## Database Schema

- `saved_ideas` — User-saved product ideas with all scoring metadata
- `generation_stats` — Tracks types of generations (idea/bundle/script) and niches

## Key Commands

```bash
# Run codegen after API spec changes
pnpm --filter @workspace/api-spec run codegen

# Push DB schema changes
pnpm --filter @workspace/db run push

# Build API server
pnpm --filter @workspace/api-server run build

# Build frontend
pnpm --filter @workspace/spark run build
```

## Planned Phases

- **Phase 2**: Product page generator, digital product generator
- **Phase 3**: Storefront + checkout + payment integration
- **Phase 4**: Analytics + optimization + supplier integration
- **Phase 5**: Automation + community + advanced AI insights
