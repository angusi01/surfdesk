import Link from 'next/link';

const features = [
  ['CalendarCheck', 'Online bookings', 'Let customers reserve lessons from a clean booking page that works from Instagram, Google, and your website.'],
  ['Users', 'Group session capacity', 'Set max students per session, see remaining spots, and avoid overbooking busy weekends.'],
  ['Mail', 'Automated emails', 'Send confirmations, reminders, and lesson details without manually chasing every booking.'],
  ['CreditCard', 'Simple payments', 'Take deposits or full payment before students arrive at the beach.'],
  ['ClipboardList', 'Daily run sheet', 'See tomorrow’s lessons, instructors, student names, and contact details in one place.'],
  ['Waves', 'Aussie surf workflow', 'Built around coastal schools, seasonal demand, and mobile-first operators.'],
];

const plans = [
  ['Starter', '$29', 'For solo instructors testing online booking.', 'Start Free Trial'],
  ['Pro', '$39', 'For growing surf schools running daily sessions.', 'Start Free Trial'],
  ['Multi-school', '$79', 'For operators managing multiple beaches or brands.', 'Start Free Trial'],
];

function Icon({ name }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' };
  const paths = {
    CalendarCheck: [<path key="1" d="M8 2v4" />, <path key="2" d="M16 2v4" />, <rect key="3" x="3" y="4" width="18" height="18" rx="2" />, <path key="4" d="M3 10h18" />, <path key="5" d="m9 16 2 2 4-4" />],
    Users: [<path key="1" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />, <circle key="2" cx="9" cy="7" r="4" />, <path key="3" d="M22 21v-2a4 4 0 0 0-3-3.9" />, <path key="4" d="M16 3.1a4 4 0 0 1 0 7.8" />],
    Mail: [<rect key="1" x="3" y="5" width="18" height="14" rx="2" />, <path key="2" d="m3 7 9 6 9-6" />],
    CreditCard: [<rect key="1" x="2" y="5" width="20" height="14" rx="2" />, <path key="2" d="M2 10h20" />],
    ClipboardList: [<rect key="1" x="8" y="2" width="8" height="4" rx="1" />, <path key="2" d="M16 4h2a2 2 0 0 1 2 2v14H4V6a2 2 0 0 1 2-2h2" />, <path key="3" d="M8 12h8" />, <path key="4" d="M8 16h6" />],
    Waves: [<path key="1" d="M2 12c3 0 3-2 6-2s3 2 6 2 3-2 6-2 3 2 6 2" />, <path key="2" d="M2 18c3 0 3-2 6-2s3 2 6 2 3-2 6-2 3 2 6 2" />],
  };
  return <svg {...common}>{paths[name]}</svg>;
}

export default function Home() {
  return (
    <main>
      <section className="surf-hero">
        <div className="surf-copy">
          <span>Built for Aussie surf schools</span>
          <h1>Your surf school, booked solid.</h1>
          <p>Run lesson availability, online bookings, deposits, reminders, and daily run sheets without stitching together forms, DMs, and spreadsheets.</p>
          <div className="hero-actions">
            <Link className="amber-cta" href="/signup">Start Free Trial</Link>
            <Link className="text-link" href="/book/demo">See a live booking page</Link>
          </div>
          <small>No credit card required. 14-day free trial.</small>
        </div>
        <div className="phone-stage" aria-label="Mobile booking page preview">
          <div className="phone-frame">
            <div className="phone-screen">
              <span>Sunrise Surf Co.</span>
              <strong>Saturday lessons</strong>
              {['Beginner group', 'Kids private', 'Intermediate clinic'].map((session, index) => (
                <article key={session}>
                  <div>
                    <b>{session}</b>
                    <small>{index + 2}:00 pm · {index === 0 ? '4 spots' : '2 spots'}</small>
                  </div>
                  <button type="button">Book</button>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="proof-bar">
        <p>Trusted by surf schools across the coast</p>
        {['Noosa Surf Co.', 'Mooloolaba Learn To Surf', 'Byron Bay Boards', 'Burleigh Lessons'].map((school) => <span key={school}>{school}</span>)}
      </section>

      <section id="features" className="surf-features">
        <div className="section-title">
          <h2>Built for booking days, not back-office days.</h2>
          <p>Everything a surf school needs to fill sessions, keep students informed, and stay organised from the beach.</p>
        </div>
        <div className="feature-grid">
          {features.map(([icon, title, copy]) => (
            <article key={title}>
              <Icon name={icon} />
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="surf-pricing">
        <div className="section-title">
          <h2>Simple monthly pricing.</h2>
          <p>Start small, then add more sessions and schools as your calendar fills up.</p>
        </div>
        <div className="plan-grid">
          {plans.map(([name, price, copy, cta]) => (
            <article key={name} className={name === 'Pro' ? 'popular-plan' : ''}>
              {name === 'Pro' && <span>Most popular</span>}
              <h3>{name}</h3>
              <strong>{price}<small>/month</small></strong>
              <p>{copy}</p>
              <Link href="/signup">{cta}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="testimonials">
        {[
          ['We stopped losing bookings in DMs within the first week.', 'Mia, Coolum Surf School'],
          ['The daily run sheet is exactly how instructors think.', 'Ben, Sunshine Coast Surf Co.'],
          ['Parents book and pay before they arrive. That changed everything.', 'Tahlia, North Coast Surf'],
        ].map(([quote, name]) => (
          <article key={name}>
            <p>“{quote}”</p>
            <span>{name}</span>
          </article>
        ))}
      </section>

      <footer className="surf-footer">
        <span>© 2026 SurfDesk. Built on the Sunshine Coast.</span>
        <nav><Link href="/privacy">Privacy</Link><Link href="/contact">Contact</Link></nav>
      </footer>
    </main>
  );
}
