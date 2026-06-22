import Link from 'next/link';
export default function Home() {
    return (<main className="page">
      <section className="hero">
        <div>
          <h1>Run your surf school from your pocket</h1>
          <p>Manage sessions, take bookings online, and spend less time on Instagram DMs. Built for surf schools on the Australian coast.</p>
          <Link className="button-link" href="/signup">Start Free Trial</Link>
        </div>
        <div className="wave-panel pricing-panel">
          {['Online bookings', '$39/month', '14-day trial'].map((item) => (
            <article className="group relative grid gap-4 border border-[var(--line)] bg-white p-5 font-black transition-transform hover:scale-[1.02]" key={item}>
              {item === '$39/month' && (
                <span className="absolute right-3 top-3 rounded-full bg-yellow-400 px-3 py-1 text-sm text-yellow-900">
                  Most Popular
                </span>
              )}
              <span className={item === '$39/month' ? 'pr-32' : ''}>{item}</span>
              <Link className="button-link m-0 hidden justify-self-start group-hover:inline-flex" href="/signup">
                Start 14-Day Trial
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="quick-actions">
        <article className="quick-card"><strong>Online Bookings</strong><span>No DMs, no phone tag, no double bookings.</span></article>
        <article className="quick-card"><strong>Session Management</strong><span>Create recurring sessions, set capacities, and see tomorrow at a glance.</span></article>
        <article className="quick-card"><strong>Automated Emails</strong><span>Confirmations, reminders, and follow-ups sent automatically.</span></article>
        <article className="quick-card"><strong>Your Own Booking Page</strong><span>A clean mobile-friendly booking page for your Instagram bio.</span></article>
      </section>
    </main>);
}
