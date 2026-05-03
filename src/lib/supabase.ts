import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ─── Connection reuse across serverless invocations ───────────────────────────
// On Vercel, Node.js module cache persists between requests on the SAME instance.
// By storing the client on globalThis, we reuse the same TCP connection instead
// of opening a new one on every request (which costs 2–5 seconds each time).

declare global {
  // eslint-disable-next-line no-var
  var _supabaseClient: SupabaseClient | undefined;
  // eslint-disable-next-line no-var
  var _supabaseAdmin: SupabaseClient | undefined;
}

export const supabase: SupabaseClient = (() => {
  if (globalThis._supabaseClient) return globalThis._supabaseClient;
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    // Use a persistent fetch with keep-alive so TCP connections are reused
    global: {
      fetch: (url, options = {}) =>
        fetch(url, {
          ...options,
          // @ts-expect-error — Node 18+ supports this
          keepalive: true,
        }),
    },
  });
  globalThis._supabaseClient = client;
  return client;
})();

// Admin client (server-side only)
export const supabaseAdmin = (): SupabaseClient => {
  if (globalThis._supabaseAdmin) return globalThis._supabaseAdmin;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY missing');
  const client = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: {
      fetch: (url, options = {}) =>
        fetch(url, {
          ...options,
          // @ts-expect-error — Node 18+ supports this
          keepalive: true,
        }),
    },
  });
  globalThis._supabaseAdmin = client;
  return client;
};
