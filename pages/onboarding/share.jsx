import Link from 'next/link';

export default function ShareBookingPage() {
  const bookingUrl = 'https://surfdesk.com.au/book/your-school';
  return (
    <main className="page narrow">
      <section className="panel">
        <h1>Share your booking page</h1>
        <p><code>{bookingUrl}</code></p>
        <p>Instagram bio snippet: Book surf lessons online: {bookingUrl}</p>
        <Link className="button-link" href="/book/your-school">Test Your Booking Page</Link>
        <Link className="button-link secondary" href="/dashboard">I'm done - take me to my dashboard</Link>
      </section>
    </main>
  );
}
