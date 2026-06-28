import Head from 'next/head';
import Link from 'next/link';
import { MarketingFooter } from '../components/MarketingFooter';

const features = [
  {
    icon: 'calendar_today',
    visual: 'calendar_month',
    title: 'Online Bookings',
    copy: 'Students book directly from your booking page. No back-and-forth.',
  },
  {
    icon: 'schedule',
    visual: 'dashboard',
    title: 'Session Management',
    copy: 'Set your sessions, capacity, and schedule once. Done.',
  },
  {
    icon: 'mail',
    visual: 'email',
    title: 'Automated Emails',
    copy: 'Confirmations and reminders go out automatically.',
  },
];

const plans = [
  { name: 'Free', price: '$0', copy: 'Basic features for solo instructors.', features: ['Up to 10 bookings/mo', 'Basic booking page'], cta: 'Get Started' },
  { name: 'Pro', price: '$39', copy: 'Everything you need to grow.', features: ['Unlimited bookings', 'Automated reminders', 'Payment integration'], cta: 'Choose Pro', popular: true },
  { name: 'Multi-School', price: '$89', copy: 'Scale your operations effortlessly.', features: ['Multiple locations', 'Advanced analytics'], cta: 'Contact Sales' },
];

export default function Home() {
  return (
    <>
      <Head><title>SurfDesk | Surf School Booking Software</title><meta name="description" content="Take online bookings and manage sessions for your surf school." /></Head>
      <main className="marketing-page">
      <section className="home-hero">
        <div>
          <h1>Take bookings for your surf school.</h1>
          <p>No phone calls, no DMs. Students book online, you just show up and teach.</p>
          <Link href="/signup" className="pill-button home-hero__cta">Start for free</Link>
          <small>Free plan available — no credit card needed.</small>
        </div>
      </section>

      <section className="feature-rows" aria-label="SurfDesk features">
        {features.map((feature, index) => (
          <article className={`feature-row${index % 2 ? ' feature-row--reverse' : ''}`} key={feature.title}>
            <div className="feature-row__copy">
              <span className="icon-tile material-symbols-outlined" aria-hidden="true">{feature.icon}</span>
              <h2>{feature.title}</h2>
              <p>{feature.copy}</p>
            </div>
            <div className="feature-row__visual" aria-hidden="true">
              <span className="material-symbols-outlined">{feature.visual}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="home-pricing" id="pricing">
        <h2>Simple, transparent pricing</h2>
        <div className="home-pricing__grid">
          {plans.map((plan) => (
            <article className={`price-card price-card--compact${plan.popular ? ' price-card--popular' : ''}`} key={plan.name}>
              {plan.popular ? <span className="popular-label">Most Popular</span> : null}
              <div>
                <span className="price-card__name">{plan.name}</span>
                <strong>{plan.price}</strong>
                <small>/month</small>
              </div>
              <p>{plan.copy}</p>
              <ul>
                {plan.features.map((item) => <li key={item}><span className="material-symbols-outlined" aria-hidden="true">check</span>{item}</li>)}
              </ul>
              <Link href="/signup" className={plan.popular ? 'pill-button' : 'outline-pill'}>{plan.cta}</Link>
            </article>
          ))}
        </div>
      </section>

      <MarketingFooter />
      </main>
    </>
  );
}
