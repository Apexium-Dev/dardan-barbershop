import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service-role client — full database/auth admin access, bypasses RLS.
// NEVER import this from a "use client" file. Only used inside Route
// Handlers (src/app/api/**/route.ts), which run exclusively on the server.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
