import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = join(process.cwd());
const source = (path) => readFileSync(join(root, path), 'utf8');

describe('SurfDesk Stitch UI contract', () => {
  it('uses the locked white, Inter, and ocean-blue design system', () => {
    const css = source('styles/globals.css');

    expect(css).toContain('--ocean: #0ea5e9');
    expect(css).toContain('--page: #ffffff');
    expect(css).toContain('Inter, ui-sans-serif');
  });

  it('implements the approved homepage content', () => {
    const home = source('pages/index.jsx');

    expect(home).toContain('Take bookings for your surf school.');
    expect(home).toContain('Online Bookings');
    expect(home).toContain('Session Management');
    expect(home).toContain('Automated Emails');
    expect(home).not.toContain('Your surf school, booked solid.');
  });

  it('provides a dedicated pricing screen with the three approved plans', () => {
    const pricing = source('pages/pricing.jsx');

    expect(pricing).toContain('Simple pricing for surf schools');
    expect(pricing).toContain("price: '$0'");
    expect(pricing).toContain("price: '$39'");
    expect(pricing).toContain("price: '$89'");
    expect(pricing).toContain('Common Questions');
  });

  it('keeps login behavior while using the approved screen copy', () => {
    const login = source('pages/login.jsx');

    expect(login).toContain('Log in to your account');
    expect(login).toContain('Create a free account');
    expect(login).toContain('signInWithPassword');
  });

  it('keeps live booking submission and renders selectable session cards', () => {
    const booking = source('components/Public/BookingForm.jsx');

    expect(booking).toContain("fetch('/api/book'");
    expect(booking).toContain('Book Now');
    expect(booking).toContain('Confirm booking');
    expect(booking).toContain('Powered by SurfDesk');
  });

  it('keeps server-side dashboard data and shows the approved overview sections', () => {
    const dashboard = source('pages/dashboard/index.jsx');

    expect(dashboard).toContain('createPagesServerClient');
    expect(dashboard).toContain("Today's Bookings");
    expect(dashboard).toContain('This Week');
    expect(dashboard).toContain('Revenue MTD');
    expect(dashboard).toContain('Upcoming Sessions');
    expect(dashboard).toContain('Recent Bookings');
  });
});
