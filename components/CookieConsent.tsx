import posthog from 'posthog-js';
import { useEffect, useState } from 'react';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(window.localStorage.getItem('analytics-consent') !== 'yes'), []);
  if (!visible) return null;
  return (
    <div className="cookie-banner">
      <span>We use analytics after consent.</span>
      <button type="button" onClick={() => {
        window.localStorage.setItem('analytics-consent', 'yes');
        posthog.opt_in_capturing();
        setVisible(false);
      }}>Accept</button>
    </div>
  );
}
