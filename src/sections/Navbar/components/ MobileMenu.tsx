import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useLang, Lang } from "../../../contexts/LanguageContext";
import { fixMediaUrl } from "../../../config/api";

const GREEN = "#22C55E";

const NAV_LINKS = [
    { to: "/", label: "Home", end: true },
    { to: "/about", label: "About" },
    { to: "/blog", label: "Blog" },
    { to: "/team", label: "Team" },
    { to: "/sponsors", label: "Sponsors" },
    { to: "/contact", label: "Contact" },
];

const LANGS: { code: Lang; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "ru", label: "RU" },
    { code: "uz", label: "UZ" },
];

export const MobileMenu = ({ onClose }: { onClose: () => void }) => {
    const { user, isLoggedIn, logout } = useAuth();
    const { lang, setLang } = useLang();
    const navigate = useNavigate();

    const initials = isLoggedIn && user
        ? user.fullname.split(" ").filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase()
        : "";
    const photoUrl = isLoggedIn && user ? fixMediaUrl(user.photo) : null;

    return (
        <div style={{
            position: "fixed", top: 56, left: 0, right: 0, zIndex: 999,
            background: "#0a0a0a", borderBottom: "1px solid rgba(34,197,94,0.2)",
            maxHeight: "calc(100vh - 56px)", overflowY: "auto",
            animation: "yq-menuDrop .22s cubic-bezier(.16,1,.3,1)",
        }}>
            <style>{`@keyframes yq-menuDrop { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

            {/* ── PROFILE / LOGIN ── */}
            <div style={{ padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {isLoggedIn && user ? (
                    <>
                        <Link to="/profile" onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: "50%", flexShrink: 0, overflow: "hidden",
                                background: GREEN, border: `1.5px solid ${GREEN}80`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 16, fontWeight: 800, color: "#04140a",
                            }}>
                                {photoUrl ? <img src={photoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>{user.fullname}</div>
                                <div style={{ fontSize: 11, color: GREEN, fontWeight: 600 }}>{user.rank}</div>
                            </div>
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: ".05em" }}>DASHBOARD →</span>
                        </Link>
                        <button
                            onClick={() => { logout(); onClose(); navigate("/"); }}
                            style={{
                                marginTop: 12, width: "100%", padding: "9px", background: "rgba(239,68,68,0.08)",
                                border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", borderRadius: 9,
                                fontSize: 12, fontWeight: 600, cursor: "pointer",
                            }}
                        >
                            🚪 Sign out
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login" onClick={onClose}
                        style={{
                            display: "block", textAlign: "center", padding: "12px", background: GREEN,
                            color: "#000", borderRadius: 10, fontSize: 12, fontWeight: 800,
                            letterSpacing: ".08em", textTransform: "uppercase", textDecoration: "none",
                            fontFamily: "'Montserrat',sans-serif",
                        }}
                    >
                        Login →
                    </Link>
                )}
            </div>

            {/* ── NAV LINKS ── */}
            <nav style={{ padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {NAV_LINKS.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={onClose}
                        style={({ isActive }) => ({
                            display: "block", padding: "12px 14px", borderRadius: 9,
                            fontSize: 14, fontWeight: 600, textDecoration: "none",
                            color: isActive ? GREEN : "rgba(255,255,255,0.7)",
                            background: isActive ? "rgba(34,197,94,0.08)" : "transparent",
                        })}
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* ── LANGUAGE ── */}
            <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>Language</span>
                <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9, padding: 3 }}>
                    {LANGS.map(l => (
                        <button
                            key={l.code}
                            onClick={() => setLang(l.code)}
                            style={{
                                padding: "6px 12px", borderRadius: 7, border: "none", cursor: "pointer",
                                background: lang === l.code ? GREEN : "transparent",
                                color: lang === l.code ? "#000" : "rgba(255,255,255,0.5)",
                                fontSize: 11, fontWeight: 800, fontFamily: "'Montserrat',sans-serif",
                            }}
                        >
                            {l.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};