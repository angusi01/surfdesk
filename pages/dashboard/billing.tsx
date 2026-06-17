import { useState } from 'react';

export default function Billing() {
  const [status, setStatus] = useState('');
  async function subscribe() {
    setStatus('Opening Stripe...');
    const response = await fetch('/api/create-checkout-session', { method: 'POST' });
    const data = await response.json();
    if (data.url) window.location.href = data.url;
    else setStatus('Billing is not configured.');
  }
  return (
    <main className="page">
      <h1>Billing</h1>
      <section className="panel">
        <p>SurfDesk is $39 per month.</p>
        <button type="button" onClick={subscribe}>Subscribe</button>
        {status && <p>{status}</p>}
      </section>
    </main>
  );
}
