import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLang } from "../contexts/LanguageContext";
import { ENDPOINTS, baseHeaders } from "../config/api";

const GREEN = "#22C55E";

/* Set this to your real Google OAuth Web Client ID (Google Cloud Console →
   APIs & Services → Credentials). Without it the Google button is disabled. */
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

type Mode = "login" | "register";

function Field({
  label, type = "text", value, onChange, placeholder, autoComplete,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; autoComplete?: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.75)", marginBottom: 7 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", boxSizing: "border-box",
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 9, padding: "11px 13px", color: "#fff", fontSize: 14,
          fontFamily: "'Inter',sans-serif", outline: "none", transition: "border-color .15s",
        }}
        onFocus={e => (e.currentTarget.style.borderColor = `${GREEN}80`)}
        onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
      />
    </div>
  );
}

export function LoginPage() {
  const { loginWithPassword, registerWithPassword, loginWithGoogle, loginWithTokens } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [mode, setMode] = useState<Mode>(searchParams.get("mode") === "register" ? "register" : "login");

  // Reacts to the header's Sign Up / Login links even when already sitting on /login —
  // React Router doesn't remount this component just because the query string changed,
  // so the initial useState above only runs once. This keeps mode in sync afterwards.
  useEffect(() => {
    setMode(searchParams.get("mode") === "register" ? "register" : "login");
  }, [searchParams]);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [tgStatus, setTgStatus] = useState<"idle" | "waiting" | "expired">("idle");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  // ─── Telegram login: create a one-time token, open the bot deep-link,
  // then poll until the person confirms inside Telegram. This is the flow
  // your backend already supports (CreateLoginTokenView / LoginTokenStatusView) —
  // NOT a Telegram Login Widget embed, and NOT the old broken /login-telegram route.
  const handleTelegramLogin = async () => {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(ENDPOINTS.loginToken, {
        method: "POST",
        headers: baseHeaders("en", { "Content-Type": "application/json" }),
      });
      if (!res.ok) {
        setBusy(false);
        setError("Couldn't start Telegram login. Try again.");
        return;
      }
      const { token, deep_link } = await res.json();
      window.open(deep_link, "_blank");
      setTgStatus("waiting");
      setBusy(false);

      let attempts = 0;
      pollRef.current = setInterval(async () => {
        attempts += 1;
        if (attempts > 60) { // ~2 minutes at 2s interval
          if (pollRef.current) clearInterval(pollRef.current);
          setTgStatus("expired");
          return;
        }
        try {
          const statusRes = await fetch(ENDPOINTS.loginTokenStatus(token), {
            headers: baseHeaders("en"),
          });
          if (statusRes.status === 404) {
            if (pollRef.current) clearInterval(pollRef.current);
            setTgStatus("expired");
            return;
          }
          const data = await statusRes.json();
          if (data.status === "confirmed") {
            if (pollRef.current) clearInterval(pollRef.current);
            loginWithTokens(data.access, data.refresh, data.user);
            navigate("/profile");
          }
        } catch {
          /* network hiccup — keep polling, don't kill the flow over one failed check */
        }
      }, 2000);
    } catch {
      setBusy(false);
      setError("Network error. Check your connection.");
    }
  };
  const [googleReady, setGoogleReady] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  // Load Google Identity Services script once, if a client ID is configured.
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => setGoogleReady(true);
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleGoogleCredential = async (resp: { credential: string }) => {
    setBusy(true);
    setError(null);
    const r = await loginWithGoogle(resp.credential);
    setBusy(false);
    if (r.ok) navigate("/profile");
    else setError(r.error || "Google login failed.");
  };

  // Render Google's own button once the script is loaded — this is the
  // officially recommended flow. Unlike google.accounts.id.prompt() (One Tap),
  // it doesn't depend on the flaky /gsi/status check that 403s under
  // third-party-cookie blocking, private browsing, or right after a client ID
  // was just created (origin propagation can take a few minutes to hours).
  useEffect(() => {
    if (!googleReady || !GOOGLE_CLIENT_ID || !(window as any).google || !googleBtnRef.current) return;
    (window as any).google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,
    });
    const width = Math.min(400, googleBtnRef.current.offsetWidth || 320);
    (window as any).google.accounts.id.renderButton(googleBtnRef.current, {
      theme: "filled_black",
      size: "large",
      shape: "pill",
      width,
      text: "continue_with",
    });
  }, [googleReady]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const result = mode === "login"
      ? await loginWithPassword(email, password)
      : await registerWithPassword(fullname, email, password);

    setBusy(false);
    if (result.ok) navigate("/profile");
    else setError(result.error || "Something went wrong.");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060606", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 20px 40px", fontFamily: "'Inter',sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".2em", textTransform: "uppercase", color: GREEN, marginBottom: 10 }}>
          {t.loginTag}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>
          {mode === "login" ? t.loginWelcome : t.registerTitle}
        </h1>
        <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.42)", margin: "0 0 28px", lineHeight: 1.6 }}>
          {mode === "login" ? t.loginSub : t.registerSub}
        </p>

        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 26 }}>
          <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 4, marginBottom: 22 }}>
            <button
              type="button"
              onClick={() => { setMode("login"); setError(null); }}
              style={{
                flex: 1, padding: "9px 0", borderRadius: 7, border: "none", cursor: "pointer",
                fontSize: 12.5, fontWeight: 700, fontFamily: "'Montserrat',sans-serif",
                background: mode === "login" ? GREEN : "transparent",
                color: mode === "login" ? "#04120a" : "rgba(255,255,255,0.5)",
                transition: "all .15s",
              }}
            >
              {t.signIn}
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setError(null); }}
              style={{
                flex: 1, padding: "9px 0", borderRadius: 7, border: "none", cursor: "pointer",
                fontSize: 12.5, fontWeight: 700, fontFamily: "'Montserrat',sans-serif",
                background: mode === "register" ? GREEN : "transparent",
                color: mode === "register" ? "#04120a" : "rgba(255,255,255,0.5)",
                transition: "all .15s",
              }}
            >
              {t.signUp}
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === "register" && (
              <Field label={t.fieldFullName} value={fullname} onChange={setFullname} placeholder="Aziz Karimov" autoComplete="name" />
            )}
            <Field label={t.fieldEmail} type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email" />
            <Field
              label={t.fieldPassword}
              type="password"
              value={password}
              onChange={setPassword}
              placeholder={mode === "register" ? t.pwPlaceholderRegister : "••••••••"}
              autoComplete={mode === "register" ? "new-password" : "current-password"}
            />

            {error && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", fontSize: 12.5, borderRadius: 8, padding: "9px 12px", marginBottom: 16 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              style={{
                width: "100%", background: GREEN, color: "#04120a", border: "none",
                borderRadius: 9, padding: "12px 0", fontSize: 13.5, fontWeight: 800,
                cursor: busy ? "wait" : "pointer", opacity: busy ? 0.7 : 1,
                fontFamily: "'Montserrat',sans-serif", letterSpacing: ".02em",
              }}
            >
              {busy ? t.btnPleaseWait : mode === "login" ? t.btnSignIn : t.btnCreateAccount}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{t.orDivider}</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          {GOOGLE_CLIENT_ID ? (
            <div ref={googleBtnRef} style={{ display: "flex", justifyContent: "center", minHeight: 44, width: "100%", overflow: "hidden" }} />
          ) : (
            <button
              type="button"
              disabled
              title="Set VITE_GOOGLE_CLIENT_ID to enable Google sign-in"
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 9, padding: "11px 0", color: "#fff", fontSize: 13.5, fontWeight: 600,
                cursor: "not-allowed", opacity: 0.5,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.46c-.28 1.5-1.13 2.77-2.4 3.62v3h3.89c2.28-2.1 3.57-5.2 3.57-8.8z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.93l-3.89-3c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.95H1.26v3.1C3.24 21.3 7.32 24 12 24z" />
                <path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 010-4.54v-3.1H1.26a12 12 0 000 10.74l4.01-3.1z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.45-3.45C17.95 1.19 15.24 0 12 0 7.32 0 3.24 2.7 1.26 6.63l4.01 3.1C6.22 6.89 8.87 4.75 12 4.75z" />
              </svg>
              {t.continueGoogle}
            </button>
          )}

          <button
            type="button"
            onClick={handleTelegramLogin}
            disabled={busy || tgStatus === "waiting"}
            style={{
              marginTop: 10, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 9, padding: "11px 0", color: "#fff", fontSize: 13.5, fontWeight: 600,
              cursor: tgStatus === "waiting" ? "wait" : "pointer", boxSizing: "border-box",
            }}
          >
            {tgStatus === "waiting" ? t.tgWaiting : t.continueTelegram}
          </button>
          {tgStatus === "expired" && (
            <p style={{ fontSize: 12, color: "rgba(239,68,68,0.9)", textAlign: "center", margin: "8px 0 0" }}>
              {t.tgExpired}
            </p>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
          {mode === "login" ? (
            <>{t.noAccount}{" "}
              <button onClick={() => { setMode("register"); setError(null); }} style={{ background: "none", border: "none", color: GREEN, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                {t.signUp}
              </button>
            </>
          ) : (
            <>{t.haveAccount}{" "}
              <button onClick={() => { setMode("login"); setError(null); }} style={{ background: "none", border: "none", color: GREEN, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                {t.signIn}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;