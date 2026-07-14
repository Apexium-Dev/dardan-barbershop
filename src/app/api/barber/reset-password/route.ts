import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Same 4-digit code as the barber panel's PIN pad (src/app/barber/page.tsx).
// This is not real access control — like the PIN itself, it's visible to
// anyone who reads the client bundle — just a minimal check that a request
// didn't come from a blind script with no knowledge of this app at all.
const ACCESS_CODE = "0101";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { pin, userId, newPassword } = body ?? {};

  if (pin !== ACCESS_CODE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!userId || typeof newPassword !== "string" || newPassword.length < 6) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: newPassword,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
