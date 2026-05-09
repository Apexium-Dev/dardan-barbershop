"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type View = "login" | "register" | "forgot";

export default function AuthPage() {
  const router = useRouter();
  const [view, setView] = useState<View>("login");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleLogin = async () => {
    clearMessages();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push("/");
  };

  const handleRegister = async () => {
    clearMessages();
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone ? `+389${phone}` : "",
        },
      },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSuccess("Account created! Check your email to confirm your address.");
  };

  const handleForgot = async () => {
    clearMessages();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSuccess("Reset link sent! Check your inbox.");
  };

  return (
    <div style={styles.root}>
      {/* ── Background grain overlay ── */}
      <div style={styles.grain} />

      {/* ── Gold accent blobs ── */}
      <div
        style={{
          ...styles.blob,
          top: "-18%",
          left: "-12%",
          width: 520,
          height: 520,
        }}
      />
      <div
        style={{
          ...styles.blob,
          bottom: "-20%",
          right: "-10%",
          width: 420,
          height: 420,
          opacity: 0.06,
        }}
      />

      {/* ── Card ── */}
      <div style={styles.card}>
        {/* Logo */}
        <Link href="/" style={styles.logoWrap}>
          <Image
            src="/logo.png"
            alt="Dardan Barbershop"
            width={54}
            height={54}
            style={{ objectFit: "contain" }}
          />
        </Link>

        {/* ══════════════════════════════════════════════════════ LOGIN */}
        {view === "login" && (
          <div style={styles.form}>
            <p style={styles.eyebrow}>Welcome Back</p>
            <h1 style={styles.title}>
              Sign <em>In</em>
            </h1>
            <div style={styles.divider} />

            {error && <p style={styles.errorMsg}>{error}</p>}
            {success && <p style={styles.successMsg}>{success}</p>}

            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#c9a961")}
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
              }
            />

            <label style={{ ...styles.label, marginTop: 18 }}>Password</label>
            <div style={styles.passWrap}>
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                style={{ ...styles.input, marginBottom: 0, paddingRight: 48 }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#c9a961")}
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
                }
              />
              <button
                style={styles.eyeBtn}
                onClick={() => setShowPass((p) => !p)}
                type="button"
              >
                {showPass ? <EyeOff /> : <EyeOn />}
              </button>
            </div>

            <button
              style={styles.forgotBtn}
              onClick={() => {
                clearMessages();
                setView("forgot");
              }}
              type="button"
            >
              Forgot password?
            </button>

            <button
              style={{ ...styles.primary, opacity: loading ? 0.6 : 1 }}
              onClick={handleLogin}
              type="button"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>

            <p style={styles.switchText}>
              Don&apos;t have an account?{" "}
              <button
                style={styles.switchLink}
                onClick={() => {
                  clearMessages();
                  setView("register");
                }}
                type="button"
              >
                Create one
              </button>
            </p>
          </div>
        )}

        {/* ══════════════════════════════════════════════════ REGISTER */}
        {view === "register" && (
          <div style={styles.form}>
            <p style={styles.eyebrow}>Join the Club</p>
            <h1 style={styles.title}>
              Create <em>Account</em>
            </h1>
            <div style={styles.divider} />

            {error && <p style={styles.errorMsg}>{error}</p>}
            {success && <p style={styles.successMsg}>{success}</p>}

            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>First Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{ ...styles.input, marginBottom: 0 }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#c9a961")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.1)")
                  }
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Last Name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{ ...styles.input, marginBottom: 0 }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#c9a961")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.1)")
                  }
                />
              </div>
            </div>

            <label style={{ ...styles.label, marginTop: 18 }}>Phone</label>
            <div
              style={{
                ...styles.phoneWrap,
                borderRadius: 4,
                border: `1px solid ${phoneFocused ? "#c9a961" : "rgba(255,255,255,0.1)"}`,
                transition: "border-color 150ms",
              }}
            >
              <span style={{ ...styles.phonePrefix, border: "none" }}>
                🇲🇰 +389
              </span>
              <input
                type="tel"
                placeholder="70 000 000"
                value={phone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/[^0-9 ]/g, "");
                  setPhone(digits);
                }}
                style={{
                  ...styles.input,
                  marginBottom: 0,
                  border: "none",
                  borderRadius: "0 4px 4px 0",
                  flex: 1,
                  outline: "none",
                }}
                onFocus={() => setPhoneFocused(true)}
                onBlur={() => setPhoneFocused(false)}
              />
            </div>

            <label style={{ ...styles.label, marginTop: 18 }}>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#c9a961")}
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
              }
            />

            <label style={{ ...styles.label, marginTop: 18 }}>Password</label>
            <div style={styles.passWrap}>
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...styles.input, marginBottom: 0, paddingRight: 48 }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#c9a961")}
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
                }
              />
              <button
                style={styles.eyeBtn}
                onClick={() => setShowPass((p) => !p)}
                type="button"
              >
                {showPass ? <EyeOff /> : <EyeOn />}
              </button>
            </div>

            <label style={{ ...styles.label, marginTop: 18 }}>
              Confirm Password
            </label>
            <div style={styles.passWrap}>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ ...styles.input, marginBottom: 0, paddingRight: 48 }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#c9a961")}
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
                }
              />
              <button
                style={styles.eyeBtn}
                onClick={() => setShowConfirm((p) => !p)}
                type="button"
              >
                {showConfirm ? <EyeOff /> : <EyeOn />}
              </button>
            </div>

            <p style={styles.terms}>
              By creating an account you agree to our{" "}
              <Link href="/terms" style={styles.termsLink}>
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" style={styles.termsLink}>
                Privacy Policy
              </Link>
              .
            </p>

            <button
              style={{ ...styles.primary, opacity: loading ? 0.6 : 1 }}
              onClick={handleRegister}
              type="button"
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>

            <p style={styles.switchText}>
              Already have an account?{" "}
              <button
                style={styles.switchLink}
                onClick={() => {
                  clearMessages();
                  setView("login");
                }}
                type="button"
              >
                Sign in
              </button>
            </p>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════ FORGOT */}
        {view === "forgot" && (
          <div style={styles.form}>
            <p style={styles.eyebrow}>No Worries</p>
            <h1 style={styles.title}>
              Reset <em>Password</em>
            </h1>
            <div style={styles.divider} />

            {error && <p style={styles.errorMsg}>{error}</p>}
            {success && <p style={styles.successMsg}>{success}</p>}

            <p style={styles.hint}>
              Enter the email address linked to your account and we&apos;ll send
              you a reset link.
            </p>

            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#c9a961")}
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
              }
            />

            <button
              style={{ ...styles.primary, opacity: loading ? 0.6 : 1 }}
              onClick={handleForgot}
              type="button"
              disabled={loading}
            >
              {loading ? "Sending…" : "Send Reset Link"}
            </button>

            <button
              style={styles.backBtn}
              onClick={() => {
                clearMessages();
                setView("login");
              }}
              type="button"
            >
              <BackArrow /> Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Inline styles ───────────────────────────────────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    background: "#0f0f0f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    position: "relative",
    overflow: "hidden",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  grain: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
    backgroundRepeat: "repeat",
    backgroundSize: "180px",
    pointerEvents: "none",
    zIndex: 0,
  },
  blob: {
    position: "absolute",
    borderRadius: "50%",
    background: "radial-gradient(circle, #c9a961 0%, transparent 70%)",
    opacity: 0.09,
    pointerEvents: "none",
    zIndex: 0,
    filter: "blur(60px)",
  },
  card: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: 460,
    background: "rgba(20,20,20,0.92)",
    border: "1px solid rgba(201,169,97,0.18)",
    borderRadius: 4,
    padding: "40px 40px 36px",
    backdropFilter: "blur(18px)",
    boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
  },
  phoneWrap: {
    display: "flex",
    alignItems: "stretch",
    marginBottom: 0,
    height: 48,
  },
  phonePrefix: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 14px",
    background: "rgba(201,169,97,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRight: "none",
    borderRadius: "4px 0 0 4px",
    color: "#c9a961",
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: "0.05em",
    whiteSpace: "nowrap" as const,
    userSelect: "none" as const,
    lineHeight: 1,
    gap: 6,
  },
  errorMsg: {
    background: "rgba(220,60,60,0.12)",
    border: "1px solid rgba(220,60,60,0.3)",
    color: "#f87171",
    fontSize: 13,
    padding: "10px 14px",
    borderRadius: 4,
    marginBottom: 16,
  },
  successMsg: {
    background: "rgba(60,180,100,0.12)",
    border: "1px solid rgba(60,180,100,0.3)",
    color: "#6ee7a0",
    fontSize: 13,
    padding: "10px 14px",
    borderRadius: 4,
    marginBottom: 16,
  },
  logoWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 28,
    textDecoration: "none",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  eyebrow: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 11,
    letterSpacing: "0.38em",
    textTransform: "uppercase" as const,
    color: "#c9a961",
    margin: "0 0 10px 0",
  },
  title: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "clamp(26px, 5vw, 34px)",
    fontWeight: 400,
    color: "#ffffff",
    margin: 0,
    lineHeight: 1.15,
  },
  divider: {
    width: 40,
    height: 1,
    background: "linear-gradient(to right, #c9a961, transparent)",
    margin: "16px 0 26px 0",
  },
  hint: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    lineHeight: 1.6,
    margin: "0 0 24px 0",
  },
  label: {
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.45)",
    marginBottom: 8,
    display: "block",
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 3,
    padding: "13px 16px",
    fontSize: 14,
    color: "#ffffff",
    outline: "none",
    marginBottom: 0,
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  },
  passWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  eyeBtn: {
    position: "absolute",
    right: 14,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    color: "rgba(255,255,255,0.35)",
    display: "flex",
    alignItems: "center",
  },
  forgotBtn: {
    background: "none",
    border: "none",
    color: "#c9a961",
    fontSize: 12,
    letterSpacing: "0.08em",
    cursor: "pointer",
    padding: "10px 0 0 0",
    textAlign: "right" as const,
    fontFamily: "inherit",
  },
  primary: {
    marginTop: 24,
    width: "100%",
    padding: "14px 0",
    background: "linear-gradient(135deg, #c9a961 0%, #a8873d 100%)",
    color: "#0f0f0f",
    border: "none",
    borderRadius: 3,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "opacity 0.2s",
  },
  row: {
    display: "flex",
    gap: 14,
    marginBottom: 0,
  },
  terms: {
    fontSize: 12,
    color: "rgba(255,255,255,0.35)",
    lineHeight: 1.6,
    margin: "18px 0 0 0",
  },
  termsLink: {
    color: "#c9a961",
    textDecoration: "none",
  },
  switchText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.4)",
    textAlign: "center" as const,
    marginTop: 20,
  },
  switchLink: {
    background: "none",
    border: "none",
    color: "#c9a961",
    fontSize: 13,
    cursor: "pointer",
    padding: 0,
    fontFamily: "inherit",
    textDecoration: "underline",
    textUnderlineOffset: 3,
  },
  backBtn: {
    marginTop: 16,
    background: "none",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 3,
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    letterSpacing: "0.1em",
    cursor: "pointer",
    padding: "12px 0",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontFamily: "inherit",
    transition: "border-color 0.2s, color 0.2s",
  },
};

/* ── SVG icons ───────────────────────────────────────────────────────────── */
function EyeOn() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function BackArrow() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
