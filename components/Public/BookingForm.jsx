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

export function BookingForm({ sessions }) {
    const [status, setStatus] = useState('');
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { sessionId: sessions[0]?.id ?? '', participants: 1, notes: '' },
    });
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
        }
        else {
            const json = await response.json().catch(() => ({}));
            setStatus(response.status === 409 ? 'Sorry, this session just filled up. Please choose another.' : json.error ?? 'Could not create booking.');
        }
    }
    return (<form className="panel" onSubmit={handleSubmit(submit)}>
      <label>Session
        <select required {...register('sessionId')}>
          {sessions.map((session) => (<option key={session.id} value={session.id}>
              {session.session_date} {session.start_time.slice(0, 5)} ({session.max_capacity - session.current_bookings} spots)
            </option>))}
        </select>
      </label>
      {errors.sessionId && <p className="error-text">{errors.sessionId.message}</p>}
      <label>Name<input required {...register('name')}/></label>
      {errors.name && <p className="error-text">{errors.name.message}</p>}
      <label>Email<input type="email" required {...register('email')}/></label>
      {errors.email && <p className="error-text">{errors.email.message}</p>}
      <label>Phone<input pattern="^(\\+?61|0)4\\d{8}$" placeholder="04xxxxxxxx" required {...register('phone')}/></label>
      {errors.phone && <p className="error-text">{errors.phone.message}</p>}
      <label>Number of Participants<input type="number" min="1" max="4" required {...register('participants')}/></label>
      {errors.participants && <p className="error-text">{errors.participants.message}</p>}
      <label>Notes<textarea placeholder="Anything we should know?" {...register('notes')}/></label>
      <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Confirming...' : 'Confirm Booking'}</button>
      {status && <p className={status.startsWith("You're") ? 'booking-confirmation' : 'error-text'}>{status}</p>}
    </form>);
}
