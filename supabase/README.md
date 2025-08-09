Supabase setup
==============

1) Create a project on Supabase and get your `SUPABASE_URL` and `ANON_KEY`.
2) Apply the schema:
   - Option A (SQL editor): paste the contents of `migrations/0001_init.sql` and run.
   - Option B (CLI): install Supabase CLI, then run migrations locally and link your project.

Notes
-----
- Users are provisioned from `auth.users` into `public.users` via trigger `handle_new_auth_user`.
- RLS is enabled on all tables. Membership in a `friendspace` gates access to tasks, logs, resources, etc.
- Learning resources are created by Admins; Friends see only assigned resources.
- Add Storage buckets (`proofs`, `journals`, `avatars`) and set policies to allow access to members of a Friendspace only.


