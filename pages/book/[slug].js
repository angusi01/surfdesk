import Head from 'next/head';
import { BookingForm } from '../../components/Public/BookingForm';
import { getServiceSupabase } from '../../lib/supabaseClient';

export default function BookingPage({ school, sessions }) {
  return (
    <>
      <Head>
        <title>Book a Lesson | {school.name}</title>
      </Head>
      <main className="public-booking-page">
        <div className="powered-by powered-by--top">Powered by SurfDesk</div>
        <header>
          <h1>{school.name}</h1>
          <p>Book a session online</p>
        </header>
        {sessions.length ? <BookingForm sessions={sessions} /> : <p className="booking-empty">No upcoming sessions are available.</p>}
      </main>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const supabase = getServiceSupabase();
  const { data: school } = await supabase.from('schools').select('*').eq('slug', String(params?.slug)).single();

  if (!school) {
    return { notFound: true };
  }

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
}
