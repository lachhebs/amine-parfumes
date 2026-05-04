import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

declare global {
  var _supabaseClient: SupabaseClient | undefined;
  var _supabaseAdmin: SupabaseClient | undefined;
}

export const supabase: SupabaseClient = (() => {
  if (globalThis._supabaseClient) return globalThis._supabaseClient;
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  globalThis._supabaseClient = client;
  return client;
})();

export const supabaseAdmin = (): SupabaseClient => {
  if (globalThis._supabaseAdmin) return globalThis._supabaseAdmin;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY missing');
  const client = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  globalThis._supabaseAdmin = client;
  return client;
};
