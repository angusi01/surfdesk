import type { AppProps } from 'next/app';
import posthog from 'posthog-js';
import { useEffect } from 'react';
import { CookieConsent } from '../components/CookieConsent';
import { Layout } from '../components/Layout';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        opt_out_capturing_by_default: true,
      });
    }
  }, []);
  return (
    <Layout>
      <Component {...pageProps} />
      <CookieConsent />
    </Layout>
  );
}
