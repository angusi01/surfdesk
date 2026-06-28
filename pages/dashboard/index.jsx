import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

const initialBookings = [
  { name: 'Jake Sullivan', time: '9:00 AM', lessonType: 'Private', status: 'Confirmed' },
  { name: 'Maya Patel', time: '11:00 AM', lessonType: 'Group', status: 'Pending' },
  { name: 'Tom Wilson', time: '1:00 PM', lessonType: 'Private', status: 'Confirmed' },
  { name: 'Ella Chen', time: '3:00 PM', lessonType: 'Group', status: 'Pending' },
];

function DashboardSkeleton() {
  return (
    <DashboardLayout>
      <main className="dashboard-content">
        <div className="skeleton dashboard-skeleton__heading" />
        <div className="dashboard-stats">{[1, 2, 3, 4].map((item) => <div className="skeleton dashboard-skeleton__card" key={item} />)}</div>
      </main>
    </DashboardLayout>
  );
}

function formatDate(session) {
  const date = new Date(`${session.session_date}T00:00:00`);
  return new Intl.DateTimeFormat('en-AU', { weekday: 'short', day: 'numeric', month: 'short' }).format(date);
}

export default function Dashboard({ school, stats, upcomingSessions = [], error }) {
  const [hydrated, setHydrated] = useState(false);
  const [bookings, setBookings] = useState(initialBookings);
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    const total = stats?.bookingsToday ?? 0;
    const startedAt = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setBookingCount(Math.min(total, Math.floor((elapsed / 700) * total)));
      if (elapsed >= 700) {
        setBookingCount(total);
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [stats?.bookingsToday]);

  function checkInBooking(index) {
    setBookings((current) => current.map((booking, bookingIndex) => (
      bookingIndex === index ? { ...booking, status: 'Checked In' } : booking
    )));
  }

  if (!hydrated) return <DashboardSkeleton />;
  if (error) {
    return (
      <DashboardLayout school={school}>
        <main className="dashboard-content"><section className="dashboard-panel"><h1>Dashboard unavailable</h1><p>{error}</p><button className="pill-button" type="button" onClick={() => window.location.reload()}>Retry</button></section></main>
      </DashboardLayout>
    );
  }

  const statCards = [
    ["Today's Bookings", bookingCount, `${stats.fillRate} fill rate`, 'calendar_month'],
    ['This Week', '—', 'Weekly reporting coming soon', 'date_range'],
    ['Revenue MTD', '—', 'Connect billing to track', 'payments'],
    ['Upcoming Sessions', upcomingSessions.length, 'Today', 'surfing'],
  ];

  return (
    <>
      <Head><title>Dashboard | SurfDesk</title></Head>
      <DashboardLayout school={school}>
      <header className="dashboard-header">
        <div><p>Welcome back</p><h1>{school.name}</h1></div>
        <div className="dashboard-header__actions">
          <button className="icon-button" type="button" aria-label="Notifications"><span className="material-symbols-outlined" aria-hidden="true">notifications</span></button>
          <Link className="pill-button pill-button--small" href="/dashboard/sessions"><span className="material-symbols-outlined" aria-hidden="true">add</span>New Session</Link>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-stats" aria-label="Business overview">
          {statCards.map(([label, value, detail, icon]) => (
            <article className="dashboard-stat" key={label}>
              <span className="material-symbols-outlined dashboard-stat__icon" aria-hidden="true">{icon}</span>
              <span>{label}</span><strong>{value}</strong><small>{detail}</small>
            </article>
          ))}
        </section>

        <div className="dashboard-grid">
          <section className="dashboard-panel dashboard-sessions">
            <header><h2>Upcoming Sessions</h2><Link href="/dashboard/sessions">View Calendar</Link></header>
            {upcomingSessions.length ? upcomingSessions.map((session) => (
              <article key={session.id}>
                <div><span>{session.session_type || 'Group Lesson'}</span><strong>{formatDate(session)} · {session.start_time.slice(0, 5)}</strong></div>
                <div><span className="material-symbols-outlined" aria-hidden="true">group</span>{session.current_bookings}/{session.max_capacity}</div>
                <Link href="/dashboard/sessions">View</Link>
              </article>
            )) : <div className="dashboard-empty"><span className="material-symbols-outlined" aria-hidden="true">event_available</span><p>No sessions scheduled for today.</p><Link href="/dashboard/sessions">Add a session</Link></div>}
          </section>

          <section className="dashboard-panel dashboard-bookings">
            <header><h2>Recent Bookings</h2><Link href="/dashboard/bookings">View all</Link></header>
            <div className="dashboard-table" role="table" aria-label="Recent bookings">
              <div className="dashboard-table__head" role="row"><span>Student</span><span>Session</span><span>Status</span><span>Action</span></div>
              {bookings.map((booking, index) => (
                <div role="row" key={`${booking.name}-${booking.time}`}>
                  <strong>{booking.name}</strong><span>{booking.time} · {booking.lessonType}</span>
                  <span className={`status-chip status-chip--${booking.status.toLowerCase().replace(' ', '-')}`}>{booking.status}</span>
                  <button type="button" onClick={() => checkInBooking(index)} disabled={booking.status === 'Checked In'}>{booking.status === 'Checked In' ? 'Done' : 'Check in'}</button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      </DashboardLayout>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const supabase = createPagesServerClient(ctx, { options: { db: { schema: 'surfdesk' } } });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { redirect: { destination: '/login', permanent: false } };

  try {
    const { data: school, error: schoolError } = await supabase.from('schools').select('id, name, slug').eq('owner_id', session.user.id).maybeSingle();
    if (schoolError) throw schoolError;
    if (!school) return { redirect: { destination: '/onboarding', permanent: false } };

    const today = new Date().toISOString().slice(0, 10);
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('id, session_date, start_time, session_type, max_capacity, current_bookings')
      .eq('school_id', school.id)
      .eq('session_date', today)
      .order('start_time');
    if (sessionsError) throw sessionsError;
    const totals = (sessions ?? []).reduce((acc, row) => ({
      sessionsToday: acc.sessionsToday + 1,
      bookingsToday: acc.bookingsToday + Number(row.current_bookings ?? 0),
      capacityToday: acc.capacityToday + Number(row.max_capacity ?? 0),
    }), { sessionsToday: 0, bookingsToday: 0, capacityToday: 0 });

    return { props: { initialSession: session, school, upcomingSessions: sessions ?? [], stats: { sessionsToday: totals.sessionsToday, bookingsToday: totals.bookingsToday, fillRate: totals.capacityToday > 0 ? `${Math.round((totals.bookingsToday / totals.capacityToday) * 100)}%` : 'N/A' } } };
  } catch (err) {
    return { props: { initialSession: session, school: null, upcomingSessions: [], stats: { sessionsToday: 0, bookingsToday: 0, fillRate: 'N/A' }, error: err instanceof Error ? err.message : 'Could not load dashboard data.' } };
  }
}
