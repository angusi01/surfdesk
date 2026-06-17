import type { GetServerSideProps } from 'next';
import { SessionForm } from '../../components/Dashboard/SessionForm';
import { SessionsList } from '../../components/Dashboard/SessionsList';
import { createServerSupabase } from '../../lib/supabaseClient';

type School = { id: string; name: string };
type Session = { id: string; session_date: string; start_time: string; end_time: string; max_capacity: number; current_bookings: number };

export default function Sessions({ school, sessions }: { school: School | null; sessions: Session[] }) {
  return (
    <main className="page">
      <h1>Sessions</h1>
      {school && <SessionForm schoolId={school.id} />}
      <SessionsList sessions={sessions} />
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabase(ctx);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { redirect: { destination: '/login', permanent: false } };
  const { data: school } = await supabase.from('schools').select('*').eq('owner_id', user.id).maybeSingle();
  const { data: sessions } = school
    ? await supabase.from('sessions').select('*').eq('school_id', school.id).order('session_date')
    : { data: [] };
  return { props: { school, sessions: sessions ?? [] } };
};
