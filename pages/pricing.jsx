import Head from 'next/head';
import Link from 'next/link';
import { MarketingFooter } from '../components/MarketingFooter';

const plans = [
  {
    name: 'Free',
    price: '$0',
    features: ['Up to 10 bookings/month', 'Basic booking page', 'Email confirmations'],
    cta: 'Get started free',
  },
  {
    name: 'Pro',
    price: '$39',
    features: ['Unlimited bookings', 'Automated reminders', 'Waitlist management', 'Revenue reporting', 'Priority support'],
    cta: 'Start free trial',
    popular: true,
  },
  {
    name: 'Multi-School',
    price: '$89',
    features: ['Up to 5 locations', 'Staff accounts', 'Custom booking domain', 'Consolidated reporting'],
    cta: 'Start free trial',
  },
];

const questions = [
  ['help', 'Can I switch plans?', 'Yes, anytime. Your billing will be adjusted pro-rata automatically. No penalties for upgrading or downgrading.'],
  ['contract', 'Is there a contract?', 'No. SurfDesk is month-to-month, and you can cancel at any time from your dashboard.'],
  ['calendar_month', 'What counts as a booking?', 'Any confirmed student session created through your booking page or manually entered by staff. Pending or cancelled bookings do not count.'],
];

export default function Pricing() {
  return (
    <>
      <Head><title>Pricing | SurfDesk</title><meta name="description" content="Simple pricing for surf schools." /></Head>
      <main className="pricing-page">
      <header className="pricing-hero">
        <h1>Simple pricing for surf schools</h1>
        <p>Start free, upgrade when you&apos;re ready. No contracts.</p>
      </header>

      <section className="pricing-grid" aria-label="Pricing plans">
        {plans.map((plan) => (
          <article className={`price-card${plan.popular ? ' price-card--popular' : ''}`} key={plan.name}>
            {plan.popular ? <span className="popular-label">Most popular</span> : null}
            <div>
              <h2>{plan.name}</h2>
              <strong>{plan.price}</strong><small>/month</small>
            </div>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}><span className="material-symbols-outlined" aria-hidden="true">check_circle</span>{feature}</li>
              ))}
            </ul>
            <Link className={plan.popular ? 'pill-button' : 'outline-pill'} href="/signup">{plan.cta}</Link>
          </article>
        ))}
      </section>
      <p className="pricing-note">All paid plans include a 14-day free trial. No credit card required.</p>

      <section className="pricing-faq">
        <h2>Common Questions</h2>
        <div>
          {questions.map(([icon, title, answer]) => (
            <article key={title}>
              <span className="material-symbols-outlined" aria-hidden="true">{icon}</span>
              <div><h3>{title}</h3><p>{answer}</p></div>
            </article>
          ))}
        </div>
      </section>

      <MarketingFooter />
      </main>
    </>
  );
}
