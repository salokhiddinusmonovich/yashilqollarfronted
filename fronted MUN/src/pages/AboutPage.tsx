import { useState, useEffect, useRef } from "react";
import logoImg from "./photo_2025-10-08_22-18-51.jpg";

const GREEN = "#22C55E";
const GREEN_DIM = "#16A34A";
const ORANGE = "#F97316";

const stats = [
    { value: "250+", label: "DELEGATES" },
    { value: "15+", label: "COUNTRIES" },
    { value: "8", label: "COMMITTEES" },
    { value: "1", label: "DAY OF DIPLOMACY" },
];

const pillars = [
    { icon: "🌍", title: "GLOBAL PERSPECTIVE", desc: "Delegates represent nations from every corner of the world, debating issues that shape humanity's future." },
    { icon: "🎓", title: "ACADEMIC EXCELLENCE", desc: "Rigorous research, structured debate, and resolution drafting develop real diplomatic skills." },
    { icon: "🤝", title: "LEADERSHIP NETWORK", desc: "Build lifelong connections with driven peers, mentors, and future decision-makers." },
];

function StatCard({ stat }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: "#111",
                border: `1px solid ${hovered ? GREEN + "50" : "rgba(255,255,255,0.07)"}`,
                borderRadius: 16, padding: "32px 28px",
                transition: "border-color 0.2s, transform 0.2s",
                transform: hovered ? "translateY(-3px)" : "translateY(0)",
                position: "relative", overflow: "hidden",
            }}
        >
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: hovered ? `linear-gradient(90deg, transparent, ${GREEN}, transparent)` : "transparent",
                transition: "background 0.3s",
            }} />
            <div style={{ fontSize: 36, fontWeight: 900, color: GREEN, lineHeight: 1, marginBottom: 8 }}>{stat.value}</div>
            <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.35)", letterSpacing: "0.2em", textTransform: "uppercase" }}>{stat.label}</div>
        </div>
    );
}

