Architecture overview
=====================

Core domains → DB tables
------------------------
- Users & Roles → `public.users` (1:1 with `auth.users`), roles: `admin`, `friend`.
- Friendspaces → `public.friendspaces` (`admin_id`, `friend_user_id`).
- Tasks & Goals → `public.tasks` (scoped by `friendspace_id`).
- Learning → `public.learning_resources`, `public.friendspace_resources` (assignment + progress).
- Focus & Streaks → `public.streaks`, time logs can be attached to tasks or resources.
- Emotional wellness → `public.mood_logs`.
- XP system → `public.xp_logs`.
- Optional chat → `public.messages`.

Access model (RLS)
------------------
- A user can only read their own `public.users` row.
- `friendspaces`: visible to the Admin who owns them and the Friend assigned to them. Only Admins can create/update/delete.
- All child tables (`tasks`, `mood_logs`, `xp_logs`, `streaks`, `messages`, `friendspace_resources`) are readable/writable only if the caller belongs to the parent `friendspace` (Admin or that Friend).
- `learning_resources` are created/owned by Admins. Admins see their own; Friends see resources only if assigned to their Friendspace.

Frontend architecture
---------------------
- Web (Admin): Next.js (App Router), Tailwind. Connect to Supabase via client lib; server components can call Supabase using service role on server-only operations if needed.
- Mobile (Admin + Friend): Flutter app that authenticates with Supabase and reads/writes data governed by RLS.

Key screens
-----------
- Dashboard: Today’s tasks, streaks, mood check-in, learning snapshot, quick Pomodoro.
- Goals & Daily: Create/assign goals (Admin), tick off tasks, upload proofs.
- Learning Zone: Resource lists, progress, lightweight quizzes (store in `friendspace_resources` metadata or separate table if needed).
- Focus Mode: Timers linked to tasks/resources, write `timer_seconds` to `tasks` or a dedicated `focus_sessions` table (future).
- Wellness: Mood logs, journaling prompts.
- XP & Achievements: Aggregate from `xp_logs` and show streaks.

Deployment
----------
- Web → Vercel (connect GitHub repo). Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Flutter → Google Play. Configure Supabase URL/Anon in a build-time config.
- Backend → Supabase hosted. Apply migrations and storage buckets.

Storage
-------
- Buckets: `proofs`, `journals`, `avatars` (private). Recommended keying: `friendspace_id/<resource>`.
- Add storage RLS policies to allow Admin or Friend belonging to the `friendspace` path to read/write.


