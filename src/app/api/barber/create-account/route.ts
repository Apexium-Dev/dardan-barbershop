import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { SYNTHETIC_EMAIL_DOMAIN, isValidUsername } from "@/lib/syntheticEmail";

// Same 4-digit code as the barber panel's PIN pad (src/app/barber/page.tsx).
// Not real access control — see reset-password/route.ts for the same note.
const ACCESS_CODE = "0101";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { pin, username, password } = body ?? {};

  if (pin !== ACCESS_CODE) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const cleanUsername =
    typeof username === "string" ? username.trim().toLowerCase() : "";
  if (!isValidUsername(cleanUsername)) {
    return NextResponse.json({ error: "invalid_username" }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 6) {
    return NextResponse.json({ error: "invalid_password" }, { status: 400 });
  }

  const syntheticEmail = `${cleanUsername}@${SYNTHETIC_EMAIL_DOMAIN}`;

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: syntheticEmail,
    password,
    email_confirm: true,
    user_metadata: {
      first_name: cleanUsername,
      last_name: "",
      phone: "",
      username: cleanUsername,
    },
  });

  if (error || !data.user) {
    const taken = error?.message?.toLowerCase().includes("already registered");
    return NextResponse.json(
      { error: taken ? "username_taken" : "create_failed" },
      { status: 400 },
    );
  }

  // The Auth trigger creates the profile in the same transaction as the user.
  // Inserting again would report failure after successfully creating an account.

  return NextResponse.json({ success: true });
}
