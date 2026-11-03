import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export const BARBER_COOKIE = "dardan_barber";
export const BARBER_SESSION_SECONDS = 8 * 60 * 60;

function signature(payload: string) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Server configuration missing");
  return createHmac("sha256", key).update(`dardan-barber-pin:${payload}`).digest("hex");
}

export function createBarberPinSession() {
  const payload = `v1.${Math.floor(Date.now() / 1000) + BARBER_SESSION_SECONDS}`;
  return `${payload}.${signature(payload)}`;
}

export function hasBarberPinSession(request: Request) {
  const cookie = request.headers.get("cookie")?.split(";")
    .map((value) => value.trim()).find((value) => value.startsWith(`${BARBER_COOKIE}=`));
  const token = cookie?.slice(BARBER_COOKIE.length + 1);
  if (!token) return false;
  const match = token.match(/^v1\.(\d+)\.([a-f0-9]{64})$/);
  if (!match || Number(match[1]) <= Math.floor(Date.now() / 1000)) return false;
  return timingSafeEqual(Buffer.from(match[2], "hex"), Buffer.from(signature(`v1.${match[1]}`), "hex"));
}
