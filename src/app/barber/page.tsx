"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useLanguage } from "@/lib/LanguageContext";

interface CustomerInfo {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  created_at: string;
}

interface Visit {
  id: string;
  scanned_at: string;
  notes: string | null;
  customer_email: string;
  customer_name: string;
  is_redemption?: boolean;
}

interface LoyaltyInfo {
  paidVisits: number;  // total non-free visits
  available: number;   // free haircuts available to redeem
  progress: number;    // 0–9, progress toward next reward
}

interface GalleryPhoto {
  id: string;
  storage_path: string;
  caption: string | null;
}

const ACCESS_CODE = "0101";
type BarberView = "menu" | "scan" | "gallery";

export default function BarberPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const scannerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const html5QrRef = useRef<any>(null);

  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [view, setView] = useState<BarberView>("menu");

  const [scanning, setScanning] = useState(false);
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [scanError, setScanError] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [recentVisits, setRecentVisits] = useState<Visit[]>([]);
  const [loadingVisits, setLoadingVisits] = useState(true);
  const [barberId, setBarberId] = useState<string>("");
  const [loyalty, setLoyalty] = useState<LoyaltyInfo | null>(null);

  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth + role check — only barbers may access this panel
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push("/auth");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();
      if (profile?.role !== "barber") {
        router.push("/profile");
        return;
      }
      setBarberId(data.user.id);
    });
  }, [router]);

  const loadVisits = async () => {
    setLoadingVisits(true);
    try {
      const { data } = await supabase
        .from("visits")
        .select("id, scanned_at, notes, customer_email, customer_name, is_redemption")
        .order("scanned_at", { ascending: false })
        .limit(10);
      setRecentVisits(data ?? []);
    } finally {
      setLoadingVisits(false);
    }
  };

  const loadGallery = async () => {
    setLoadingGallery(true);
    try {
      const { data } = await supabase
        .from("gallery_photos")
        .select("id, storage_path, caption")
        .order("created_at", { ascending: false });
      setGalleryPhotos(data ?? []);
    } finally {
      setLoadingGallery(false);
    }
  };

  // Load recent visits + gallery
  useEffect(() => {
    if (!barberId) return;
    loadVisits();
    loadGallery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barberId]);

  const galleryUrl = (path: string) =>
    supabase.storage.from("gallery").getPublicUrl(path).data.publicUrl;

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setUploadError(t.barber.chooseFirst);
      return;
    }
    setUploadError("");
    setUploading(true);

    const ext = file.name.split(".").pop() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("gallery")
      .upload(path, file);

    if (uploadErr) {
      setUploading(false);
      setUploadError("Upload failed: " + uploadErr.message);
      return;
    }

    const { error: insertErr } = await supabase.from("gallery_photos").insert({
      storage_path: path,
      caption: uploadCaption.trim() || null,
      uploaded_by: barberId,
    });

    setUploading(false);
    if (insertErr) {
      setUploadError("Save failed: " + insertErr.message);
      return;
    }

    setUploadCaption("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    loadGallery();
  };

  const handleDeletePhoto = async (photo: GalleryPhoto) => {
    if (!window.confirm(t.barber.confirmRemovePhoto)) return;
    await supabase.storage.from("gallery").remove([photo.storage_path]);
    await supabase.from("gallery_photos").delete().eq("id", photo.id);
    loadGallery();
  };

  const fetchLoyalty = async (userId: string) => {
    const { data } = await supabase
      .from("visits")
      .select("is_redemption")
      .eq("user_id", userId);
    const paid = (data ?? []).filter((v) => !v.is_redemption).length;
    const redeemed = (data ?? []).filter((v) => v.is_redemption).length;
    const earned = Math.floor(paid / 10);
    setLoyalty({
      paidVisits: paid,
      available: earned - redeemed,
      progress: paid % 10,
    });
  };

  // Start camera scanner
  const startScanner = async () => {
    setScanError("");
    setCustomer(null);
    setSavedMsg("");
    setScanning(true);

    const { Html5Qrcode } = await import("html5-qrcode");
    const scanner = new Html5Qrcode("qr-reader");
    html5QrRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 15, qrbox: { width: 280, height: 280 } },
        async (decodedText) => {
          // QR format: dardan-barbershop:user:<uuid>
          if (!decodedText.startsWith("dardan-barbershop:user:")) {
            setScanError(t.barber.invalidQr);
            stopScanner();
            return;
          }
          const userId = decodedText.replace("dardan-barbershop:user:", "");
          stopScanner();
          await fetchCustomer(userId);
        },
        () => {}, // ignore per-frame errors
      )
      .catch((err: Error) => {
        setScanError("Camera error: " + err.message);
        setScanning(false);
      });
  };

  const stopScanner = () => {
    if (html5QrRef.current) {
      html5QrRef.current.stop().catch(() => {});
      html5QrRef.current = null;
    }
    setScanning(false);
  };

  const fetchCustomer = async (userId: string) => {
    setScanError("");
    // Use admin-safe RPC or fetch user metadata via service — here we use the visits table lookup
    // We store customer info when saving, so for preview we call our own edge or just show the ID
    // Instead, we call getUserById via supabase admin — but from client we use auth.users indirectly.
    // We'll fetch from the profiles table if it exists, otherwise use a lightweight fetch.
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, first_name, last_name, phone, created_at")
      .eq("id", userId)
      .single();

    if (error || !data) {
      setScanError(t.barber.memberNotFound);
      return;
    }
    setCustomer(data as CustomerInfo);
    await fetchLoyalty(userId);
  };

  const saveVisit = async (isRedemption = false) => {
    if (!customer || !barberId) return;
    setSaving(true);
    setSavedMsg("");

    const { error } = await supabase.from("visits").insert({
      user_id: customer.id,
      barber_id: barberId,
      notes: notes.trim() || null,
      customer_email: customer.email,
      customer_name: `${customer.first_name} ${customer.last_name}`.trim(),
      is_redemption: isRedemption,
    });

    setSaving(false);
    if (error) {
      setScanError("Save failed: " + error.message);
      return;
    }
    setSavedMsg(isRedemption ? "🎁 " + t.barber.redemptionSaved : t.barber.visitSaved);
    setNotes("");
    setCustomer(null);
    setLoyalty(null);
    loadVisits();
  };

  const resetScan = () => {
    setCustomer(null);
    setScanError("");
    setSavedMsg("");
    setNotes("");
    stopScanner();
  };

  // PIN pad
  const handleDigit = (digit: string) => {
    if (pinError || pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    if (next.length === 4) {
      if (next === ACCESS_CODE) {
        setTimeout(() => {
          setUnlocked(true);
          setView("menu");
          setPin("");
        }, 120);
      } else {
        setPinError(true);
        setTimeout(() => {
          setPin("");
          setPinError(false);
        }, 500);
      }
    }
  };

  const handleBackspace = () => {
    if (pinError) return;
    setPin((p) => p.slice(0, -1));
  };

  const lockPanel = () => {
    stopScanner();
    resetScan();
    setUnlocked(false);
    setPin("");
    setView("menu");
  };

  return (
    <>
      <Navbar
        setView={() => {}}
        user={null}
        userData={null}
        startBooking={() => router.push("/")}
      />
      <style>{`
        .barber-page { padding: 48px 24px 80px; margin-top: 80px; }
        .barber-grid {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          align-items: start;
        }
        .barber-card {
          background: rgba(20,20,20,0.92);
          border: 1px solid rgba(201,169,97,0.15);
          border-radius: 4px;
          padding: 32px 28px;
        }
        .barber-full { grid-column: 1 / -1; }
        #qr-reader video { border-radius: 6px; }
        #qr-reader img { display: none !important; }
        @media (max-width: 700px) {
          .barber-page { padding: 16px 12px 56px; margin-top: 72px; }
          .barber-grid { grid-template-columns: 1fr; gap: 16px; }
          .barber-full { grid-column: 1; }
          .barber-card { padding: 20px 16px; border-radius: 8px; }
        }

        /* ── PIN lock screen ── */
        .pin-wrap {
          max-width: 340px;
          margin: 40px auto 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .pin-dots {
          display: flex;
          gap: 16px;
          margin: 28px 0 36px;
        }
        .pin-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid rgba(201,169,97,0.4);
          background: transparent;
          transition: background 150ms ease, border-color 150ms ease, transform 150ms ease;
        }
        .pin-dot.filled {
          background: #c9a961;
          border-color: #c9a961;
        }
        .pin-dots.error .pin-dot {
          border-color: #f87171;
          background: #f87171;
        }
        .pin-dots.error {
          animation: pin-shake 420ms ease;
        }
        @keyframes pin-shake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(4px); }
          30%, 50%, 70% { transform: translateX(-8px); }
          40%, 60% { transform: translateX(8px); }
        }
        .pin-error-msg {
          color: #f87171;
          font-size: 12px;
          height: 16px;
          margin: -24px 0 20px;
        }
        .numpad {
          display: grid;
          grid-template-columns: repeat(3, 72px);
          gap: 16px;
        }
        .num-key {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.03);
          color: #fff;
          font-size: 24px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 150ms ease, border-color 150ms ease;
        }
        .num-key:hover { background: rgba(201,169,97,0.12); border-color: rgba(201,169,97,0.4); }
        .num-key:active { background: rgba(201,169,97,0.25); }
        .num-key.ghost {
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.4);
          font-size: 16px;
        }
        .num-key.ghost:hover { background: rgba(255,255,255,0.05); }
        @media (max-width: 420px) {
          .numpad { grid-template-columns: repeat(3, 64px); gap: 12px; }
          .num-key { width: 64px; height: 64px; font-size: 22px; }
        }

        /* ── Menu screen ── */
        .barber-header-row {
          max-width: 900px;
          margin: 0 auto 32px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
        }
        .lock-btn {
          flex-shrink: 0;
          padding: 10px 18px;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 4px;
          background: transparent;
          color: rgba(255,255,255,0.5);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: border-color 150ms ease, color 150ms ease;
        }
        .lock-btn:hover { border-color: #c9a961; color: #c9a961; }
        .menu-grid {
          max-width: 700px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .menu-btn {
          background: rgba(20,20,20,0.92);
          border: 1px solid rgba(201,169,97,0.15);
          border-radius: 8px;
          padding: 48px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: border-color 200ms ease, transform 200ms ease, background 200ms ease;
        }
        .menu-btn:hover {
          border-color: rgba(201,169,97,0.5);
          background: rgba(201,169,97,0.05);
          transform: translateY(-3px);
        }
        .menu-btn-icon { font-size: 40px; line-height: 1; }
        .menu-btn-label {
          font-size: 13px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 700;
          color: #fff;
        }
        .back-btn {
          display: inline-flex;
          align-items: center;
          background: transparent;
          border: none;
          color: #c9a961;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 700;
          cursor: pointer;
          margin-bottom: 20px;
          padding: 0;
        }
        .back-btn:hover { opacity: 0.7; }
        @media (max-width: 700px) {
          .menu-grid { grid-template-columns: 1fr; max-width: 400px; }
          .menu-btn { padding: 36px 20px; }
        }

        .loyalty-block {
          margin-top: 16px;
          padding: 16px;
          background: rgba(201,169,97,0.06);
          border: 1px solid rgba(201,169,97,0.18);
          border-radius: 6px;
        }
        .loyalty-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .loyalty-label {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.35em;
          color: rgba(255,255,255,0.35);
          font-weight: 700;
        }
        .loyalty-count {
          font-size: 11px;
          color: #c9a961;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .loyalty-dots {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
        }
        .loyalty-dot {
          flex: 1;
          min-width: 18px;
          height: 5px;
          border-radius: 3px;
          background: rgba(255,255,255,0.08);
          transition: background 200ms;
        }
        .loyalty-dot.filled {
          background: #c9a961;
        }
        .loyalty-free-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
          padding: 6px 12px;
          background: rgba(201,169,97,0.12);
          border: 1px solid rgba(201,169,97,0.35);
          border-radius: 20px;
          font-size: 11px;
          color: #c9a961;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .redeem-btn {
          width: 100%;
          margin-top: 12px;
          padding: 13px 0;
          border: 1px solid #c9a961;
          border-radius: 4px;
          background: rgba(201,169,97,0.1);
          color: #c9a961;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 200ms;
        }
        .redeem-btn:hover { background: rgba(201,169,97,0.2); }
      `}</style>

      <div className="barber-page" style={s.root}>
        {/* Blobs */}
        <div
          style={{
            ...s.blob,
            top: "-10%",
            left: "-8%",
            width: 400,
            height: 400,
          }}
        />
        <div
          style={{
            ...s.blob,
            bottom: "-15%",
            right: "-6%",
            width: 320,
            height: 320,
            opacity: 0.05,
          }}
        />

        {!unlocked && (
          <div className="pin-wrap">
            <p style={s.eyebrow}>{t.barber.barberPanel}</p>
            <h1 style={{ ...s.title, fontSize: "clamp(24px, 4vw, 32px)" }}>
              {t.barber.enterAccessCode}
            </h1>
            <div className={`pin-dots${pinError ? " error" : ""}`}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`pin-dot${i < pin.length ? " filled" : ""}`}
                />
              ))}
            </div>
            <p className="pin-error-msg">
              {pinError ? t.barber.incorrectCode : ""}
            </p>
            <div className="numpad">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
                <button
                  key={d}
                  type="button"
                  className="num-key"
                  onClick={() => handleDigit(d)}
                >
                  {d}
                </button>
              ))}
              <span />
              <button
                type="button"
                className="num-key"
                onClick={() => handleDigit("0")}
              >
                0
              </button>
              <button
                type="button"
                className="num-key ghost"
                onClick={handleBackspace}
                aria-label="Backspace"
              >
                ⌫
              </button>
            </div>
          </div>
        )}

        {unlocked && (
        <div className="barber-header-row">
          <div>
            <p style={s.eyebrow}>{t.barber.barberPanel}</p>
            <h1 style={s.title}>
              {t.barber.scanTitle1} <em>{t.barber.scanTitle2}</em>
            </h1>
            <div style={s.divider} />
          </div>
          <button type="button" className="lock-btn" onClick={lockPanel}>
            🔒 {t.barber.lock}
          </button>
        </div>
        )}

        {view === "menu" && unlocked && (
          <div className="menu-grid">
            <div
              className="menu-btn"
              onClick={() => setView("scan")}
              onKeyDown={(e) => e.key === "Enter" && setView("scan")}
              role="button"
              tabIndex={0}
            >
              <span className="menu-btn-icon">📷</span>
              <span className="menu-btn-label">{t.barber.scanQrCode}</span>
            </div>
            <div
              className="menu-btn"
              onClick={() => setView("gallery")}
              onKeyDown={(e) => e.key === "Enter" && setView("gallery")}
              role="button"
              tabIndex={0}
            >
              <span className="menu-btn-icon">🖼️</span>
              <span className="menu-btn-label">
                {t.barber.addPhotoToGallery}
              </span>
            </div>
          </div>
        )}

        {view === "scan" && unlocked && (
        <>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <button
            type="button"
            className="back-btn"
            onClick={() => setView("menu")}
          >
            {t.barber.backToMenu}
          </button>
        </div>
        <div className="barber-grid">
          {/* ── Scanner card ── */}
          <div className="barber-card">
            <p style={s.cardLabel}>{t.barber.qrScanner}</p>

            {!scanning && !customer && (
              <button style={s.primaryBtn} onClick={startScanner}>
                {t.barber.startCamera}
              </button>
            )}

            {/* Camera viewport */}
            <div
              id="qr-reader"
              ref={scannerRef}
              style={{
                width: "100%",
                borderRadius: 8,
                overflow: "hidden",
                display: scanning ? "block" : "none",
                marginBottom: 16,
              }}
            />

            {scanning && (
              <button style={s.ghostBtn} onClick={stopScanner}>
                {t.barber.cancel}
              </button>
            )}

            {scanError && <p style={s.errorMsg}>{scanError}</p>}
            {savedMsg && <p style={s.successMsg}>{savedMsg}</p>}

            {/* Customer card after scan */}
            {customer && (
              <div style={s.customerCard}>
                <div style={s.customerAvatar}>
                  {`${customer.first_name?.[0] ?? ""}${customer.last_name?.[0] ?? ""}`.toUpperCase() ||
                    "?"}
                </div>
                <div>
                  <p style={s.customerName}>
                    {customer.first_name} {customer.last_name}
                  </p>
                  <p style={s.customerDetail}>{customer.email}</p>
                  {customer.phone && (
                    <p style={s.customerDetail}>{customer.phone}</p>
                  )}
                  <p
                    style={{
                      ...s.customerDetail,
                      color: "rgba(255,255,255,0.25)",
                      marginTop: 6,
                    }}
                  >
                    {t.barber.memberSince}{" "}
                    {new Date(customer.created_at).toLocaleDateString("en-GB", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}

            {customer && loyalty && (
              <div className="loyalty-block">
                <div className="loyalty-header">
                  <span className="loyalty-label">{t.barber.loyaltyProgress}</span>
                  <span className="loyalty-count">
                    {loyalty.progress} / 10
                  </span>
                </div>
                <div className="loyalty-dots">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`loyalty-dot${i < loyalty.progress ? " filled" : ""}`}
                    />
                  ))}
                </div>
                {loyalty.available > 0 && (
                  <div className="loyalty-free-badge">
                    🎁 {loyalty.available}{" "}
                    {loyalty.available > 1
                      ? t.barber.freeHaircutPluralAvailable
                      : t.barber.freeHaircutSingularAvailable}
                  </div>
                )}
              </div>
            )}

            {customer && (
              <>
                <label style={{ ...s.label, marginTop: 20 }}>
                  {t.barber.notes}
                </label>
                <textarea
                  placeholder={t.barber.notesPlaceholder}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  style={s.textarea}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#c9a961")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.1)")
                  }
                />
                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  <button style={s.ghostBtn} onClick={resetScan} type="button">
                    {t.barber.discard}
                  </button>
                  <button
                    style={{
                      ...s.primaryBtn,
                      opacity: saving ? 0.6 : 1,
                      flex: 1,
                    }}
                    onClick={() => saveVisit(false)}
                    disabled={saving}
                    type="button"
                  >
                    {saving ? t.barber.saving : t.barber.saveVisit}
                  </button>
                </div>
                {loyalty && loyalty.available > 0 && (
                  <button
                    className="redeem-btn"
                    onClick={() => saveVisit(true)}
                    disabled={saving}
                    type="button"
                  >
                    🎁 {t.barber.redeemFreeHaircut}
                  </button>
                )}
              </>
            )}
          </div>

          {/* ── Recent visits card ── */}
          <div className="barber-card">
            <p style={s.cardLabel}>{t.barber.recentVisits}</p>

            {loadingVisits && <p style={s.dimText}>{t.barber.loading}</p>}

            {!loadingVisits && recentVisits.length === 0 && (
              <p style={s.dimText}>{t.barber.noVisits}</p>
            )}

            {recentVisits.map((v) => (
              <div key={v.id} style={s.visitRow}>
                <div style={{
                  ...s.visitAvatar,
                  background: v.is_redemption
                    ? "rgba(201,169,97,0.25)"
                    : "rgba(201,169,97,0.15)",
                }}>
                  {v.is_redemption ? "🎁" : (v.customer_name?.[0]?.toUpperCase() ?? "?")}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={s.visitName}>
                    {v.customer_name || v.customer_email}
                    {v.is_redemption && (
                      <span style={{
                        marginLeft: 8,
                        fontSize: 9,
                        letterSpacing: "0.15em",
                        color: "#c9a961",
                        textTransform: "uppercase",
                        fontWeight: 700,
                      }}>{t.barber.freeBadge}</span>
                    )}
                  </p>
                  {v.notes && <p style={s.visitNote}>{v.notes}</p>}
                  <p style={s.visitTime}>
                    {new Date(v.scanned_at).toLocaleString("en-GB", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </>
        )}

        {view === "gallery" && unlocked && (
        <>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <button
            type="button"
            className="back-btn"
            onClick={() => setView("menu")}
          >
            {t.barber.backToMenu}
          </button>
        </div>
        {/* ── Gallery management ── */}
        <div
          className="barber-card"
          style={{ maxWidth: 900, margin: "0 auto" }}
        >
          <p style={s.cardLabel}>{t.barber.galleryManagement}</p>

          <div style={s.uploadRow}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={s.fileInput}
            />
            <input
              type="text"
              placeholder={t.barber.captionPlaceholder}
              value={uploadCaption}
              onChange={(e) => setUploadCaption(e.target.value)}
              style={s.captionInput}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#c9a961")}
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
              }
            />
            <button
              style={{
                ...s.primaryBtn,
                width: "auto",
                marginBottom: 0,
                padding: "12px 24px",
                opacity: uploading ? 0.6 : 1,
              }}
              onClick={handleUpload}
              disabled={uploading}
              type="button"
            >
              {uploading ? t.barber.uploading : t.barber.uploadPhoto}
            </button>
          </div>

          {uploadError && <p style={s.errorMsg}>{uploadError}</p>}

          {loadingGallery && <p style={s.dimText}>{t.barber.loading}</p>}
          {!loadingGallery && galleryPhotos.length === 0 && (
            <p style={s.dimText}>{t.barber.noPhotos}</p>
          )}

          {!loadingGallery && galleryPhotos.length > 0 && (
            <div style={s.galleryGrid}>
              {galleryPhotos.map((photo) => (
                <div key={photo.id} style={s.galleryThumbWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={galleryUrl(photo.storage_path)}
                    alt={photo.caption ?? "Gallery photo"}
                    style={s.galleryThumb}
                  />
                  <button
                    style={s.galleryRemoveBtn}
                    onClick={() => handleDeletePhoto(photo)}
                    type="button"
                    aria-label="Remove photo"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        </>
        )}
      </div>
      <Footer />
      <ScrollToTop />
    </>
  );
}

/* ── Styles ── */
const s: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "calc(100vh - 80px)",
    background: "#0f0f0f",
    position: "relative",
    overflow: "hidden",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  blob: {
    position: "absolute",
    borderRadius: "50%",
    background: "radial-gradient(circle, #c9a961 0%, transparent 70%)",
    opacity: 0.07,
    pointerEvents: "none",
    filter: "blur(60px)",
  },
  eyebrow: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.35em",
    color: "#c9a961",
    fontWeight: 700,
    margin: "0 0 6px",
  },
  title: {
    fontFamily: "Georgia, serif",
    fontSize: "clamp(32px, 5vw, 56px)",
    fontWeight: 400,
    color: "#fff",
    margin: 0,
  },
  divider: {
    width: "100%",
    height: 1,
    background: "rgba(255,255,255,0.07)",
    margin: "20px 0 0",
  },
  cardLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.35em",
    color: "rgba(255,255,255,0.35)",
    fontWeight: 700,
    margin: "0 0 20px",
  },
  primaryBtn: {
    width: "100%",
    padding: "14px 0",
    border: "none",
    borderRadius: 4,
    background: "linear-gradient(135deg, #8a6f3a, #c9a961)",
    color: "#0f0f0f",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.08em",
    marginBottom: 16,
  },
  ghostBtn: {
    width: "100%",
    padding: "12px 0",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 4,
    background: "transparent",
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
    cursor: "pointer",
    letterSpacing: "0.08em",
    marginBottom: 8,
  },
  customerCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: 16,
    padding: "18px 16px",
    background: "rgba(201,169,97,0.06)",
    border: "1px solid rgba(201,169,97,0.2)",
    borderRadius: 6,
    marginTop: 8,
  },
  customerAvatar: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #8a6f3a, #c9a961)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    fontWeight: 700,
    color: "#0f0f0f",
    flexShrink: 0,
  },
  customerName: {
    fontFamily: "Georgia, serif",
    fontSize: 18,
    color: "#fff",
    margin: "0 0 4px",
  },
  customerDetail: {
    fontSize: 13,
    color: "rgba(255,255,255,0.45)",
    margin: "2px 0",
    wordBreak: "break-all" as const,
    overflowWrap: "anywhere" as const,
  },
  label: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.3em",
    color: "rgba(255,255,255,0.35)",
    fontWeight: 700,
    display: "block",
    marginBottom: 8,
  },
  textarea: {
    width: "100%",
    padding: "12px 14px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 4,
    color: "#fff",
    fontSize: 14,
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
    transition: "border-color 150ms",
    fontFamily: "inherit",
  },
  visitRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "14px 0",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  visitAvatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "rgba(201,169,97,0.15)",
    border: "1px solid rgba(201,169,97,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 700,
    color: "#c9a961",
    flexShrink: 0,
  },
  visitName: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    margin: "0 0 3px",
    fontWeight: 500,
  },
  visitNote: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    margin: "0 0 3px",
    fontStyle: "italic",
  },
  visitTime: {
    fontSize: 11,
    color: "rgba(255,255,255,0.25)",
    margin: 0,
    letterSpacing: "0.03em",
  },
  dimText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.25)",
    margin: 0,
  },
  errorMsg: {
    background: "rgba(220,60,60,0.12)",
    border: "1px solid rgba(220,60,60,0.3)",
    color: "#f87171",
    fontSize: 13,
    padding: "10px 14px",
    borderRadius: 4,
    marginTop: 12,
  },
  successMsg: {
    background: "rgba(60,180,100,0.12)",
    border: "1px solid rgba(60,180,100,0.3)",
    color: "#6ee7a0",
    fontSize: 13,
    padding: "10px 14px",
    borderRadius: 4,
    marginTop: 12,
  },
  uploadRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 16,
  },
  fileInput: {
    flex: "1 1 200px",
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
  },
  captionInput: {
    flex: "1 1 180px",
    padding: "12px 14px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 4,
    color: "#fff",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 150ms",
    fontFamily: "inherit",
  },
  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
    gap: 12,
  },
  galleryThumbWrap: {
    position: "relative",
    aspectRatio: "1",
    borderRadius: 6,
    overflow: "hidden",
    background: "#1a1a1a",
  },
  galleryThumb: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  galleryRemoveBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: "50%",
    border: "none",
    background: "rgba(15,15,15,0.75)",
    color: "#fff",
    fontSize: 14,
    lineHeight: 1,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
