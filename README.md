FocusOS
=================

Cross-platform personal productivity platform with isolated Friendspaces, built on Supabase (PostgreSQL) and deployed on Vercel (Web) + Google Play (Flutter Android).

Monorepo plan
-------------

```
Focus_OS_2.0/
  apps/
    web/           # Next.js (React, Tailwind) – Admin Web App
    mobile/        # Flutter – Android app for Admin + Friends
  supabase/
    migrations/    # SQL migrations (schema + RLS policies)
  docs/
    architecture.md
```

Quick start
-----------

1) Supabase
- Create a Supabase project.
- In the Supabase SQL editor, run `supabase/migrations/0001_init.sql`.
- Note your `SUPABASE_URL` and `SUPABASE_ANON_KEY` (Project Settings → API).

2) Web (Next.js on Vercel)
- Requirements: Node 18+.
- Scaffold (example):
  - `npx create-next-app@latest apps/web --ts --tailwind --eslint --app --src-dir --import-alias "@/*"`
- Add environment variables in `apps/web/.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL=...`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
- Deploy via Vercel, set the same env vars in the Vercel project.

3) Mobile (Flutter for Android)
- Requirements: Flutter SDK.
- Scaffold: `flutter create apps/mobile`
- Add environment configuration for Supabase (e.g., `lib/env.dart` with URL + anon key).

What’s included now
-------------------
- `supabase/migrations/0001_init.sql`: Tables for users, friendspaces, tasks, learning resources, mood logs, XP, streaks, messages. Strong RLS to isolate each Friendspace.
- `docs/architecture.md`: High-level architecture, access controls, and module mapping.

Next steps
----------
- Generate the web app skeleton and connect to Supabase.
- Generate the Flutter app skeleton and connect to Supabase.
- Implement storage buckets and policies for proofs/journals/avatars.


