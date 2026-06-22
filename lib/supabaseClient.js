import { createPagesBrowserClient, createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
export function createBrowserSupabase() {
    return createPagesBrowserClient();
}
export function createServerSupabase(ctx) {
    return createPagesServerClient(ctx, { options: { db: { schema: 'surfdesk' } } });
}
export function getServiceSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key)
        throw new Error('Supabase service credentials are not configured');
    return createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
        db: { schema: 'surfdesk' },
    });
}
