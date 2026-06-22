import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBrowserSupabase } from '../../lib/supabaseClient';

const schema = z.object({
    session_date: z.string().min(1, 'Choose a date'),
    start_time: z.string().min(1, 'Choose a start time'),
    end_time: z.string().min(1, 'Choose an end time'),
    max_capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1').max(50, 'Capacity must be 50 or fewer.'),
    session_type: z.string().min(1, 'Enter a session type'),
    price_cents: z.coerce.number().int().min(0).optional().default(0),
}).refine((values) => values.end_time > values.start_time, {
    message: 'End time must be after start time',
    path: ['end_time'],
});

export function SessionForm({ schoolId }) {
    const [status, setStatus] = useState('');
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { max_capacity: 8, session_type: 'Group Lesson', price_cents: 0 },
    });
    async function submit(values) {
        const supabase = createBrowserSupabase();
        let resolvedSchoolId = schoolId;
        if (!resolvedSchoolId) {
            const { data: { user } } = await supabase.auth.getUser();
            const { data: school } = user
                ? await supabase.schema('surfdesk').from('schools').select('id').eq('owner_id', user.id).maybeSingle()
                : { data: null };
            resolvedSchoolId = school?.id;
        }
        if (!resolvedSchoolId) {
            setStatus('Create your school first.');
            return;
        }
        const { error } = await supabase.schema('surfdesk').from('sessions').insert({
            school_id: resolvedSchoolId,
            session_date: values.session_date,
            start_time: values.start_time,
            end_time: values.end_time,
            max_capacity: values.max_capacity,
            session_type: values.session_type,
            price_cents: values.price_cents,
        });
        setStatus(error ? error.message : 'Session created.');
        if (!error) {
            reset({ session_date: '', start_time: '', end_time: '', max_capacity: 8, session_type: 'Group Lesson', price_cents: 0 });
        }
    }
    return (<form className="panel compact" onSubmit={handleSubmit(submit)}>
      <label>Date<input type="date" required {...register('session_date')}/></label>
      {errors.session_date && <p className="error-text">{errors.session_date.message}</p>}
      <label>Start<input type="time" required {...register('start_time')}/></label>
      {errors.start_time && <p className="error-text">{errors.start_time.message}</p>}
      <label>End<input type="time" required {...register('end_time')}/></label>
      {errors.end_time && <p className="error-text">{errors.end_time.message}</p>}
      <label>Session type<input required {...register('session_type')}/></label>
      {errors.session_type && <p className="error-text">{errors.session_type.message}</p>}
      <label>Price (cents)<input type="number" min="0" {...register('price_cents')}/></label>
      <label>Capacity<input type="number" min="1" required {...register('max_capacity')}/></label>
      {errors.max_capacity && <p className="error-text">{errors.max_capacity.message}</p>}
      <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create session'}</button>
      {status && <p>{status}</p>}
    </form>);
}
