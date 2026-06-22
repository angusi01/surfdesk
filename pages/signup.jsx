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
  confirmPassword: z.string().min(6, 'Confirm your password.'),
}).refine((values) => values.password === values.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords must match.',
});

export default function Signup() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values) {
    setServerError('');
    const supabase = createBrowserSupabase();
    const origin = typeof window === 'undefined' ? '' : window.location.origin;
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { emailRedirectTo: `${origin}/onboarding` },
    });
    if (error) {
      setServerError(error.message.toLowerCase().includes('registered') ? 'An account already exists for this email.' : error.message);
      return;
    }
    if (data.session) {
      router.push('/onboarding');
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <main className="signup-split">
        <section className="signup-brand">
          <h1>Run your surf school from anywhere</h1>
          <div><strong>Online bookings</strong><span>Let students reserve sessions without back-and-forth messages.</span></div>
          <div><strong>Session management</strong><span>Plan capacity, times, and availability from one dashboard.</span></div>
          <div><strong>Automated emails</strong><span>Send booking confirmations and updates from your school workflow.</span></div>
        </section>
        <section className="auth-card">
          <div className="mail-icon">✉</div>
          <h1>Check your email</h1>
          <p>We sent a confirmation link.</p>
          <button type="button" onClick={() => { reset(); setSent(false); }}>Try again</button>
        </section>
      </main>
    );
  }

  return (
    <main className="signup-split">
      <section className="signup-brand">
        <h1>Run your surf school from anywhere</h1>
        <div><strong>Online bookings</strong><span>Let students reserve sessions without back-and-forth messages.</span></div>
        <div><strong>Session management</strong><span>Plan capacity, times, and availability from one dashboard.</span></div>
        <div><strong>Automated emails</strong><span>Send booking confirmations and updates from your school workflow.</span></div>
      </section>
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
        <h1>Create account</h1>
        {serverError && <div className="form-alert">{serverError}</div>}
        <label>Email
          <input type="email" autoComplete="email" {...register('email')} />
          {errors.email && <span className="error-text">{errors.email.message}</span>}
        </label>
        <label>Password
          <input type="password" autoComplete="new-password" {...register('password')} />
          {errors.password && <span className="error-text">{errors.password.message}</span>}
        </label>
        <label>Confirm password
          <input type="password" autoComplete="new-password" {...register('confirmPassword')} />
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword.message}</span>}
        </label>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="inline-flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin text-[#ff6b6b]" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
              Creating account...
            </span>
          ) : 'Sign up'}
        </button>
        <p>Already have an account? <Link href="/login">Log in</Link></p>
        <small>By signing up you agree to our <Link href="#">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.</small>
      </form>
    </main>
  );
}
