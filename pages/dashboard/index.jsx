import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

const mockBookings = [
  { name: 'Jake Sullivan', time: '9:00 AM', lessonType: 'Private', status: 'Confirmed' },
  { name: 'Maya Patel', time: '11:00 AM', lessonType: 'Group', status: 'Pending' },
  { name: 'Tom Wilson', time: '1:00 PM', lessonType: 'Private', status: 'Confirmed' },
  { name: 'Ella Chen', time: '3:00 PM', lessonType: 'Group', status: 'Pending' },
];

function DashboardSkeleton() {
  return (
    <DashboardLayout>
      <main className="dashboard-content">
        <div className="skeleton banner" />
        <div className="stats-grid">
          <div className="skeleton stat" />
          <div className="skeleton stat" />
          <div className="skeleton stat" />
        </div>
      </main>
    </DashboardLayout>
  );
}

export default function Dashboard({ school, stats, error }) {
  const [hydrated, setHydrated] = useState(false);
  const [bookings, setBookings] = useState(mockBookings);
  const [bookingCount, setBookingCount] = useState(0);
  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    const duration = 1000;
    const total = mockBookings.length;
    const startedAt = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextCount = Math.min(total, Math.floor((elapsed / duration) * total));
      setBookingCount(nextCount);
      if (elapsed >= duration) {
        setBookingCount(total);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  function checkInBooking(index) {
    setBookings((currentBookings) => currentBookings.map((booking, bookingIndex) => (
      bookingIndex === index ? { ...booking, status: 'Checked In' } : booking
    )));
  }

  if (!hydrated) return <DashboardSkeleton />;
  if (error) {
    return (
      <DashboardLayout>
        <main className="dashboard-content">
          <section className="panel">
            <h1>Dashboard unavailable</h1>
            <p>{error}</p>
            <button type="button" onClick={() => window.location.reload()}>Retry</button>
          </section>
        </main>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <main className="dashboard-content">
        <div className="mb-4 flex justify-end">
          <div className="rounded-full border-2 border-[var(--line)] bg-white px-4 py-2 text-sm font-black text-[var(--ink)] shadow-sm">
            Today's Bookings: {bookingCount}
          </div>
        </div>
        <section className="panel grid gap-4">
          <h1 className="text-3xl leading-tight">Today's Bookings</h1>
          <div className="grid gap-3">
            {bookings.map((booking, index) => (
              <article className="grid gap-3 border border-[var(--line)] bg-white p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center" key={`${booking.name}-${booking.time}`}>
                <div className="grid gap-1">
                  <strong>{booking.name}</strong>
                  <span className="text-sm text-[var(--muted)]">{booking.time} · {booking.lessonType}</span>
                </div>
                <span className={`justify-self-start rounded-full px-3 py-1 text-sm font-black ${booking.status === 'Pending' ? 'bg-yellow-400 text-yellow-900' : 'bg-green-100 text-green-800'}`}>
                  {booking.status}
                </span>
                <button type="button" onClick={() => checkInBooking(index)}>
                  Check In
                </button>
              </article>
            ))}
          </div>
        </section>
        <section className="welcome-banner">
          <div>
            <h1>{school.name}</h1>
            <p>Booking page <code>surfdesk.com.au/book/{school.slug}</code></p>
          </div>
          <Link href={`/book/${school.slug}`} target="_blank" rel="noreferrer">View Booking Page</Link>
        </section>
        <section className="stats-grid">
          <article className="stat-card"><strong>{stats.sessionsToday}</strong><span>Sessions Today</span></article>
          <article className="stat-card"><strong>{stats.bookingsToday}</strong><span>Total Bookings Today</span></article>
          <article className="stat-card"><strong>{stats.fillRate}</strong><span>Fill Rate</span></article>
        </section>
        <section className="quick-actions">
          <Link href="/dashboard/sessions" className="quick-card"><strong>+</strong><span>Manage Sessions</span><small>Add Session</small></Link>
          <Link href="/dashboard/bookings" className="quick-card"><strong>Bookings</strong><span>View Bookings</span><small>View All Bookings →</small></Link>
        </section>
      </main>
    </DashboardLayout>
  );
}

export async function getServerSideProps(ctx) {
  const supabase = createPagesServerClient(ctx, { options: { db: { schema: 'surfdesk' } } });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { redirect: { destination: '/login', permanent: false } };

  try {
    const { data: school, error: schoolError } = await supabase
      .from('schools')
      .select('id, name, slug')
      .eq('owner_id', session.user.id)
      .maybeSingle();
    if (schoolError) throw schoolError;
    if (!school) return { redirect: { destination: '/onboarding', permanent: false } };

    const today = new Date().toISOString().slice(0, 10);
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('max_capacity, current_bookings')
      .eq('school_id', school.id)
      .eq('session_date', today);
    if (sessionsError) throw sessionsError;
    const totals = (sessions ?? []).reduce((acc, sessionRow) => ({
      sessionsToday: acc.sessionsToday + 1,
      bookingsToday: acc.bookingsToday + Number(sessionRow.current_bookings ?? 0),
      capacityToday: acc.capacityToday + Number(sessionRow.max_capacity ?? 0),
    }), { sessionsToday: 0, bookingsToday: 0, capacityToday: 0 });

    return {
      props: {
        initialSession: session,
        school,
        stats: {
          sessionsToday: totals.sessionsToday,
          bookingsToday: totals.bookingsToday,
          fillRate: totals.capacityToday > 0 ? `${Math.round((totals.bookingsToday / totals.capacityToday) * 100)}%` : 'N/A',
        },
      },
    };
  } catch (err) {
    return {
      props: {
        initialSession: session,
        school: null,
        stats: { sessionsToday: 0, bookingsToday: 0, fillRate: 'N/A' },
        error: err instanceof Error ? err.message : 'Could not load dashboard data.',
      },
    };
  }
}
