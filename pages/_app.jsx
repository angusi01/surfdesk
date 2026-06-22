import '../styles/globals.css';
import posthog from 'posthog-js';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { CookieConsent } from '../components/CookieConsent';
import { Layout } from '../components/layout/Layout';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        opt_out_capturing_by_default: true,
      });
    }
    const handleRouteChange = (url) => {
      if (posthog.__loaded) posthog.capture('$pageview', { $current_url: url });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
      <Layout>
        <Component {...pageProps} />
        <CookieConsent />
      </Layout>
    </SessionContextProvider>
  );
}
