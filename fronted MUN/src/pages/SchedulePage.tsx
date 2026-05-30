import { useState, useEffect } from "react";

const scheduleData = [
    { time: "08:00", end: "09:00", title: "REGISTRATION", desc: "Delegate check-in and welcome kit distribution.", type: "registration", icon: "🕒" },
    { time: "09:10", end: "09:40", title: "OPENING CEREMONY", desc: "Official launch and keynote addresses.", type: "ceremony", icon: "🏅" },
    { time: "10:00", end: "12:00", title: "1ST COMMITTEE SESSION", desc: "Debate begins and agenda setting.", type: "session", icon: "👥" },
    { time: "12:00", end: "13:00", title: "LUNCH BREAK", desc: "Networking and rest.", type: "break", icon: "☕" },
    { time: "13:00", end: "15:00", title: "2ND COMMITTEE SESSION", desc: "Moderated and unmoderated caucuses.", type: "session", icon: "👥" },
    { time: "15:00", end: "15:20", title: "COFFEE BREAK", desc: "Short recess before final session.", type: "break", icon: "☕" },
    { time: "15:20", end: "17:00", title: "3RD COMMITTEE SESSION", desc: "Working papers, amendments, and voting procedures.", type: "session", icon: "👥" },
    { time: "17:00", end: "18:00", title: "AWARD CEREMONY", desc: "Recognition of best delegates and closing remarks.", type: "ceremony", icon: "🏅" },
    { time: "18:00", end: "19:00", title: "SOCIAL EVENT", desc: "Networking gala and farewell gathering.", type: "social", icon: "🎉" },
];

const typeConfig = {
    registration: { color: "rgba(34,197,94,0.22)", label: "REGISTRATION" },
    ceremony: { color: "#FACC15", label: "CEREMONY" },
    session: { color: "#60A5FA", label: "SESSION" },
    break: { color: "#4ADE80", label: "BREAK" },
    social: { color: "#C084FC", label: "SOCIAL" },
};

