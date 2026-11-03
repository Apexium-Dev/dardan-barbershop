import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireBarber } from "@/lib/requireBarber";

export async function POST(req: Request) {
  const denied = await requireBarber(req);
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  const { userId, newPassword } = body ?? {};
  if (typeof userId !== "string" || !/^[0-9a-f-]{36}$/i.test(userId)
    || typeof newPassword !== "string" || newPassword.length < 6) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { data: member } = await supabaseAdmin.from("profiles")
    .select("id").eq("id", userId).eq("role", "member").maybeSingle();
  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: newPassword,
  });

  if (error) {
    return NextResponse.json({ error: "Password reset failed" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
