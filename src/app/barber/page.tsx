"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";

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
}

export default function BarberPage() {
  const router = useRouter();
  const scannerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const html5QrRef = useRef<any>(null);

  const [scanning, setScanning] = useState(false);
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [scanError, setScanError] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [recentVisits, setRecentVisits] = useState<Visit[]>([]);
  const [loadingVisits, setLoadingVisits] = useState(true);
  const [barberId, setBarberId] = useState<string>("");

  // Auth check
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/auth");
        return;
      }
      setBarberId(data.user.id);
    });
  }, [router]);

  // Load recent visits
  useEffect(() => {
    if (!barberId) return;
    loadVisits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barberId]);

  const loadVisits = async () => {
    setLoadingVisits(true);
    const { data } = await supabase
      .from("visits")
      .select("id, scanned_at, notes, customer_email, customer_name")
      .order("scanned_at", { ascending: false })
      .limit(10);
    setRecentVisits(data ?? []);
    setLoadingVisits(false);
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
        { fps: 10, qrbox: { width: 240, height: 240 } },
        async (decodedText) => {
          // QR format: dardan-barbershop:user:<uuid>
          if (!decodedText.startsWith("dardan-barbershop:user:")) {
            setScanError(
              "Invalid QR code — not a Dardan Barbershop member code.",
            );
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
      setScanError("Member not found. They may need to re-register.");
      return;
    }
    setCustomer(data as CustomerInfo);
  };

  const saveVisit = async () => {
    if (!customer || !barberId) return;
    setSaving(true);
    setSavedMsg("");

    const { error } = await supabase.from("visits").insert({
      user_id: customer.id,
      barber_id: barberId,
      notes: notes.trim() || null,
      customer_email: customer.email,
      customer_name: `${customer.first_name} ${customer.last_name}`.trim(),
    });

    setSaving(false);
    if (error) {
      setScanError("Save failed: " + error.message);
      return;
    }
    setSavedMsg("✓ Visit saved!");
    setNotes("");
    setCustomer(null);
    loadVisits();
  };

  const resetScan = () => {
    setCustomer(null);
    setScanError("");
    setSavedMsg("");
    setNotes("");
    stopScanner();
  };

  return (
    <>
      <Navbar
        lang="en"
        setLang={() => {}}
        setView={() => {}}
        user={null}
        userData={null}
        t={{
          theCatalogue: "The Catalogue",
          theCraftsmen: "The Craftsmen",
          location: "Location",
          bossMode: "Boss Mode",
          login: "Login",
          bookNow: "Book Now",
        }}
        startBooking={() => {}}
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
        @media (max-width: 700px) {
          .barber-page { padding: 24px 16px 64px; }
          .barber-grid { grid-template-columns: 1fr; }
          .barber-full { grid-column: 1; }
        }
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

        {/* Page header */}
        <div style={{ maxWidth: 900, margin: "0 auto 32px" }}>
          <p style={s.eyebrow}>Barber Panel</p>
          <h1 style={s.title}>
            Scan <em>Member</em>
          </h1>
          <div style={s.divider} />
        </div>

        <div className="barber-grid">
          {/* ── Scanner card ── */}
          <div className="barber-card">
            <p style={s.cardLabel}>QR Scanner</p>

            {!scanning && !customer && (
              <button style={s.primaryBtn} onClick={startScanner}>
                📷 Start Camera
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
                Cancel
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
                    Member since{" "}
                    {new Date(customer.created_at).toLocaleDateString("en-GB", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}

            {customer && (
              <>
                <label style={{ ...s.label, marginTop: 20 }}>
                  Notes (optional)
                </label>
                <textarea
                  placeholder="e.g. skin fade, beard trim…"
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
                    Discard
                  </button>
                  <button
                    style={{
                      ...s.primaryBtn,
                      opacity: saving ? 0.6 : 1,
                      flex: 1,
                    }}
                    onClick={saveVisit}
                    disabled={saving}
                    type="button"
                  >
                    {saving ? "Saving…" : "✓ Save Visit"}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ── Recent visits card ── */}
          <div className="barber-card">
            <p style={s.cardLabel}>Recent Visits</p>

            {loadingVisits && <p style={s.dimText}>Loading…</p>}

            {!loadingVisits && recentVisits.length === 0 && (
              <p style={s.dimText}>No visits recorded yet.</p>
            )}

            {recentVisits.map((v) => (
              <div key={v.id} style={s.visitRow}>
                <div style={s.visitAvatar}>
                  {v.customer_name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={s.visitName}>
                    {v.customer_name || v.customer_email}
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
};
