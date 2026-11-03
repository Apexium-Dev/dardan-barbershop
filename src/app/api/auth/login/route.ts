import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isValidUsername } from "@/lib/syntheticEmail";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (typeof body?.identifier !== "string" || typeof body?.password !== "string"
    || !body.identifier.trim() || !body.password || body.identifier.length > 254) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  let email = body.identifier.trim().toLowerCase();
  if (!email.includes("@")) {
    if (!isValidUsername(email)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    // Resolve privately: customer contact details are never exposed before login.
    const { data } = await supabaseAdmin.from("profiles")
      .select("email").eq("username", email).maybeSingle();
    email = data?.email ?? `${email}@dardan-user.local`;
  }
  // A fresh client per request prevents sessions leaking between server requests.
  const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  const { data, error } = await client.auth.signInWithPassword({ email, password: body.password });
  if (error || !data.session) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  return NextResponse.json({ session: data.session }, {
    headers: { "Cache-Control": "no-store" },
  });
}
