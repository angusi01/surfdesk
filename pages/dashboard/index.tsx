import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import { createServerSupabase } from '../../lib/supabaseClient';

type School = { id: string; name: string; slug: string; subscription_status: string };

export default function Dashboard({ school }: { school: School | null }) {
  return (
    <main className="page">
      <h1>Dashboard</h1>
      {school ? (
        <section className="panel">
          <h2>{school.name}</h2>
          <p>Subscription: {school.subscription_status}</p>
          <p>Public page: <Link href={`/book/${school.slug}`}>/book/{school.slug}</Link></p>
          <div className="actions">
            <Link href="/dashboard/sessions">Manage sessions</Link>
            <Link href="/dashboard/billing">Billing</Link>
          </div>
        </section>
      ) : (
        <p>Create a school row in Supabase for this user to start managing sessions.</p>
      )}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabase(ctx);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { redirect: { destination: '/login', permanent: false } };
  const { data: school } = await supabase.from('schools').select('*').eq('owner_id', user.id).maybeSingle();
  return { props: { school } };
};
