import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBrowserSupabase } from '../lib/supabaseClient';
import { slugify } from '../lib/api-helpers';

const schema = z.object({
  name: z.string().min(1, 'Enter your school name.'),
  slug: z.string().min(1, 'Choose a URL for your booking page.').regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens.'),
  owner_name: z.string().min(1, 'Enter your name.'),
  contact_email: z.string().email('Enter a valid email address.'),
  phone: z.string().optional(),
  location: z.string().min(1, 'Enter your location.'),
  description: z.string().optional(),
});

export default function Onboarding() {
  const [status, setStatus] = useState('');
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });
  async function submit(values) {
    setStatus('');
    const supabase = createBrowserSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setStatus('Log in before creating your school.');
      return;
    }
    const { error } = await supabase.schema('surfdesk').from('schools').insert({ ...values, owner_id: user.id });
    if (error) {
      setStatus(error.code === '23505' ? 'This URL is already in use. Try another.' : error.message);
      return;
    }
    window.location.href = '/onboarding/plan';
  }
  return (
    <main className="page narrow">
      <form className="panel compact" onSubmit={handleSubmit(submit)}>
        <h1>Let's set up your surf school</h1>
        <p>This will take about 2 minutes.</p>
        {status && <p className="form-alert">{status}</p>}
        <label>School Name<input {...register('name')} onBlur={(event) => setValue('slug', slugify(event.target.value), { shouldValidate: true })}/></label>
        {errors.name && <p className="error-text">{errors.name.message}</p>}
        <label>Booking Page URL<span className="url-prefix">surfdesk.com.au/book/</span><input {...register('slug')}/></label>
        {errors.slug && <p className="error-text">{errors.slug.message}</p>}
        <label>Your Name<input {...register('owner_name')}/></label>
        <label>Contact Email<input type="email" {...register('contact_email')}/></label>
        <label>Phone Number<input {...register('phone')}/></label>
        <label>Location<input {...register('location')}/></label>
        <label>Description<textarea {...register('description')}/></label>
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create school'}</button>
      </form>
    </main>
  );
}
