# Supabase Integration

Vertex Markets uses Supabase Postgres for persistence (and Storage when a secret key is set).

## Current project

- URL: `https://funhnjjtxopynmmwpeiy.supabase.co`
- Ref: `funhnjjtxopynmmwpeiy`
- Document table: `public.app_documents`
- Storage bucket: `uploads` (created by migration)

## Status

Schema migrated and seeded successfully against this project.

## Run locally

```bash
# from backend/
npm run migrate   # once
npm run seed      # optional if empty
npm run dev
```

Health check:

```bash
curl http://localhost:3000/health
# { "ok": true, "store": "postgres", "supabase": "ok" }
```

## Still needed for Storage / REST

Paste your **secret key** from Dashboard → **API Keys** into `backend/.env`:

```env
SUPABASE_SECRET_KEY=sb_secret_…
```

Without it, document persistence still works via `DATABASE_URL` / Postgres. File uploads fall back to local disk until the secret key is set.

## Frontend

Repo root `.env`:

```env
VITE_SUPABASE_URL=https://funhnjjtxopynmmwpeiy.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_…
```
