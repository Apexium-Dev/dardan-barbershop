import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { requireBarber } from "@/lib/requireBarber";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function result(data: unknown, error: { message: string } | null) {
  return NextResponse.json({ data, error: error ? { message: error.message } : null }, {
    status: error ? 400 : 200, headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const denied = await requireBarber(request);
  if (denied) return denied;
  if (new URL(request.url).searchParams.get("action") === "upload-photo") {
    const form = await request.formData().catch(() => null);
    const file = form?.get("file");
    const caption = form?.get("caption");
    const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
    if (!(file instanceof File) || !extensions[file.type] || file.size > 4194304
      || (caption !== null && typeof caption !== "string") || String(caption ?? "").length > 1000) {
      return result(null, { message: "Choose a JPEG, PNG, or WebP image up to 4 MB." });
    }
    const path = `${randomUUID()}.${extensions[file.type]}`;
    const upload = await supabaseAdmin.storage.from("gallery").upload(path, file);
    if (upload.error) return result(null, upload.error);
    const row = await supabaseAdmin.from("gallery_photos").insert({
      storage_path: path, caption: String(caption ?? "").trim() || null,
    });
    if (row.error) await supabaseAdmin.storage.from("gallery").remove([path]);
    return result(null, row.error);
  }
  const body = await request.json().catch(() => null);
  switch (body?.action) {
    case "search": {
      const q = typeof body.query === "string" ? body.query.trim().replace(/[,.()%*]/g, "").slice(0, 80) : "";
      const page = Number.isSafeInteger(body.page) && body.page >= 0 ? body.page : 0;
      let query = supabaseAdmin.from("profiles").select("id, first_name, last_name, username")
        .eq("role", "member");
      if (q) query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,username.ilike.%${q}%`);
      const r = await query.order("username", { ascending: true, nullsFirst: false })
        .order("id", { ascending: true }).range(page * 50, page * 50 + 50);
      return result(r.data, r.error);
    }
    case "recent-visits": {
      const r = await supabaseAdmin.from("visits")
        .select("id, scanned_at, notes, customer_email, customer_name, is_redemption")
        .order("scanned_at", { ascending: false }).limit(10);
      return result(r.data, r.error);
    }
    case "customer":
    case "loyalty": {
      if (typeof body.userId !== "string" || !uuid.test(body.userId)) return result(null, { message: "Invalid member code" });
      const r = body.action === "customer"
        ? await supabaseAdmin.from("profiles").select("id, email, first_name, last_name, phone, created_at")
          .eq("id", body.userId).eq("role", "member").single()
        : await supabaseAdmin.from("visits").select("is_redemption").eq("user_id", body.userId);
      return result(r.data, r.error);
    }
    case "save-visit": {
      if (typeof body.userId !== "string" || !uuid.test(body.userId)
        || typeof body.isRedemption !== "boolean" || typeof body.notes !== "string" || body.notes.length > 2000) {
        return result(null, { message: "Invalid visit" });
      }
      const r = await supabaseAdmin.from("visits").insert({
        user_id: body.userId, notes: body.notes.trim() || null, is_redemption: body.isRedemption,
      });
      return result(null, r.error);
    }
    case "delete-photo": {
      if (typeof body.photoId !== "string" || !uuid.test(body.photoId)) return result(null, { message: "Invalid photo" });
      const photo = await supabaseAdmin.from("gallery_photos").select("storage_path").eq("id", body.photoId).single();
      if (photo.error || !photo.data) return result(null, photo.error ?? { message: "Photo not found" });
      const removed = await supabaseAdmin.storage.from("gallery").remove([photo.data.storage_path]);
      if (removed.error) return result(null, removed.error);
      const r = await supabaseAdmin.from("gallery_photos").delete().eq("id", body.photoId);
      return result(null, r.error);
    }
    default:
      return result(null, { message: "Unknown action" });
  }
}
