Getting started
===============

Prereqs
-------
- Node.js 18+ (LTS)
- Supabase CLI (optional, recommended)
- Flutter SDK (for mobile)

Backend
-------
1) Create a Supabase project.
2) Apply `supabase/migrations/0001_init.sql`.
3) Create private Storage buckets: `proofs`, `journals`, `avatars`.

Web
---
1) In `apps/web`, scaffold the app and install deps.
2) Create `.env.local` from `.env.example` and fill Supabase values.
3) Run dev server.

Mobile
------
1) In `apps/mobile`, run `flutter create .`.
2) Copy `lib/env.example.dart` to `lib/env.dart` and fill values.
3) `flutter run`.


