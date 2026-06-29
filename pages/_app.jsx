import '../styles/globals.css';
import Head from 'next/head';
import posthog from 'posthog-js';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { CookieConsent } from '../components/CookieConsent';
import { Layout } from '../components/layout/Layout';

const PAGE_TITLES = {
  '/': 'SurfDesk | Generate Your Booking Page',
  '/generator': 'SurfDesk | Booking Page Generator',
  '/generator/result': 'SurfDesk | Your Booking Page Is Ready',
  '/privacy': 'Privacy | SurfDesk',
};

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const standalonePage = router.pathname.startsWith('/book/');
  const pageTitle = router.pathname.startsWith('/book/')
    ? `Book a lesson | ${pageProps.school?.name ?? 'SurfDesk'}`
    : PAGE_TITLES[router.pathname] ?? 'SurfDesk';

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
      <Head><title key="title">{pageTitle}</title></Head>
      {standalonePage ? <Component {...pageProps} /> : <Layout><Component {...pageProps} /></Layout>}
      {!router.pathname.startsWith('/book/') ? <CookieConsent /> : null}
    </SessionContextProvider>
  );
}
