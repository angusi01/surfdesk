import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import posthog from 'posthog-js';

const schema = z.object({
  sessionId: z.string().min(1, 'Choose a session'),
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().regex(/^(\+?61|0)4\d{8}$/, 'Enter an Australian mobile number'),
  participants: z.coerce.number().int().min(1, 'Select at least 1 participant.').max(4, 'Bookings are limited to 4 participants.'),
  notes: z.string().max(1000).optional(),
});

const dateFormatter = new Intl.DateTimeFormat('en-AU', { weekday: 'short', day: 'numeric', month: 'long' });
const timeFormatter = new Intl.DateTimeFormat('en-AU', { hour: 'numeric', minute: '2-digit' });

function sessionDate(session) {
  return dateFormatter.format(new Date(`${session.session_date}T00:00:00`));
}

function sessionTime(session) {
  const [hours, minutes] = session.start_time.slice(0, 5).split(':').map(Number);
  return timeFormatter.format(new Date(2026, 0, 1, hours, minutes));
}

function sessionTitle(session) {
  return session.session_type || 'Group Lesson';
}

function SessionCard({ session, active, onSelect }) {
  const spots = session.max_capacity - session.current_bookings;
  return (
    <article className={`booking-session${active ? ' booking-session--active' : ''}`}>
      <div>
        <h2><span className="material-symbols-outlined" aria-hidden="true">surfing</span>{sessionTitle(session)}</h2>
        <div className="booking-session__meta">
          <span><span className="material-symbols-outlined" aria-hidden="true">calendar_today</span>{sessionDate(session)}, {sessionTime(session)}</span>
          <span className={spots <= 2 ? 'booking-session__limited' : ''}><span className="material-symbols-outlined" aria-hidden="true">person</span>{spots} {spots === 1 ? 'spot' : 'spots'} left</span>
          {session.price_cents ? <strong>${(session.price_cents / 100).toFixed(0)}/person</strong> : null}
        </div>
      </div>
      <button className="pill-button pill-button--small" type="button" onClick={() => onSelect(session.id)}>{active ? 'Selected' : 'Book Now'}</button>
    </article>
  );
}

export function BookingForm({ sessions }) {
  const [status, setStatus] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState(sessions[0]?.id ?? '');
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { sessionId: sessions[0]?.id ?? '', participants: 1, notes: '' },
  });
  const selectedSession = sessions.find((session) => session.id === selectedSessionId) ?? sessions[0];

  function selectSession(sessionId) {
    setSelectedSessionId(sessionId);
    setValue('sessionId', sessionId, { shouldValidate: true });
    setStatus('');
  }

  async function submit(values) {
    setStatus('');
    const response = await fetch('/api/book', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (response.ok) {
      posthog.capture('booking_created', { product: 'surfdesk' });
      setStatus("You're booked! Check your email.");
    } else {
      const json = await response.json().catch(() => ({}));
      setStatus(response.status === 409 ? 'Sorry, this session just filled up. Please choose another.' : json.error ?? 'Could not create booking.');
    }
  }

  return (
    <div className="booking-flow">
      <div className="booking-sessions">
        {sessions.map((session, index) => (
          <div key={session.id}>
            <SessionCard session={session} active={session.id === selectedSessionId} onSelect={selectSession} />
            {index === 0 && selectedSession ? (
              <form className="booking-form" onSubmit={handleSubmit(submit)}>
                <header>
                  <h2>Booking: {sessionTitle(selectedSession)} — {sessionDate(selectedSession)}</h2>
                </header>
                <input type="hidden" {...register('sessionId')} />
                {errors.sessionId ? <p className="error-text">{errors.sessionId.message}</p> : null}
                <div className="booking-form__grid">
                  <label>Name<input required placeholder="Jane Smith" {...register('name')} /></label>
                  <label>Email<input type="email" required placeholder="jane@example.com" {...register('email')} /></label>
                  <label>Phone<input pattern="^(\+?61|0)4\d{8}$" placeholder="04xxxxxxxx" required {...register('phone')} /></label>
                  <label>Number of participants<input type="number" min="1" max="4" required {...register('participants')} /></label>
                </div>
                {errors.name ? <p className="error-text">{errors.name.message}</p> : null}
                {errors.email ? <p className="error-text">{errors.email.message}</p> : null}
                {errors.phone ? <p className="error-text">{errors.phone.message}</p> : null}
                {errors.participants ? <p className="error-text">{errors.participants.message}</p> : null}
                <label>Any notes for your instructor?<textarea placeholder="Tell us about your previous experience or any health concerns..." {...register('notes')} /></label>
                <div className="booking-form__actions">
                  <button className="pill-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Confirming...' : 'Confirm booking'}</button>
                  <p>You&apos;ll receive a confirmation email shortly.</p>
                </div>
                {status ? <p className={status.startsWith("You're") ? 'booking-confirmation' : 'error-text'}>{status}</p> : null}
              </form>
            ) : null}
          </div>
        ))}
      </div>
      <footer className="powered-by">Powered by SurfDesk</footer>
    </div>
  );
}
