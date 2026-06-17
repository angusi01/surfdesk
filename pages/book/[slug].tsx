import type { GetServerSideProps } from 'next';
import { BookingForm } from '../../components/Public/BookingForm';
import { getServiceSupabase } from '../../lib/supabaseClient';

type School = { id: string; name: string; slug: string };
type Session = { id: string; session_date: string; start_time: string; end_time: string; max_capacity: number; current_bookings: number };

export default function BookingPage({ school, sessions }: { school: School; sessions: Session[] }) {
  return (
    <main className="page">
      <h1>{school.name}</h1>
      <p>Choose an available session and reserve your place.</p>
      {sessions.length ? <BookingForm sessions={sessions} /> : <p>No upcoming sessions are available.</p>}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const supabase = getServiceSupabase();
  const { data: school } = await supabase.from('schools').select('*').eq('slug', String(params?.slug)).single();
  if (!school) return { notFound: true };
  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .eq('school_id', school.id)
    .gte('session_date', new Date().toISOString().slice(0, 10))
    .order('session_date')
    .order('start_time');
  return {
    props: {
      school,
      sessions: (sessions ?? []).filter((session) => session.current_bookings < session.max_capacity),
    },
  };
};
