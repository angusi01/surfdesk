import { FormEvent, useState } from 'react';
import posthog from 'posthog-js';

type Session = {
  id: string;
  session_date: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  current_bookings: number;
};

export function BookingForm({ sessions }: { sessions: Session[] }) {
  const [status, setStatus] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const response = await fetch('/api/book', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        sessionId: data.get('sessionId'),
        name: data.get('name'),
        email: data.get('email'),
        phone: data.get('phone'),
      }),
    });
    if (response.ok) {
      posthog.capture('booking_created', { product: 'surfdesk' });
      setStatus('Booking confirmed.');
    } else {
      setStatus('Could not create booking.');
    }
  }

  return (
    <form className="panel" onSubmit={submit}>
      <label>Session
        <select name="sessionId" required>
          {sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.session_date} {session.start_time.slice(0, 5)} ({session.max_capacity - session.current_bookings} spots)
            </option>
          ))}
        </select>
      </label>
      <label>Name<input name="name" required /></label>
      <label>Email<input name="email" type="email" required /></label>
      <label>Phone<input name="phone" /></label>
      <button type="submit">Book lesson</button>
      {status && <p>{status}</p>}
    </form>
  );
}
