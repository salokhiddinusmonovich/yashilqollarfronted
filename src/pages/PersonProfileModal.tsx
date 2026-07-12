import { useState, useEffect } from "react";
import { ENDPOINTS, baseHeaders, fixMediaUrl } from "../config/api";

export interface PublicProfile {
  id: number; fullname: string; photo: string | null; role: string; role_display: string;
  username: string | null; experience: string | null;
}

/**
 * Единый профиль для всего сайта — один и тот же вид для автора статьи,
 * комментатора, участника региональной команды. Открывается по id,
 * сам делает запрос на /users/<id>/profile/.
 */
export function PersonProfileModal({ userId, onClose }: { userId: number; onClose: () => void }) {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setProfile(null);
    setError(false);
    fetch(ENDPOINTS.userProfile(userId), { headers: baseHeaders("en") })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(setProfile)
      .catch(() => setError(true));
  }, [userId]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.78)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#0f0f0f", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 20, padding: "30px 30px 26px", width: "100%", maxWidth: 420 }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 14 }}>✕</button>
        </div>

        {error && <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textAlign: "center" }}>Couldn't load this profile.</p>}

        {!error && !profile && (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", border: "3px solid rgba(34,197,94,0.15)", borderTopColor: "#22c55e", animation: "yq-profile-spin .8s linear infinite" }} />
            <style>{`@keyframes yq-profile-spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {profile && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
              <div style={{
                width: 88, height: 88, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
                background: "rgba(34,197,94,0.15)", border: "2px solid rgba(34,197,94,0.45)",
                boxShadow: "0 0 30px rgba(34,197,94,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#22c55e", fontWeight: 800, fontSize: 28,
              }}>
                {profile.photo
                  ? <img src={fixMediaUrl(profile.photo) || ""} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  : profile.fullname.split(" ").filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <h2 style={{ margin: "0 0 8px", fontSize: 19, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{profile.fullname}</h2>
                <span style={{ display: "inline-block", fontSize: 10.5, fontWeight: 800, color: "#22c55e", textTransform: "uppercase", letterSpacing: ".06em", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 999, padding: "4px 11px" }}>
                  {profile.role_display}
                </span>
              </div>
            </div>

            {profile.experience && (
              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 22px" }}>{profile.experience}</p>
            )}

            {profile.username ? (
              <a
                href={`https://t.me/${profile.username.replace(/^@/, "")}`}
                target="_blank" rel="noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  width: "100%", boxSizing: "border-box",
                  background: "#22c55e", color: "#04120a", fontWeight: 800, fontSize: 13,
                  padding: "13px 0", borderRadius: 10, textDecoration: "none",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                Message on Telegram
              </a>
            ) : (
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>No Telegram username on file.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}