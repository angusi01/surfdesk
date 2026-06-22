import Link from 'next/link';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: '14-day trial',
    description: 'Try everything free. No card required.',
    features: ['1 surf school', 'Online booking page', 'Session management', 'Email confirmations'],
    cta: 'Start Free Trial',
    href: '/signup',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$39',
    period: '/month',
    description: 'Everything you need to run a busy surf school.',
    features: ['Unlimited sessions', 'Online booking page', 'Automated reminders & follow-ups', 'Waitlist management', 'Revenue reporting', 'Priority support'],
    cta: 'Start 14-Day Free Trial',
    href: '/signup',
    highlight: true,
  },
  {
    name: 'Multi-School',
    price: '$89',
    period: '/month',
    description: 'Manage multiple locations from one dashboard.',
    features: ['Everything in Pro', 'Up to 5 school locations', 'Staff accounts', 'Consolidated reporting', 'Custom booking domain'],
    cta: 'Start 14-Day Free Trial',
    href: '/signup',
    highlight: false,
  },
];

const testimonials = [
  {
    quote: 'Stopped taking bookings through Instagram DMs the day I signed up. Best $39 I spend each month.',
    name: 'Mitch R.',
    school: 'Noosa Learn to Surf',
  },
  {
    quote: 'My students get automatic reminders now. No-shows dropped by half in the first month.',
    name: 'Jade K.',
    school: 'Coolangatta Surf School',
  },
  {
    quote: 'Set up my booking page in 20 minutes and put the link straight in my Instagram bio. Done.',
    name: 'Tom V.',
    school: 'Manly Beach Surf Co.',
  },
];

export default function Home() {
  return (
    <main className="page">
      {/* Hero */}
      <section className="hero">
        <div>
          <h1>Run your surf school from your pocket</h1>
          <p>Manage sessions, take bookings online, and spend less time on Instagram DMs. Built for surf schools on the Australian coast.</p>
          <div style={{display:'flex', gap:'12px', flexWrap:'wrap', marginTop:'24px'}}>
            <Link className="button-link" href="/signup">Start Free Trial</Link>
            <Link className="button-link" href="/book/bondi-surf" style={{background:'transparent', border:'2px solid currentColor', color:'inherit'}}>See a live booking page</Link>
          </div>
          <p style={{marginTop:'16px', fontSize:'0.85rem', opacity:0.6}}>No credit card required. 14-day free trial on all paid plans.</p>
        </div>
        <div className="wave-panel" style={{padding:'32px'}}>
          <p style={{fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.1em', opacity:0.5, marginBottom:'8px'}}>Built for schools like</p>
          <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
            {['Bondi Surf School', 'Noosa Learn to Surf', 'Manly Beach Surf Co.', 'Coolangatta Surf School', 'Byron Bay Surf'].map(s => (
              <span key={s} style={{fontSize:'0.95rem', borderBottom:'1px solid rgba(0,0,0,0.08)', paddingBottom:'8px'}}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="quick-actions">
        <article className="quick-card"><strong>Online Bookings</strong><span>No DMs, no phone tag, no double bookings. Students book themselves.</span></article>
        <article className="quick-card"><strong>Session Management</strong><span>Create recurring sessions, set capacities, and see tomorrow at a glance.</span></article>
        <article className="quick-card"><strong>Automated Emails</strong><span>Confirmations, reminders, and follow-ups sent automatically.</span></article>
        <article className="quick-card"><strong>Your Own Booking Page</strong><span>A clean mobile-friendly booking page for your Instagram bio.</span></article>
        <article className="quick-card"><strong>Waitlist Management</strong><span>Full sessions fill a waitlist. Students get notified when a spot opens.</span></article>
        <article className="quick-card"><strong>Revenue Reporting</strong><span>See what you earned this week, this month, and this season at a glance.</span></article>
      </section>

      {/* Pricing */}
      <section style={{padding:'64px 24px', background:'#f9f7f4'}}>
        <h2 style={{textAlign:'center', fontSize:'2rem', marginBottom:'8px'}}>Simple, honest pricing</h2>
        <p style={{textAlign:'center', opacity:0.6, marginBottom:'48px'}}>14-day free trial on all paid plans. Cancel any time.</p>
        <div className="pricing-panel">
          {plans.map(plan => (
            <article
              key={plan.name}
              className="group relative grid gap-4 border border-[var(--line)] bg-white p-5 font-black transition-transform hover:scale-[1.02]"
              style={plan.highlight ? {borderColor:'#e05', boxShadow:'0 4px 24px rgba(220,0,80,0.12)'} : {}}
            >
              {plan.highlight && (
                <span className="absolute right-3 top-3 rounded-full bg-yellow-400 px-3 py-1 text-sm text-yellow-900">
                  Most Popular
                </span>
              )}
              <div>
                <p style={{fontSize:'0.8rem', textTransform:'uppercase', letterSpacing:'0.08em', opacity:0.5, marginBottom:'4px'}}>{plan.name}</p>
                <p style={{fontSize:'2.2rem', fontWeight:700, lineHeight:1}}>
                  {plan.price}<span style={{fontSize:'1rem', fontWeight:400, opacity:0.6}}>{plan.period}</span>
                </p>
                <p style={{fontSize:'0.9rem', marginTop:'8px', opacity:0.7}}>{plan.description}</p>
              </div>
              <ul style={{listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:'6px'}}>
                {plan.features.map(f => (
                  <li key={f} style={{fontSize:'0.88rem', display:'flex', alignItems:'center', gap:'8px'}}>
                    <span style={{color:'#22c55e', fontWeight:700}}>{String.fromCharCode(10003)}</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                className="button-link m-0 justify-self-start"
                href={plan.href}
                style={plan.highlight ? {} : {background:'transparent', border:'2px solid #222', color:'#222'}}
              >
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{padding:'64px 24px', maxWidth:'960px', margin:'0 auto'}}>
        <h2 style={{textAlign:'center', fontSize:'1.8rem', marginBottom:'48px'}}>Surf schools love it</h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:'24px'}}>
          {testimonials.map(t => (
            <blockquote key={t.name} style={{margin:0, background:'#f9f7f4', borderRadius:'12px', padding:'24px', borderLeft:'4px solid #e05'}}>
              <p style={{fontStyle:'italic', marginBottom:'16px', lineHeight:1.6}}>&ldquo;{t.quote}&rdquo;</p>
              <footer style={{fontSize:'0.85rem', opacity:0.7}}>
                <strong>{t.name}</strong> &mdash; {t.school}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{borderTop:'1px solid rgba(0,0,0,0.08)', padding:'32px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'16px', fontSize:'0.85rem', opacity:0.6}}>
        <span>&copy; 2026 SurfDesk. Built on the Sunshine Coast.</span>
        <div style={{display:'flex', gap:'24px'}}>
          <Link href="/privacy">Privacy</Link>
          <a href="mailto:hello@surfdesk.app">Contact</a>
        </div>
      </footer>
    </main>
  );
}
