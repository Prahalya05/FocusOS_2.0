import { supabase } from '@/lib/supabaseClient';

export default async function Home() {
  const { data: profile } = await supabase
    .from('users')
    .select('id, role, display_name')
    .single();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">FocusOS Admin</h1>
      <p className="mt-2 text-sm text-gray-600">Next.js + Supabase is working.</p>
      <pre className="mt-4 rounded bg-gray-100 p-4 text-xs">{JSON.stringify(profile, null, 2)}</pre>
    </main>
  );
}


