import Link from 'next/link';

export default function OnboardingPlan() {
  async function startTrial() {
    const response = await fetch('/api/create-checkout-session', { method: 'POST' });
    const json = await response.json();
    if (json.data?.url || json.url) window.location.href = json.data?.url ?? json.url;
  }
  return (
    <main className="page narrow">
      <section className="panel">
        <h1>Choose your plan</h1>
        <div className="plan-card">
          <strong>SurfDesk Pro</strong>
          <span>$39/month. 14-day free trial. Cancel anytime.</span>
        </div>
        <button type="button" onClick={startTrial}>Start Free Trial</button>
        <Link className="button-link secondary" href="/onboarding/first-session">Skip for now</Link>
      </section>
    </main>
  );
}
