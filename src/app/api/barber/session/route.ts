import { NextResponse } from "next/server";
import { BARBER_COOKIE, BARBER_SESSION_SECONDS, createBarberPinSession } from "@/lib/barberPinSession";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/api/barber",
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (body?.pin !== "0101") {
    return NextResponse.json({ error: "Incorrect code" }, { status: 401 });
  }
  const response = NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(BARBER_COOKIE, createBarberPinSession(), { ...cookieOptions, maxAge: BARBER_SESSION_SECONDS });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(BARBER_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  return response;
}