export function AboutPage() {
    const [isMobile, setIsMobile] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    return (
        <div style={{
            minHeight: "100vh", background: "#080808",
            fontFamily: "'Inter','Helvetica Neue',sans-serif",
            color: "#fff", position: "relative", overflowX: "hidden",
        }}>
            {/* Green glow top-left */}
            <div style={{
                position: "fixed", top: -200, left: -200,
                width: 900, height: 900, borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(34,197,94,0.22) 0%, rgba(22,163,74,0.10) 35%, transparent 68%)",
                pointerEvents: "none", zIndex: 0,
            }} />
            <div style={{
                position: "fixed", bottom: -200, right: -200,
                width: 600, height: 600, borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(34,197,94,0.08) 0%, transparent 70%)",
                pointerEvents: "none", zIndex: 0,
            }} />

            {/* Nav */}
            <nav style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
                background: "rgba(8,8,8,0.90)", backdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                padding: isMobile ? "0 20px" : "0 40px",
                display: "flex", alignItems: "center", justifyContent: "space-between", height: 60,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>T</div>
                    <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: "0.1em" }}>Yashil Qo'llar MUN</span>
                </div>
                {!isMobile && (
                    <div style={{ display: "flex", gap: 24 }}>
                        {["HOME", "ABOUT", "COMMITTEES", "TEAM", "SCHEDULE", "REGISTER NOW", "SPONSORS", "CONTACT"].map(item => (
                            <span key={item} style={{
                                fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer",
                                color: item === "ABOUT" ? ORANGE : "rgba(255,255,255,0.5)",
                                borderBottom: item === "ABOUT" ? `2px solid ${ORANGE}` : "2px solid transparent",
                                paddingBottom: 2, whiteSpace: "nowrap",
                            }}>{item}</span>
                        ))}
                    </div>
                )}
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    {!isMobile && <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "5px 14px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>RU</button>}
                    <button style={{ background: ORANGE, border: "none", color: "#fff", padding: "8px 14px", borderRadius: 7, fontSize: 11, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" }}>REGISTER NOW</button>
                    {isMobile && <button onClick={() => setMenuOpen(o => !o)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", borderRadius: 6, padding: "6px 10px", fontSize: 16, cursor: "pointer" }}>☰</button>}
                </div>
            </nav>
            {isMobile && menuOpen && (
                <div style={{ position: "fixed", top: 60, left: 0, right: 0, zIndex: 49, background: "rgba(10,10,10,0.97)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
                    {["HOME", "ABOUT", "COMMITTEES", "TEAM", "SCHEDULE", "REGISTER NOW", "SPONSORS", "CONTACT"].map(item => (
                        <span key={item} onClick={() => setMenuOpen(false)} style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: item === "ABOUT" ? ORANGE : "rgba(255,255,255,0.6)", cursor: "pointer" }}>{item}</span>
                    ))}
                </div>
            )}

            <main style={{
                position: "relative", zIndex: 1,
                paddingTop: isMobile ? 80 : 100,
                paddingBottom: 100,
                paddingLeft: isMobile ? 16 : "clamp(32px, 5vw, 80px)",
                paddingRight: isMobile ? 16 : "clamp(32px, 5vw, 80px)",
                maxWidth: 1280, margin: "0 auto",
            }}>

                {/* Hero section */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: isMobile ? 48 : 72,
                    alignItems: "start",
                    marginBottom: isMobile ? 64 : 100,
                }}>
                    {/* Left */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                            <div style={{ width: 24, height: 2, background: GREEN, borderRadius: 2 }} />
                            <span style={{ color: GREEN, fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase" }}>About the Conference</span>
                        </div>
                        <h1 style={{
                            margin: 0, fontWeight: 900, textTransform: "uppercase",
                            fontSize: isMobile ? "clamp(36px,10vw,52px)" : "clamp(44px,5.5vw,72px)",
                            lineHeight: 0.92, letterSpacing: "-0.03em", marginBottom: 28,
                        }}>
                            <span style={{ color: "#fff" }}>WHERE FUTURE<br /></span>
                            <span style={{ color: GREEN }}>LEADERS</span>
                            <span style={{ color: "#fff" }}><br />ARE BORN.</span>
                        </h1>
                        <p style={{ fontSize: isMobile ? 15 : 17, color: "rgba(255,255,255,0.45)", lineHeight: 1.75, maxWidth: 480, marginBottom: 36 }}>
                            Yashil Qo'llar MUN is a premier youth-led simulation of the United Nations — an elite platform for the next generation of global leaders, diplomats, and innovators tackling the most pressing challenges of our era.
                        </p>
                        <a href="#" style={{
                            display: "inline-block",
                            background: GREEN, color: "#000",
                            padding: "13px 28px", borderRadius: 10,
                            fontSize: 12, fontWeight: 900, letterSpacing: "0.12em",
                            textTransform: "uppercase", textDecoration: "none",
                            boxShadow: `0 0 40px ${GREEN}30`,
                        }}>REGISTER NOW →</a>
                    </div>

                    {/* Right — stats */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{
                            display: "grid", gridTemplateColumns: "1fr 1fr",
                            gap: 12,
                        }}>
                            {stats.map((stat, i) => <StatCard key={i} stat={stat} />)}
                        </div>

                        {/* Logo card */}
                        <div style={{
                            background: "#111",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: 16,
                            padding: "40px 28px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: 160,
                            position: "relative",
                            overflow: "hidden",
                        }}>
                            {/* Ambient Background Glow */}
                            <div style={{
                                position: "absolute",
                                inset: 0,
                                background: `radial-gradient(ellipse at 50% 50%, ${GREEN}0a 0%, transparent 70%)`,
                            }} />

                            {/* Circular Logo Container */}
                            <div style={{
                                width: 80,
                                height: 80,
                                borderRadius: "50%",
                                border: `2px solid ${GREEN}40`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                                zIndex: 1,
                                overflow: "hidden", // Keeps the image inside the circle
                            }}>
                                <img
                                    src={logoImg}
                                    alt="Logo"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover", // Prevents stretching
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: isMobile ? 48 : 80 }} />

                {/* Pillars */}
                <div style={{ marginBottom: 80 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <div style={{ width: 20, height: 2, background: GREEN, borderRadius: 2 }} />
                        <span style={{ color: GREEN, fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase" }}>Our Values</span>
                    </div>
                    <h2 style={{ margin: "0 0 40px", fontWeight: 900, textTransform: "uppercase", fontSize: isMobile ? 24 : 32, color: "#fff", letterSpacing: "-0.02em" }}>
                        WHAT DRIVES US
                    </h2>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                        gap: 16,
                    }}>
                        {pillars.map((p, i) => {
                            const [hov, setHov] = useState(false);
                            return (
                                <div key={i}
                                    onMouseEnter={() => setHov(true)}
                                    onMouseLeave={() => setHov(false)}
                                    style={{
                                        background: "#111",
                                        border: `1px solid ${hov ? GREEN + "45" : "rgba(255,255,255,0.07)"}`,
                                        borderRadius: 16, padding: "28px 24px",
                                        transition: "border-color 0.2s, transform 0.2s",
                                        transform: hov ? "translateY(-3px)" : "translateY(0)",
                                    }}>
                                    <div style={{ fontSize: 28, marginBottom: 16 }}>{p.icon}</div>
                                    <div style={{ fontSize: 13, fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>{p.title}</div>
                                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.65 }}>{p.desc}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA strip */}
                <div style={{
                    background: "#111",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 20, padding: isMobile ? "32px 24px" : "44px 52px",
                    display: "flex", flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "center",
                    justifyContent: "space-between", gap: 24,
                    position: "relative", overflow: "hidden",
                }}>
                    <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(ellipse, ${GREEN}10 0%, transparent 70%)`, pointerEvents: "none" }} />
                    <div>
                        <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 900, textTransform: "uppercase", color: "#fff", letterSpacing: "-0.02em", marginBottom: 8 }}>
                            READY TO <span style={{ color: GREEN }}>LEAD?</span>
                        </div>
                        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.38)" }}>
                            July 21, 2026 · Tashkent State University of Economics
                        </div>
                    </div>
                    <button style={{
                        background: GREEN, border: "none", color: "#000",
                        padding: "14px 32px", borderRadius: 10,
                        fontSize: 12, fontWeight: 900, letterSpacing: "0.12em",
                        textTransform: "uppercase", cursor: "pointer", flexShrink: 0,
                        boxShadow: `0 0 32px ${GREEN}30`,
                    }}>REGISTER NOW →</button>
                </div>

            </main>
        </div>
    );
}