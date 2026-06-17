import { FormEvent, useState } from 'react';
import { createBrowserSupabase } from '../../lib/supabaseClient';

export function SessionForm({ schoolId }: { schoolId: string }) {
  const [status, setStatus] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const supabase = createBrowserSupabase();
    const { error } = await supabase.schema('surfdesk').from('sessions').insert({
      school_id: schoolId,
      session_date: data.get('session_date'),
      start_time: data.get('start_time'),
      end_time: data.get('end_time'),
      max_capacity: Number(data.get('max_capacity')),
    });
    setStatus(error ? error.message : 'Session created.');
  }
  return (
    <form className="panel compact" onSubmit={submit}>
      <label>Date<input type="date" name="session_date" required /></label>
      <label>Start<input type="time" name="start_time" required /></label>
      <label>End<input type="time" name="end_time" required /></label>
      <label>Capacity<input type="number" name="max_capacity" min="1" defaultValue="8" required /></label>
      <button type="submit">Create session</button>
      {status && <p>{status}</p>}
    </form>
  );
}
