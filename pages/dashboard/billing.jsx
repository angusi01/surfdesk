import { useState } from 'react';
export default function Billing() {
    const [status, setStatus] = useState('');
    async function subscribe() {
        setStatus('Opening Stripe...');
        const response = await fetch('/api/create-checkout-session', { method: 'POST' });
        const data = await response.json();
        if (data.data?.url || data.url)
            window.location.href = data.data?.url ?? data.url;
        else
            setStatus('Billing is not configured.');
    }
    return (<main className="page">
      <h1>Billing</h1>
      <section className="panel">
        <p>SurfDesk Pro is $39/month per school. Your free trial lasts 14 days.</p>
        <button type="button" onClick={subscribe}>Subscribe</button>
        <button type="button" onClick={subscribe}>Manage Payment Method</button>
        {status && <p>{status}</p>}
      </section>
    </main>);
}
