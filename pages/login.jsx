import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBrowserSupabase } from '../lib/supabaseClient';

const schema = z.object({
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export default function Login() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values) {
    setServerError('');
    const supabase = createBrowserSupabase();
    const { error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      setServerError(error.message === 'Invalid login credentials' ? 'Email or password is incorrect.' : error.message);
      return;
    }
    router.push('/dashboard');
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
        <h1>Log in</h1>
        {serverError && <div className="form-alert">{serverError}</div>}
        <label>Email
          <input type="email" autoComplete="email" {...register('email')} />
          {errors.email && <span className="error-text">{errors.email.message}</span>}
        </label>
        <div className="field-row">
          <span>Password</span>
          <Link href="/forgot-password">Forgot password?</Link>
        </div>
        <label>
          <input type="password" autoComplete="current-password" {...register('password')} />
          {errors.password && <span className="error-text">{errors.password.message}</span>}
        </label>
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Log in'}</button>
        <p>Don&apos;t have an account? <Link href="/signup">Sign up</Link></p>
      </form>
    </main>
  );
}