export function SchedulePage() {
    const [active, setActive] = useState("all");
    const [isMobile, setIsMobile] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const filtered = active === "all"
        ? scheduleData
        : scheduleData.filter(i => i.type === active);

    return (
        <div style={{
            minHeight: "100vh",
            background: "#080808",
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            color: "#fff",
            position: "relative",
            overflowX: "hidden",
        }}>
            {/* Green glow top-left */}
            <div style={{
                position: "fixed",
                top: -200, left: -200,
                width: isMobile ? 500 : 900,
                height: isMobile ? 500 : 900,
                borderRadius: "50%",
                background: "radial-gradient(ellipse at center, rgba(34,197,94,0.38) 0%, rgba(22,163,74,0.22) 30%, rgba(16,185,129,0.08) 60%, transparent 75%)",
                pointerEvents: "none",
                zIndex: 0,
            }} />

            {/* Nav */}
            <nav style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
                background: "rgba(8,8,8,0.90)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                padding: isMobile ? "0 20px" : "0 40px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                height: 60,
            }}>
                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: "50%",
                        border: "1.5px solid rgba(255,255,255,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, fontWeight: 800,
                    }}>T</div>
                    <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: "0.1em" }}>Yashil Qo'llar MUN</span>
                </div>

                {/* Desktop nav links */}
                {!isMobile && (
                    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                        {["HOME", "ABOUT", "COMMITTEES", "TEAM", "SCHEDULE", "REGISTER NOW", "SPONSORS", "CONTACT"].map(item => (
                            <span key={item} style={{
                                fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                                color: item === "SCHEDULE" ? "#F97316" : "rgba(255,255,255,0.5)",
                                cursor: "pointer",
                                borderBottom: item === "SCHEDULE" ? "2px solid #F97316" : "2px solid transparent",
                                paddingBottom: 2,
                                whiteSpace: "nowrap",
                            }}>{item}</span>
                        ))}
                    </div>
                )}

                {/* Right side */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {!isMobile && (
                        <button style={{
                            background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
                            color: "#fff", padding: "5px 14px", borderRadius: 6,
                            fontSize: 11, fontWeight: 700, cursor: "pointer",
                        }}>RU</button>
                    )}
                    <button style={{
                        background: "#F97316", border: "none",
                        color: "#fff", padding: "8px 14px", borderRadius: 7,
                        fontSize: 11, fontWeight: 800, letterSpacing: "0.05em", cursor: "pointer",
                        whiteSpace: "nowrap",
                    }}>REGISTER NOW</button>
                    {/* Mobile hamburger */}
                    {isMobile && (
                        <button
                            onClick={() => setMenuOpen(o => !o)}
                            style={{
                                background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
                                color: "#fff", borderRadius: 6, padding: "6px 10px",
                                fontSize: 16, cursor: "pointer", lineHeight: 1,
                            }}>☰</button>
                    )}
                </div>
            </nav>

            {/* Mobile dropdown menu */}
            {isMobile && menuOpen && (
                <div style={{
                    position: "fixed", top: 60, left: 0, right: 0, zIndex: 49,
                    background: "rgba(10,10,10,0.97)",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    padding: "16px 20px",
                    display: "flex", flexDirection: "column", gap: 14,
                }}>
                    {["HOME", "ABOUT", "COMMITTEES", "TEAM", "SCHEDULE", "REGISTER NOW", "SPONSORS", "CONTACT"].map(item => (
                        <span key={item} onClick={() => setMenuOpen(false)} style={{
                            fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
                            color: item === "SCHEDULE" ? "#F97316" : "rgba(255,255,255,0.6)",
                            cursor: "pointer",
                        }}>{item}</span>
                    ))}
                </div>
            )}

            {/* Main content */}
            <main style={{
                position: "relative", zIndex: 1,
                paddingTop: isMobile ? 80 : 96,
                paddingBottom: 80,
                paddingLeft: isMobile ? 16 : "clamp(32px, 6vw, 100px)",
                paddingRight: isMobile ? 16 : "clamp(32px, 6vw, 100px)",
                maxWidth: 1200, margin: "0 auto",
            }}>
                {/* Header */}
                <div style={{ marginBottom: 28 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                        <span style={{ fontSize: 12 }}>📍</span>
                        <span style={{ color: "#22C55E", fontSize: 11, fontWeight: 800, letterSpacing: "0.22em" }}>
                            TASHKENT • July 21, 2026
                        </span>
                    </div>
                    <h1 style={{
                        fontSize: isMobile ? "clamp(28px, 9vw, 40px)" : "clamp(36px, 5vw, 62px)",
                        fontWeight: 900, letterSpacing: "-0.02em",
                        textTransform: "uppercase", margin: 0,
                        color: "#16f934", lineHeight: 1.05,
                    }}>CONFERENCE SCHEDULE</h1>
                </div>

                {/* Filter bar */}
                <div style={{
                    display: "flex", gap: 8, alignItems: "center",
                    marginBottom: 40, flexWrap: "wrap",
                }}>
                    <button onClick={() => setActive("all")} style={{
                        background: "#F97316", border: "none", color: "#fff",
                        padding: "8px 18px", borderRadius: 999,
                        fontSize: 11, fontWeight: 800, letterSpacing: "0.1em",
                        cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                    }}>
                        <span>+</span> July 21
                    </button>

                    {Object.entries(typeConfig).map(([key, cfg]) => (
                        <button key={key} onClick={() => setActive(active === key ? "all" : key)} style={{
                            background: active === key ? `${cfg.color}20` : "rgba(255,255,255,0.04)",
                            border: `1px solid ${active === key ? cfg.color + "55" : "rgba(255,255,255,0.1)"}`,
                            color: active === key ? cfg.color : "rgba(255,255,255,0.55)",
                            padding: "6px 13px", borderRadius: 999,
                            fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                        }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, display: "inline-block" }} />
                            {cfg.label}
                        </button>
                    ))}
                </div>

                {/* Timeline */}
                <div style={{ position: "relative" }}>
                    {/* Vertical line */}
                    <div style={{
                        position: "absolute",
                        left: 22, top: 28, bottom: 28,
                        width: 1,
                        background: "rgba(255,255,255,0.08)",
                    }} />

                    <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 20 : 28 }}>
                        {filtered.map((item, i) => {
                            const cfg = typeConfig[item.type];
                            const num = String(scheduleData.indexOf(item) + 1).padStart(2, "0");
                            return (
                                <div key={i} style={{ display: "flex", alignItems: "flex-start", position: "relative" }}>

                                    {/* Circle icon */}
                                    <div style={{
                                        width: 44, height: 44, flexShrink: 0,
                                        borderRadius: "50%", background: "#111",
                                        border: `2px solid ${cfg.color}`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: isMobile ? 15 : 18,
                                        boxShadow: `0 0 16px ${cfg.color}30`,
                                        zIndex: 2, position: "relative",
                                    }}>
                                        {item.icon}
                                    </div>

                                    {/* Time block — hidden on very small screens */}
                                    {!isMobile && (
                                        <div style={{
                                            width: 80, flexShrink: 0,
                                            paddingLeft: 14, paddingTop: 12,
                                        }}>
                                            <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>{item.time}</div>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.32)", marginTop: 3 }}>{item.end}</div>
                                        </div>
                                    )}

                                    {/* Colored bar */}
                                    <div style={{
                                        width: 3, alignSelf: "stretch", minHeight: isMobile ? 60 : 72,
                                        background: cfg.color, borderRadius: 2,
                                        margin: isMobile ? "6px 10px 6px 8px" : "8px 16px 8px 0",
                                        flexShrink: 0, opacity: 0.85,
                                    }} />

                                    {/* Card */}
                                    <div
                                        style={{
                                            flex: 1, background: "#111",
                                            border: "1px solid rgba(255,255,255,0.07)",
                                            borderRadius: isMobile ? 10 : 12,
                                            padding: isMobile ? "12px 14px" : "16px 22px",
                                            position: "relative", transition: "border-color 0.2s",
                                            minWidth: 0,
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = `${cfg.color}45`}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
                                    >
                                        {/* Number top-right */}
                                        <div style={{
                                            position: "absolute", top: isMobile ? 10 : 16, right: isMobile ? 12 : 20,
                                            fontSize: 12, fontWeight: 800, color: cfg.color, opacity: 0.6,
                                        }}>{num}</div>

                                        {/* Mobile: time shown inside card */}
                                        {isMobile && (
                                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 700, marginBottom: 6 }}>
                                                {item.time} – {item.end}
                                            </div>
                                        )}

                                        {/* Tag badge */}
                                        <span style={{
                                            display: "inline-block",
                                            background: `${cfg.color}18`, color: cfg.color,
                                            border: `1px solid ${cfg.color}35`,
                                            padding: "2px 10px", borderRadius: 5,
                                            fontSize: 9, fontWeight: 800, letterSpacing: "0.12em",
                                            marginBottom: 6, textTransform: "uppercase",
                                        }}>{cfg.label}</span>

                                        {/* Title */}
                                        <h3 style={{
                                            margin: 0, marginBottom: 4,
                                            fontSize: isMobile ? 13 : 17,
                                            fontWeight: 900, letterSpacing: "-0.01em",
                                            textTransform: "uppercase", color: "#fff",
                                            paddingRight: 28,
                                        }}>{item.title}</h3>

                                        {/* Desc */}
                                        <p style={{
                                            margin: 0, fontSize: isMobile ? 12 : 13,
                                            color: "rgba(255,255,255,0.42)", lineHeight: 1.5,
                                        }}>{item.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}
