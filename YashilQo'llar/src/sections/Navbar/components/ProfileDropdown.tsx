import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

const GREEN = "#22C55E";
const ROLE_COLOR: Record<string, string> = {
    Organizer: "#f97316",
    Researcher: "#38bdf8",
    Volunteer: "#22c55e",
    Admin: "#a78bfa",
};

function Avatar({ initials, size = 34, color = GREEN }: { initials: string; size?: number; color?: string }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: "50%",
            background: `${color}1a`, border: `1.5px solid ${color}55`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: size * 0.32, fontWeight: 800, color,
            flexShrink: 0, fontFamily: "'Inter',sans-serif", letterSpacing: ".02em",
        }}>
            {initials}
        </div>
    );
}

function StatBox({ icon, val, lbl }: { icon: string; val: string | number; lbl: string }) {
    return (
        <div style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            padding: "10px 8px", background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10,
        }}>
            <span style={{ fontSize: 17, lineHeight: 1, marginBottom: 4 }}>{icon}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                {typeof val === "number" ? val.toLocaleString() : val}
            </span>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.32)", marginTop: 3, letterSpacing: ".08em", textTransform: "uppercase" }}>{lbl}</span>
        </div>
    );
}

export function ProfileDropdown() {
    const { user, logout, isLoggedIn } = useAuth();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener("mousedown", fn);
        return () => document.removeEventListener("mousedown", fn);
    }, []);

    if (!isLoggedIn || !user) {
        return (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Link to="/login" style={{
                    background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    padding: "7px 16px", borderRadius: 8,
                    fontSize: 11, fontWeight: 700, letterSpacing: ".1em",
                    textDecoration: "none", fontFamily: "'Montserrat',sans-serif",
                    transition: "all .2s",
                }}>
                    LOGIN
                </Link>
                <Link to="/register" style={{
                    background: GREEN, color: "#000", border: "none",
                    padding: "8px 16px", borderRadius: 8,
                    fontSize: 11, fontWeight: 800, letterSpacing: ".08em",
                    textDecoration: "none", fontFamily: "'Montserrat',sans-serif",
                    boxShadow: "0 0 16px rgba(34,197,94,0.3)",
                }}>
                    JOIN →
                </Link>
            </div>
        );
    }

    const rc = ROLE_COLOR[user.role] || GREEN;

    return (
        <div ref={ref} style={{ position: "relative", zIndex: 100 }}>
            {/* Trigger */}
            <button onClick={() => setOpen(o => !o)} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: open ? "rgba(34,197,94,0.09)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${open ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 10, padding: "5px 10px 5px 6px",
                cursor: "pointer", transition: "all .2s",
                boxShadow: open ? "0 0 20px rgba(34,197,94,0.12)" : "none",
            }}>
                <Avatar initials={user.avatar} size={30} color={rc} />
                <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "'Inter',sans-serif", lineHeight: 1.2 }}>
                        {user.name.split(" ")[0]}
                    </div>
                    <div style={{ fontSize: 9, color: rc, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>
                        {user.role}
                    </div>
                </div>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none"
                    style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .22s", marginLeft: 2, flexShrink: 0 }}>
                    <path d="M1 1l4 4 4-4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {/* Panel */}
            {open && (
                <div style={{
                    position: "absolute", top: "calc(100% + 12px)", right: 0,
                    width: 300, background: "#0d0d0d",
                    border: "1px solid rgba(34,197,94,0.2)",
                    borderRadius: 18, overflow: "hidden",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(34,197,94,0.04)",
                    animation: "dropIn .2s cubic-bezier(.16,1,.3,1)",
                }}>
                    <style>{`
            @keyframes dropIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
            .pd-link:hover { background: rgba(34,197,94,0.08) !important; color: #fff !important; }
            .pd-link-danger:hover { background: rgba(239,68,68,0.08) !important; color: #f87171 !important; }
          `}</style>

                    {/* Top green shimmer */}
                    <div style={{ height: 2, background: `linear-gradient(90deg,transparent,${GREEN}70,transparent)` }} />

                    {/* Header */}
                    <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                            <Avatar initials={user.avatar} size={50} color={rc} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 2, fontFamily: "'Inter',sans-serif" }}>
                                    {user.name}
                                </div>
                                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>@{user.username}</div>
                                <div style={{ display: "flex", gap: 5 }}>
                                    <span style={{
                                        fontSize: 9, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase",
                                        padding: "3px 8px", borderRadius: 5,
                                        background: `${rc}15`, color: rc, border: `1px solid ${rc}30`,
                                    }}>{user.role}</span>
                                    <span style={{
                                        fontSize: 9, fontWeight: 600, letterSpacing: ".06em",
                                        padding: "3px 8px", borderRadius: 5,
                                        background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                    }}>📍 {user.region}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div style={{ display: "flex", gap: 6 }}>
                            <StatBox icon="🌳" val={user.treesPlanted} lbl="Trees" />
                            <StatBox icon="📋" val={user.projectsJoined} lbl="Projects" />
                            <StatBox icon="⭐" val={user.points.toLocaleString()} lbl="Points" />
                        </div>
                    </div>

                    {/* Badges */}
                    {user.badges.length > 0 && (
                        <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".16em", color: "rgba(255,255,255,0.22)", marginBottom: 8 }}>
                                BADGES
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                                {user.badges.map((b, i) => (
                                    <span key={i} style={{
                                        fontSize: 11, padding: "3px 9px", borderRadius: 20,
                                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                                        color: "rgba(255,255,255,0.55)",
                                    }}>{b}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Nav */}
                    <div style={{ padding: "8px" }}>
                        {[
                            { icon: "👤", label: "My Profile", to: "/profile" },
                            { icon: "📋", label: "My Projects", to: "/projects" },
                            { icon: "🏆", label: "Leaderboard", to: "/leaderboard" },
                            { icon: "⚙️", label: "Settings", to: "/settings" },
                        ].map(item => (
                            <Link key={item.to} to={item.to} onClick={() => setOpen(false)}
                                className="pd-link"
                                style={{
                                    display: "flex", alignItems: "center", gap: 11,
                                    padding: "10px 12px", borderRadius: 9,
                                    textDecoration: "none", color: "rgba(255,255,255,0.6)",
                                    fontSize: 13, fontWeight: 500, transition: "all .15s",
                                    fontFamily: "'Inter',sans-serif",
                                }}>
                                <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Divider + sign out */}
                    <div style={{ padding: "6px 8px 10px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <button
                            onClick={() => { logout(); setOpen(false); navigate("/"); }}
                            className="pd-link-danger"
                            style={{
                                width: "100%", display: "flex", alignItems: "center", gap: 11,
                                padding: "10px 12px", borderRadius: 9,
                                background: "transparent", border: "none",
                                color: "rgba(255,255,255,0.38)", fontSize: 13, fontWeight: 500,
                                cursor: "pointer", transition: "all .15s",
                                fontFamily: "'Inter',sans-serif",
                            }}>
                            <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>🚪</span>
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}