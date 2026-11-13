import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

// Only the publishable (anon) key belongs here. Never add a service_role or secret key.
const url = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const publishableKey = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined;

export type AppSupabaseClient = SupabaseClient<Database>;

export const isSupabaseConfigured = Boolean(url && publishableKey);

let client: AppSupabaseClient | undefined;

/**
 * Returns the shared typed Supabase client, creating it on first use.
 * Importing this module never throws, so the site builds and runs without the env vars;
 * the error is raised only when something actually asks for the client.
 */
export function getSupabase(): AppSupabaseClient {
  if (client) return client;
  if (!url || !publishableKey) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (see .env.example).",
    );
  }
  // The session is stored and refreshed only in the browser. During server rendering there is
  // no storage and no long-lived user, so persistence is off.
  const isBrowser = typeof window !== "undefined";
  client = createClient<Database>(url, publishableKey, {
    auth: {
      persistSession: isBrowser,
      autoRefreshToken: isBrowser,
      detectSessionInUrl: isBrowser,
    },
  });
  return client;
}
