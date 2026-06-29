import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = join(process.cwd());
const source = (path) => readFileSync(join(root, path), 'utf8');

describe('SurfDesk generator UI contract', () => {
  it('locks the light generator design system', () => {
    const css = source('styles/globals.css');

    expect(css).toContain('--ocean: #0ea5e9');
    expect(css).toContain('--page: #f8f9ff');
    expect(css).toContain('Inter, ui-sans-serif');
    expect(css).not.toContain('--page: #ffffff');
  });

  it('implements the approved generator homepage copy', () => {
    const home = source('pages/index.jsx');

    expect(home).toContain('Create your surf school booking page in');
    expect(home).toContain('No code, no login, no monthly fees.');
    expect(home).toContain('Built for speed, not management');
    expect(home).toContain('Ready to get your lessons booked?');
    expect(home).not.toContain('Take bookings for your surf school.');
    expect(home).not.toContain('Simple, transparent pricing');
  });

  it('provides the final setup wizard route and content', () => {
    const wizard = source('pages/generator/index.jsx');

    expect(wizard).toContain('Step 1 of 3: School Details');
    expect(wizard).toContain('Waiver Requirement');
    expect(wizard).toContain('Schools with clear cancellation policies');
    expect(wizard).toContain("window.location.href = '/generator/result'");
  });

  it('provides the final result page with preview and one-time upsell', () => {
    const result = source('pages/generator/result.jsx');

    expect(result).toContain('Your booking page is ready!');
    expect(result).toContain('Booking Page HTML/Link');
    expect(result).toContain('Confirmation Email Template');
    expect(result).toContain('Waiver & Policy Text');
    expect(result).toContain('Unlock full export & hosting for $19');
  });

  it('retires legacy saas entry routes through middleware redirects', () => {
    const middleware = source('middleware.js');

    expect(middleware).toContain("'/dashboard/:path*'");
    expect(middleware).toContain("'/login'");
    expect(middleware).toContain("'/signup'");
    expect(middleware).toContain("'/pricing'");
    expect(middleware).toContain("'/onboarding/:path*'");
    expect(middleware).toContain("new URL('/', req.url)");
    expect(middleware).not.toContain("createMiddlewareClient");
  });
});
