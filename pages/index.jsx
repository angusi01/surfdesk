import Head from 'next/head';
import Link from 'next/link';
import { MarketingFooter } from '../components/MarketingFooter';

const features = [
  {
    icon: 'rocket_launch',
    title: 'One-time generation',
    copy: 'No accounts to manage or passwords to remember. Generate once, host it wherever you like, or use our simple hosting.',
  },
  {
    icon: 'description',
    title: 'Ready-to-use copy',
    copy: 'We generate your confirmation emails, liability waivers, and FAQ sections based on your specific school details.',
  },
  {
    icon: 'location_on',
    title: 'Niche-specific',
    copy: 'Specifically designed for Australian surf schools. We know the local terminology, beach safety requirements, and booking flows.',
  },
];

export default function Home() {
  return (
    <>
      <Head><meta name="description" content="Generate a professional surf school booking page in five minutes." /></Head>
      <main className="generator-homepage">
        <section className="generator-hero surface-section">
          <div className="generator-hero__copy">
            <div className="eyebrow-badge">
              <span className="material-symbols-outlined" aria-hidden="true">verified</span>
              Built for Australian Surf Schools
            </div>
            <h1>Create your surf school booking page in <span>5 minutes.</span></h1>
            <p>No code, no login, no monthly fees. Answer 10 questions and get a professional booking page ready to publish.</p>
            <div className="generator-hero__actions">
              <Link href="/generator" className="pill-button">
                Start for free
                <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
              </Link>
              <Link href="/generator/result" className="outline-pill">See example output</Link>
            </div>
            <div className="generator-proof">
              <div className="generator-proof__avatars" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <p>Used by 50+ Australian surf coaches</p>
            </div>
          </div>
          <div className="generator-hero__visual">
            <div className="browser-card">
              <div className="browser-card__chrome">
                <span />
                <span />
                <span />
                <div className="browser-card__address" />
              </div>
              <div className="browser-card__content">
                <div className="browser-card__row browser-card__row--header">
                  <div className="browser-card__brand" />
                  <div className="browser-card__nav">
                    <span />
                    <span />
                  </div>
                </div>
                <div className="browser-card__title" />
                <div className="browser-card__copy" />
                <div className="browser-card__copy browser-card__copy--short" />
                <div className="browser-card__grid">
                  <div className="browser-card__photo" />
                  <div className="browser-card__stack">
                    <div className="browser-card__panel" />
                    <div className="browser-card__panel browser-card__panel--muted" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="surface-section generator-features" id="features" aria-label="Generator features">
          <div className="section-intro">
            <h2>Built for speed, not management</h2>
            <p>Everything you need to accept bookings today, without the SaaS bloat.</p>
          </div>
          <div className="generator-feature-grid">
            {features.map((feature) => (
              <article className="generator-feature-card" key={feature.title}>
                <div className="generator-feature-card__icon">
                  <span className="material-symbols-outlined" aria-hidden="true">{feature.icon}</span>
                </div>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="surface-section generator-process" id="process">
          <div className="generator-process__panel">
            <div className="generator-process__copy">
              <h2>Answer 10 questions. Get your business online.</h2>
              <ol>
                <li><span>1</span><p>Tell us about your lesson packages and pricing.</p></li>
                <li><span>2</span><p>Define your availability and beach locations.</p></li>
                <li><span>3</span><p>Hit generate and receive your custom booking URL.</p></li>
              </ol>
              <Link href="/generator" className="pill-button">Start Generating Now</Link>
            </div>
            <div className="generator-process__mockups" aria-hidden="true">
              {[0, 1, 2, 3].map((item) => (
                <div className={`generator-process__mockup${item % 2 ? ' generator-process__mockup--offset' : ''}`} key={item}>
                  <span />
                  <div />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="surface-section generator-trust">
          <h2>Professional Australian Surf Locations</h2>
          <div className="generator-trust__grid" aria-label="Australian surf locations">
            {['Bondi Beach', 'Byron Bay', 'Noosa Heads', 'Manly Beach', 'Torquay'].map((location) => (
              <div className="generator-trust__item" key={location}>
                <span className="material-symbols-outlined" aria-hidden="true">waves</span>
                <span>{location}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-section generator-cta">
          <div className="generator-cta__inner">
            <h2>Ready to get your lessons booked?</h2>
            <p>The fastest way for Australian surf schools to get online. One-time generation. No credit card required.</p>
            <Link href="/generator" className="pill-button pill-button--large">Start for free</Link>
            <small>Takes less than 5 minutes</small>
          </div>
        </section>

        <MarketingFooter />
      </main>
    </>
  );
}
