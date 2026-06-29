import { useState } from 'react';
import { MarketingFooter } from '../../components/MarketingFooter';

const snippets = {
  html: `<div id="surfdesk-booking-widget" data-business="noosa-learn-to-surf">
  <!-- Generated UI Component -->
  <script src="https://cdn.surfdesk.io/widget.v1.js"></script>
</div>`,
  email: `Subject: Your Surf Lesson at Noosa is Confirmed!

Hi {{customer_name}},

Get ready to catch some waves! Your session is locked in for {{date}} at {{time}}. Please arrive 15 minutes early at Noosa Main Beach...`,
  policy: `Liability Release: By booking this session, the participant acknowledges that surfing is an inherently dangerous activity. Noosa Learn to Surf is not liable for personal injury...

Cancellation Policy: 24-hour notice required for full refund.`,
};

function CopyCard({ icon, title, content, onCopy }) {
  return (
    <section className="result-card">
      <div className="result-card__header">
        <div className="result-card__title">
          <span className="material-symbols-outlined" aria-hidden="true">{icon}</span>
          <h3>{title}</h3>
        </div>
        <button type="button" className="copy-button" onClick={onCopy}>
          <span className="material-symbols-outlined" aria-hidden="true">content_copy</span>
          Copy
        </button>
      </div>
      <pre>{content}</pre>
    </section>
  );
}

export default function GeneratorResultPage() {
  const [toastVisible, setToastVisible] = useState(false);

  async function copyContent(content) {
    await navigator.clipboard.writeText(content);
    setToastVisible(true);
    window.setTimeout(() => setToastVisible(false), 2000);
  }

  return (
    <>
      <main className="result-page">
        <section className="surface-section result-shell">
          <header className="result-hero">
            <div className="result-hero__badge">
              <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
            </div>
            <h1>Your booking page is ready!</h1>
            <p>
              We&apos;ve generated everything you need to start taking bookings for
              {' '}
              <strong>Noosa Learn to Surf</strong>.
            </p>
          </header>

          <div className="result-grid">
            <div className="result-artifacts">
              <CopyCard icon="code" title="Booking Page HTML/Link" content={snippets.html} onCopy={() => copyContent(snippets.html)} />
              <CopyCard icon="mail" title="Confirmation Email Template" content={snippets.email} onCopy={() => copyContent(snippets.email)} />
              <CopyCard icon="gavel" title="Waiver & Policy Text" content={snippets.policy} onCopy={() => copyContent(snippets.policy)} />
            </div>

            <div className="result-sidebar">
              <div className="phone-frame">
                <div className="phone-frame__notch" />
                <div className="phone-frame__screen">
                  <div className="phone-frame__browser">booking.surfdesk.io/noosa-surf</div>
                  <div className="phone-frame__brand">
                    <div className="phone-frame__logo">NS</div>
                    <div>
                      <strong>Noosa Learn to Surf</strong>
                      <p>Noosa Heads, QLD</p>
                    </div>
                  </div>
                  <section>
                    <h4>Available Sessions</h4>
                    <article className="phone-session phone-session--active">
                      <div>
                        <strong>Beginner Morning Session</strong>
                        <p>2 Hours • Equipment Included</p>
                      </div>
                      <span>$85</span>
                    </article>
                    <article className="phone-session phone-session--muted">
                      <div>
                        <strong>Sunset Group Class</strong>
                        <p>1.5 Hours • Group of 5</p>
                      </div>
                      <span>$60</span>
                    </article>
                  </section>
                  <section>
                    <h4>Booking Details</h4>
                    <div className="phone-form">
                      <div>
                        <label>First Name</label>
                        <span />
                      </div>
                      <div>
                        <label>Last Name</label>
                        <span />
                      </div>
                    </div>
                    <button type="button" className="phone-confirm">Confirm Booking</button>
                  </section>
                </div>
              </div>

              <section className="premium-card">
                <div className="premium-card__eyebrow">
                  <span className="material-symbols-outlined" aria-hidden="true">bolt</span>
                  Premium License
                </div>
                <h3>{'Unlock full export & hosting for $19'}</h3>
                <p>One-time payment for lifetime access. Includes professional custom domain and Stripe integration.</p>
                <ul>
                  <li>Custom SurfDesk.io domain</li>
                  <li>Stripe &amp; PayPal Integration</li>
                  <li>Remove &quot;Made with SurfDesk&quot;</li>
                </ul>
                <button type="button" className="pill-button pill-button--large">Pay once to unlock</button>
                <small>Secure 256-bit SSL</small>
              </section>
            </div>
          </div>
        </section>

        <div className={toastVisible ? 'toast toast--visible' : 'toast'} role="status" aria-live="polite">
          <span className="material-symbols-outlined" aria-hidden="true">done</span>
          Copied to clipboard
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
