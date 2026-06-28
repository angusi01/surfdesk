import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBrowserSupabase } from '../lib/supabaseClient';
import { Brand } from '../components/Brand';
import { MarketingFooter } from '../components/MarketingFooter';

const schema = z.object({
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export default function Login() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <>
      <Head><title>Log in | SurfDesk</title></Head>
      <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
        <Brand />
        <h1>Log in to your account</h1>
        {serverError && <div className="form-alert">{serverError}</div>}
        <label>Email address
          <input type="email" autoComplete="email" placeholder="name@company.com" {...register('email')} />
          {errors.email && <span className="error-text">{errors.email.message}</span>}
        </label>
        <label>Password
          <span className="password-field">
            <input type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••" {...register('password')} />
            <button type="button" className="password-field__toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
              <span className="material-symbols-outlined" aria-hidden="true">{showPassword ? 'visibility_off' : 'visibility'}</span>
            </button>
          </span>
          {errors.password && <span className="error-text">{errors.password.message}</span>}
        </label>
        <Link className="auth-card__forgot" href="/forgot-password">Forgot password?</Link>
        <button className="pill-button auth-card__submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Log in'}</button>
        <div className="auth-card__divider"><span>or</span></div>
        <Link className="auth-card__signup" href="/signup">Create a free account</Link>
      </form>
      <MarketingFooter />
      </main>
    </>
  );
}
