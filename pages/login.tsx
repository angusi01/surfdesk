import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import type { GetServerSideProps } from 'next';
import { createBrowserSupabase } from '../lib/supabaseClient';

export default function Login() {
  const supabase = createBrowserSupabase();
  return (
    <main className="page narrow">
      <h1>Log in</h1>
      <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/dashboard`} />
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => ({ props: {} });
