import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getServiceSupabase } from '../../lib/supabaseClient';

export async function getServerSideProps({ params }) {
  const supabase = getServiceSupabase();
  const { slug } = params;

  const { data: school, error: schoolError } = await supabase
    .from('schools')
    .select('id, name, location, description, owner_name, subscription_status, slug')
    .eq('slug', slug)
    .single();

  if (schoolError || !school || school.subscription_status !== 'active') {
    return { notFound: true };
  }

  const today = new Date().toISOString().split('T')[0];
  const { data: sessions } = await supabase
    .from('sessions')
    .select('id, session_date, start_time, max_capacity, current_bookings')
    .eq('school_id', school.id)
    .gte('session_date', today)
    .order('session_date', { ascending: true })
    .order('start_time', { ascending: true });

  return { props: { school, sessions: sessions || [] } };
}

export default function BookingPage({ school, sessions }) {
  const [selectedSession, setSelectedSession] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', people: 1 });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!selectedSession) newErrors.slot = 'Please select a time slot.';
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid email is required.';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    setApiError('');
    const response = await fetch('/api/book', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        sessionId: selectedSession,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        participants: Number(formData.people),
        notes: '',
      }),
    });
    setSubmitting(false);
    if (response.ok) {
      setSubmitted(true);
    } else {
      const json = await response.json().catch(() => ({}));
      setApiError(response.status === 409 ? 'Sorry, this session just filled up. Please choose another.' : json.error ?? 'Could not create booking.');
    }
  };

  if (submitted) {
    const sess = sessions.find(s => s.id === selectedSession);
    const timeStr = sess ? sess.start_time.slice(0, 5) : '';
    return (
      <div className="min-h-screen bg-[#f7f2e9] flex items-center justify-center">
        <Head><title>Booking Confirmed | {school.name}</title></Head>
        <div className="panel" style={{ maxWidth: 560 }}>
          <p className="label text-green-600">BOOKING REQUEST SENT</p>
          <h1 className="heading">You&apos;re booked for {timeStr}</h1>
          <p className="subtext">Thanks, {formData.name}. {school.name} will confirm your lesson details by email shortly.</p>
          <div className="info-box mt-4">
            <p><strong>School:</strong> {school.name}</p>
            <p><strong>Instructor:</strong> {school.owner_name}</p>
            <p><strong>People:</strong> {formData.people}</p>
          </div>
          <Link href="/"><button className="btn-primary mt-6">Back to SurfDesk</button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f2e9]">
      <Head><title>Book a Lesson | {school.name}</title></Head>
      <nav className="surfdesk-nav"><span className="logo">SurfDesk</span><div><Link href="/login">Login</Link><Link href="/signup">Start Free Trial</Link></div></nav>
      <div className="booking-layout">
        <div className="school-info panel">
          <p className="label">SurfDesk</p>
          <p className="sublabel">STUDENT BOOKING</p>
          <h1 className="heading">{school.name}</h1>
          <p className="location">{school.location}</p>
          <p className="description">{school.description}</p>
          <div className="details-grid">
            <div className="detail-card"><p className="detail-label">Instructor</p><p className="detail-value">{school.owner_name}</p></div>
            <div className="detail-card"><p className="detail-label">Lesson length</p><p className="detail-value">90 minutes</p></div>
          </div>
        </div>
        <div className="booking-form panel">
          <h2 className="section-heading">Choose your lesson</h2>
          {sessions.length === 0 ? (
            <p className="text-gray-500">No upcoming sessions available. Check back soon.</p>
          ) : (
            <>
              <p className="label">AVAILABLE TIMES</p>
              <div className="time-slots">
                {sessions.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSession(s.id)}
                    className={`time-slot-btn${selectedSession === s.id ? ' selected' : ''}${s.current_bookings >= s.max_capacity ? ' full' : ''}`}
                    disabled={s.current_bookings >= s.max_capacity}
                  >
                    {s.start_time.slice(0, 5)}
                  </button>
                ))}
              </div>
              {errors.slot && <p className="error-text">{errors.slot}</p>}
            </>
          )}
          <form onSubmit={handleSubmit}>
            <label>Name<input name="name" value={formData.name} onChange={handleChange} required /></label>
            {errors.name && <p className="error-text">{errors.name}</p>}
            <label>Email<input type="email" name="email" value={formData.email} onChange={handleChange} required /></label>
            {errors.email && <p className="error-text">{errors.email}</p>}
            <label>Phone<input name="phone" value={formData.phone} onChange={handleChange} required /></label>
            {errors.phone && <p className="error-text">{errors.phone}</p>}
            <label>Number of People<input type="number" name="people" min="1" max="4" value={formData.people} onChange={handleChange} required /></label>
            {apiError && <p className="error-text">{apiError}</p>}
            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Booking Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
