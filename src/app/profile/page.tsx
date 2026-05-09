"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import QRCode from "qrcode";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";

export default function ProfilePage() {
  const router = useRouter();
  const qrRef = useRef<HTMLCanvasElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveError, setSaveError] = useState("");

  // Editable fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneFocused, setPhoneFocused] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/auth");
        return;
      }
      const u = data.user;
      setUser(u);
      setFirstName(u.user_metadata?.first_name ?? "");
      setLastName(u.user_metadata?.last_name ?? "");
      setPhone(u.user_metadata?.phone?.replace("+389", "") ?? "");
      setLoading(false);
    });
  }, [router]);

  // Generate QR code once user is loaded
  useEffect(() => {
    if (!user || !qrRef.current) return;
    QRCode.toCanvas(qrRef.current, `dardan-barbershop:user:${user.id}`, {
      width: 180,
      margin: 2,
      color: { dark: "#c9a961", light: "#0f0f0f" },
    });
  }, [user]);

  const handleSave = async () => {
    setSaveMsg("");
    setSaveError("");
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: firstName,
        last_name: lastName,
        phone: phone ? `+389${phone}` : "",
      },
    });
    setSaving(false);
    if (error) {
      setSaveError(error.message);
      return;
    }
    setSaveMsg("Profile updated.");
    setEditing(false);
    // refresh user
    const { data } = await supabase.auth.getUser();
    if (data.user) setUser(data.user);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div style={s.loadWrap}>
        <div style={s.spinner} />
      </div>
    );
  }

  const displayName =
    firstName || lastName
      ? `${firstName} ${lastName}`.trim()
      : (user?.email?.split("@")[0] ?? "Member");

  const initials =
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";

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
      <div style={s.root}>
        {/* Blobs */}
        <div
          style={{
            ...s.blob,
            top: "-15%",
            left: "-10%",
            width: 500,
            height: 500,
          }}
        />
        <div
          style={{
            ...s.blob,
            bottom: "-18%",
            right: "-8%",
            width: 380,
            height: 380,
            opacity: 0.05,
          }}
        />

        <div style={s.page}>
          {/* ── Left panel ── */}
          <div style={s.leftPanel}>
            {/* Avatar */}
            <div style={s.avatarWrap}>
              <div style={s.avatar}>{initials}</div>
              <div style={s.avatarGlow} />
            </div>

            <h2 style={s.displayName}>{displayName}</h2>
            <p style={s.memberLabel}>Dardan Barbershop Member</p>

            <div style={s.divider} />

            {/* QR Code */}
            <p style={s.qrLabel}>YOUR MEMBER CODE</p>
            <div style={s.qrWrap}>
              <canvas ref={qrRef} style={{ borderRadius: 8 }} />
            </div>
            <p style={s.qrHint}>Show this at the barbershop</p>

            <div style={s.divider} />

            <button style={s.signOutBtn} onClick={handleSignOut}>
              Sign Out
            </button>
          </div>

          {/* ── Right panel ── */}
          <div style={s.rightPanel}>
            <div style={s.cardHeader}>
              <div>
                <p style={s.eyebrow}>Account</p>
                <h1 style={s.title}>
                  My <em>Profile</em>
                </h1>
              </div>
              {!editing && (
                <button
                  style={s.editBtn}
                  onClick={() => {
                    setSaveMsg("");
                    setSaveError("");
                    setEditing(true);
                  }}
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div style={s.cardDivider} />

            {saveMsg && <p style={s.successMsg}>{saveMsg}</p>}
            {saveError && <p style={s.errorMsg}>{saveError}</p>}

            {/* Fields */}
            <div style={s.fieldsGrid}>
              {/* First Name */}
              <div style={s.field}>
                <label style={s.label}>First Name</label>
                {editing ? (
                  <input
                    style={s.input}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#c9a961")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.1)")
                    }
                  />
                ) : (
                  <p style={s.value}>
                    {firstName || <span style={s.empty}>—</span>}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div style={s.field}>
                <label style={s.label}>Last Name</label>
                {editing ? (
                  <input
                    style={s.input}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#c9a961")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.1)")
                    }
                  />
                ) : (
                  <p style={s.value}>
                    {lastName || <span style={s.empty}>—</span>}
                  </p>
                )}
              </div>

              {/* Email — read only */}
              <div style={{ ...s.field, gridColumn: "1 / -1" }}>
                <label style={s.label}>
                  Email <span style={s.readOnlyTag}>read-only</span>
                </label>
                <p style={{ ...s.value, color: "rgba(255,255,255,0.4)" }}>
                  {user?.email}
                </p>
              </div>

              {/* Phone */}
              <div style={{ ...s.field, gridColumn: "1 / -1" }}>
                <label style={s.label}>Phone</label>
                {editing ? (
                  <div
                    style={{
                      ...s.phoneWrap,
                      border: `1px solid ${phoneFocused ? "#c9a961" : "rgba(255,255,255,0.1)"}`,
                      transition: "border-color 150ms",
                    }}
                  >
                    <span style={s.phonePrefix}>🇲🇰 +389</span>
                    <input
                      type="tel"
                      placeholder="70 000 000"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/[^0-9 ]/g, ""))
                      }
                      style={{
                        ...s.input,
                        border: "none",
                        borderRadius: "0 4px 4px 0",
                        flex: 1,
                        outline: "none",
                        marginBottom: 0,
                      }}
                      onFocus={() => setPhoneFocused(true)}
                      onBlur={() => setPhoneFocused(false)}
                    />
                  </div>
                ) : (
                  <p style={s.value}>
                    {phone ? `+389 ${phone}` : <span style={s.empty}>—</span>}
                  </p>
                )}
              </div>

              {/* Member since */}
              <div style={{ ...s.field, gridColumn: "1 / -1" }}>
                <label style={s.label}>Member Since</label>
                <p style={s.value}>
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "—"}
                </p>
              </div>
            </div>

            {/* Save / Cancel */}
            {editing && (
              <div style={s.actionRow}>
                <button
                  style={s.cancelBtn}
                  onClick={() => setEditing(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  style={{ ...s.saveBtn, opacity: saving ? 0.6 : 1 }}
                  onClick={handleSave}
                  disabled={saving}
                  type="button"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            )}
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
    padding: "48px 24px 80px",
    marginTop: 80,
  },
  loadWrap: {
    minHeight: "100vh",
    background: "#0f0f0f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    width: 36,
    height: 36,
    border: "2px solid rgba(201,169,97,0.2)",
    borderTop: "2px solid #c9a961",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  blob: {
    position: "absolute",
    borderRadius: "50%",
    background: "radial-gradient(circle, #c9a961 0%, transparent 70%)",
    opacity: 0.07,
    pointerEvents: "none",
    filter: "blur(60px)",
  },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    color: "rgba(255,255,255,0.4)",
    textDecoration: "none",
    fontSize: 13,
    letterSpacing: "0.05em",
    marginBottom: 40,
    transition: "color 200ms",
  },
  page: {
    maxWidth: 960,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: 32,
    alignItems: "start",
  },
  // ── Left panel
  leftPanel: {
    background: "rgba(20,20,20,0.92)",
    border: "1px solid rgba(201,169,97,0.15)",
    borderRadius: 4,
    padding: "36px 28px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  avatarWrap: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #8a6f3a, #c9a961)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    fontWeight: 700,
    color: "#0f0f0f",
    position: "relative",
    zIndex: 1,
  },
  avatarGlow: {
    position: "absolute",
    inset: -4,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(201,169,97,0.3) 0%, transparent 70%)",
    filter: "blur(8px)",
  },
  displayName: {
    fontFamily: "Georgia, serif",
    fontSize: 20,
    fontWeight: 400,
    color: "#fff",
    margin: "0 0 4px",
  },
  memberLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.3em",
    color: "#c9a961",
    fontWeight: 700,
    margin: 0,
  },
  divider: {
    width: "100%",
    height: 1,
    background: "rgba(255,255,255,0.07)",
    margin: "24px 0",
  },
  qrLabel: {
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: "0.35em",
    color: "rgba(255,255,255,0.35)",
    fontWeight: 700,
    marginBottom: 14,
  },
  qrWrap: {
    background: "#0f0f0f",
    border: "1px solid rgba(201,169,97,0.2)",
    borderRadius: 12,
    padding: 14,
    display: "inline-flex",
  },
  qrHint: {
    fontSize: 11,
    color: "rgba(255,255,255,0.3)",
    marginTop: 10,
    letterSpacing: "0.05em",
  },
  signOutBtn: {
    width: "100%",
    padding: "11px 0",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 4,
    background: "transparent",
    color: "rgba(255,255,255,0.4)",
    fontSize: 13,
    cursor: "pointer",
    letterSpacing: "0.1em",
    transition: "all 200ms",
  },
  // ── Right panel
  rightPanel: {
    background: "rgba(20,20,20,0.92)",
    border: "1px solid rgba(201,169,97,0.15)",
    borderRadius: 4,
    padding: "36px 40px 40px",
  },
  cardHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 4,
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
    fontSize: 36,
    fontWeight: 400,
    color: "#fff",
    margin: 0,
  },
  editBtn: {
    padding: "10px 22px",
    border: "1px solid rgba(201,169,97,0.4)",
    borderRadius: 4,
    background: "transparent",
    color: "#c9a961",
    fontSize: 12,
    letterSpacing: "0.1em",
    cursor: "pointer",
    marginTop: 6,
  },
  cardDivider: {
    width: "100%",
    height: 1,
    background: "rgba(255,255,255,0.07)",
    margin: "20px 0 28px",
  },
  fieldsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px 24px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.3em",
    color: "rgba(255,255,255,0.35)",
    fontWeight: 700,
  },
  readOnlyTag: {
    marginLeft: 8,
    fontSize: 9,
    letterSpacing: "0.2em",
    color: "rgba(255,255,255,0.2)",
    textTransform: "uppercase",
  },
  value: {
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
    margin: 0,
    fontWeight: 300,
  },
  empty: {
    color: "rgba(255,255,255,0.2)",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 4,
    color: "#fff",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 150ms",
    marginBottom: 0,
  },
  phoneWrap: {
    display: "flex",
    alignItems: "stretch",
    borderRadius: 4,
    height: 48,
    overflow: "hidden",
  },
  phonePrefix: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 14px",
    background: "rgba(201,169,97,0.08)",
    borderRight: "1px solid rgba(255,255,255,0.1)",
    color: "#c9a961",
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: "nowrap",
    userSelect: "none",
    flexShrink: 0,
  },
  actionRow: {
    display: "flex",
    gap: 12,
    justifyContent: "flex-end",
    marginTop: 32,
  },
  cancelBtn: {
    padding: "12px 24px",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 4,
    background: "transparent",
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
    cursor: "pointer",
    letterSpacing: "0.08em",
  },
  saveBtn: {
    padding: "12px 28px",
    border: "none",
    borderRadius: 4,
    background: "linear-gradient(135deg, #8a6f3a, #c9a961)",
    color: "#0f0f0f",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.1em",
  },
  successMsg: {
    background: "rgba(60,180,100,0.12)",
    border: "1px solid rgba(60,180,100,0.3)",
    color: "#6ee7a0",
    fontSize: 13,
    padding: "10px 14px",
    borderRadius: 4,
    marginBottom: 20,
  },
  errorMsg: {
    background: "rgba(220,60,60,0.12)",
    border: "1px solid rgba(220,60,60,0.3)",
    color: "#f87171",
    fontSize: 13,
    padding: "10px 14px",
    borderRadius: 4,
    marginBottom: 20,
  },
};
