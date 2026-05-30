import { useState, useEffect } from "react";
import betrader from "/sponsors/btr.png";
import tdiu from "/sponsors/tdiu.png";
import tosh_eco_bosh_bosh from "/sponsors/tosh_sh_eco_bosh_bosh.png";




const GREEN = "#22C55E";
const ORANGE = "#F97316";

const stats = [
    { value: "3", label: "EXISTING SPONSORS" },
    { value: "5+", label: "CURRENT PARTNERS" },
    { value: "250+", label: "DELEGATE SEATING" },
    { value: "15+", label: "COUNTRIES" },
];

const partnerSections = [
    {
        badge: "MAIN PARTNERS", badgeColor: GREEN,
        desc: "Strategic partners powering Yashil Qo'llar MUN 2026.",
        partners: [
            { logoText: betrader, logoBg: "#060924", name: "Be Trader", desc: "Grand sponsor empowering youth development and financial literacy through educational initiatives.", type: "MAIN PARTNER" },
            { logoText: tdiu, logoBg: "#fff", logoTextColor: ORANGE, name: "Tashkent State University of Economics", desc: "Host university and academic foundation.", type: "MAIN PARTNER" },
            { logoText: tosh_eco_bosh_bosh, logoBg: "#060924", name: "Toshkent shahar Ekologiya va iqlim o'zgarishi bosh boshqarmasi", desc: "Official ecological partner supporting environmental sustainability and green initiatives across the capital.", type: "MAIN PARTNER" },
        ],
    },
    // {x
    //     badge: "ACADEMIC PARTNERS", badgeColor: "#f59e0b",
    //     desc: "Academic institutions supporting youth diplomacy.",
    //     partners: [
    //         { logoText: "🏛", logoBg: "#7b1a1a", name: "DATASHKENT", desc: "Education and digital training hub.", type: "ACADEMIC PARTNER" },
    //     ],
    // },
    // {
    //     badge: "INTERNATIONAL PARTNERS", badgeColor: "#60A5FA",
    //     desc: "International organisations elevating youth diplomacy globally.",
    //     partners: [
    //         { logoText: "UNODC", logoBg: "#1a3a5c", logoTextColor: "#60b3e0", name: "UNODC", desc: "United Nations Office on Drugs and Crime.", type: "INTERNATIONAL PARTNER" },
    //         { logoText: "🌐", logoBg: "#1a3a5c", name: "UNITED NATIONS", desc: "Global multilateral organisation.", type: "INTERNATIONAL PARTNER" },
    //     ],
    // },
];

const benefits = [
    "Logo on all conference materials",
    "Dedicated booth at the venue",
    "Social media coverage",
    "Access to delegate profiles",
    "Speaking opportunity",
];

function PartnerCard({ partner, accentColor, isMobile }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: "#111",
                border: `1px solid ${hovered ? accentColor + "55" : "rgba(255,255,255,0.07)"}`,
                borderRadius: 20,
                padding: isMobile ? 16 : 24,
                transition: "border-color 0.2s, transform 0.2s",
                transform: hovered ? "translateY(-3px)" : "translateY(0)",
                flex: isMobile ? "1 1 calc(50% - 10px)" : "0 0 300px",
                minWidth: isMobile ? "calc(50% - 10px)" : 300,
                maxWidth: isMobile ? "calc(50% - 10px)" : 300,
                position: "relative", overflow: "hidden",
                boxSizing: "border-box",
            }}
        >
            {/* Top shimmer on hover */}
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: hovered ? `linear-gradient(90deg, transparent, ${accentColor}, transparent)` : "transparent",
                transition: "background 0.3s",
            }} />

            {/* Logo area */}
            <div style={{
                width: "100%",
                height: isMobile ? 120 : 200,
                // У каждого партнера теперь свой фон. Если не задан — по дефолту белый.
                background: partner.logoBg || "#fff",
                borderRadius: 14,
                marginBottom: isMobile ? 14 : 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                boxSizing: "border-box",
                // Отступ настраивается индивидуально через данные (например, 8 для BTR, 0 для остальных)
                padding: partner.logoPadding !== undefined ? partner.logoPadding : 0,
            }}>
                {typeof partner.logoText === "string" && (partner.logoText.endsWith('.png') || partner.logoText.endsWith('.jpg') || partner.logoText.endsWith('.svg')) ? (
                    <img
                        src={partner.logoText}
                        alt={partner.name}
                        style={{
                            width: "100%",
                            height: "100%",
                            // Способ подгонки ('contain' или 'cover') берется из конфига партнера
                            objectFit: partner.logoFit || "contain"
                        }}
                    />
                ) : (
                    <span style={{
                        fontSize: isMobile
                            ? (partner.logoText?.length > 4 ? 16 : partner.logoText?.length > 2 ? 22 : 32)
                            : (partner.logoText?.length > 4 ? 24 : partner.logoText?.length > 2 ? 36 : 52),
                        fontWeight: 900,
                        color: partner.logoTextColor || "#000"
                    }}>
                        {partner.logoText}
                    </span>
                )}
            </div>

            {/* Name */}
            <div style={{
                fontSize: isMobile ? 12 : 16, fontWeight: 900, color: "#fff",
                textTransform: "uppercase", letterSpacing: "0.02em",
                lineHeight: 1.2, marginBottom: isMobile ? 6 : 8,
            }}>{partner.name}</div>

            {/* Desc */}
            <div style={{
                fontSize: isMobile ? 11 : 13,
                color: "rgba(255,255,255,0.38)", lineHeight: 1.6,
                marginBottom: isMobile ? 12 : 16,
            }}>{partner.desc}</div>

            {/* Badge */}
            <div style={{
                display: "inline-block",
                background: `${accentColor}18`, color: accentColor,
                border: `1px solid ${accentColor}40`,
                padding: isMobile ? "3px 10px" : "5px 14px",
                borderRadius: 7,
                fontSize: isMobile ? 8 : 10, fontWeight: 800, letterSpacing: "0.12em",
                textTransform: "uppercase",
            }}>{partner.type}</div>
        </div>
    );
}

export function SponsorsPage() {
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
                width: isMobile ? 500 : 900, height: isMobile ? 500 : 900,
                borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(34,197,94,0.22) 0%, rgba(22,163,74,0.10) 35%, transparent 68%)",
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
                            <span key={item} style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer", color: item === "SPONSORS" ? ORANGE : "rgba(255,255,255,0.5)", borderBottom: item === "SPONSORS" ? `2px solid ${ORANGE}` : "2px solid transparent", paddingBottom: 2, whiteSpace: "nowrap" }}>{item}</span>
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
                        <span key={item} onClick={() => setMenuOpen(false)} style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: item === "SPONSORS" ? ORANGE : "rgba(255,255,255,0.6)", cursor: "pointer" }}>{item}</span>
                    ))}
                </div>
            )}

            <main style={{
                position: "relative", zIndex: 1,
                paddingTop: isMobile ? 80 : 96, paddingBottom: 100,
                paddingLeft: isMobile ? 16 : "clamp(32px,5vw,80px)",
                paddingRight: isMobile ? 16 : "clamp(32px,5vw,80px)",
                maxWidth: 1280, margin: "0 auto",
            }}>

                {/* ── Header ── */}
                <div style={{ marginBottom: isMobile ? 32 : 48 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 24, height: 2, background: GREEN, borderRadius: 2 }} />
                        <span style={{ color: GREEN, fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase" }}>
                            Partners
                        </span>
                    </div>
                    <h1 style={{
                        margin: 0, fontWeight: 900, textTransform: "uppercase",
                        fontSize: isMobile ? "clamp(28px,9vw,40px)" : "clamp(36px,5vw,56px)",
                        color: GREEN, lineHeight: 1.05,
                    }}>OUR PARTNERS</h1>
                    <p style={{ margin: "12px 0 0", fontSize: isMobile ? 13 : 15, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
                        Together with our partners, we are building the next generation of global leaders.
                    </p>
                </div>

                {/* ── Stats bar ── */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${isMobile ? 2 : 4}, 1fr)`,
                    gap: isMobile ? 10 : 0,
                    background: "#111", border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 14, marginBottom: isMobile ? 40 : 64, overflow: "hidden",
                }}>
                    {stats.map((s, i) => (
                        <div key={i} style={{
                            padding: isMobile ? "18px 12px" : "24px 28px",
                            borderRight: i < stats.length - 1 && !isMobile ? "1px solid rgba(255,255,255,0.07)" : "none",
                            textAlign: "center",
                        }}>
                            <div style={{ fontSize: isMobile ? 22 : 32, fontWeight: 900, color: GREEN, lineHeight: 1 }}>{s.value}</div>
                            <div style={{ fontSize: isMobile ? 8 : 9, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 6 }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* ── Partner sections ── */}
                {partnerSections.map((section, si) => (
                    <div key={si} style={{ marginBottom: isMobile ? 40 : 60 }}>
                        {/* Section header */}
                        <div style={{
                            display: "flex", alignItems: "center",
                            flexWrap: isMobile ? "wrap" : "nowrap",
                            gap: isMobile ? 8 : 16, marginBottom: 24,
                        }}>
                            <span style={{
                                background: `${section.badgeColor}20`, color: section.badgeColor,
                                border: `1px solid ${section.badgeColor}50`,
                                padding: "5px 14px", borderRadius: 7,
                                fontSize: 10, fontWeight: 800, letterSpacing: "0.15em",
                                textTransform: "uppercase", whiteSpace: "nowrap",
                            }}>{section.badge}</span>
                            {!isMobile && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.28)" }}>{section.desc}</span>}
                            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)", minWidth: 20 }} />
                        </div>

                        {/* Cards — flex-wrap so they flow naturally on all sizes */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: isMobile ? 12 : 20 }}>
                            {section.partners.map((p, pi) => (
                                <PartnerCard key={pi} partner={p} accentColor={section.badgeColor} isMobile={isMobile} />
                            ))}
                        </div>
                    </div>
                ))}

                {/* ── Become a partner ── */}
                <div style={{
                    marginTop: isMobile ? 40 : 64,
                    borderTop: "1px solid rgba(255,255,255,0.07)",
                    paddingTop: isMobile ? 40 : 64,
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: isMobile ? 36 : 52,
                    alignItems: "start",
                }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                            <div style={{ width: 20, height: 2, background: GREEN, borderRadius: 2 }} />
                            <span style={{ color: GREEN, fontSize: 9, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase" }}>Partnership</span>
                        </div>
                        <h2 style={{ margin: 0, fontWeight: 900, textTransform: "uppercase", fontSize: isMobile ? 26 : 40, color: "#fff", lineHeight: 1.05, marginBottom: 16 }}>
                            BECOME A PARTNER
                        </h2>
                        <p style={{ fontSize: isMobile ? 13 : 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.75, marginBottom: 28, maxWidth: 420 }}>
                            Partner with Yashil Qo'llar MUN 2026 and gain visibility among 150+ future leaders from 100+ countries. We offer flexible packages tailored to your goals.
                        </p>
                        <button style={{
                            background: GREEN, border: "none", color: "#000",
                            padding: isMobile ? "12px 24px" : "14px 32px",
                            borderRadius: 10, fontSize: isMobile ? 11 : 12,
                            fontWeight: 900, letterSpacing: "0.1em",
                            cursor: "pointer", textTransform: "uppercase",
                            boxShadow: `0 0 32px ${GREEN}30`,
                        }}>Get in Touch →</button>
                    </div>

                    <div>
                        <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.25)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20 }}>What you get</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            {benefits.map((b, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${GREEN}18`, border: `1px solid ${GREEN}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <span style={{ fontSize: 10, color: GREEN }}>✓</span>
                                    </div>
                                    <span style={{ fontSize: isMobile ? 13 : 14, color: "rgba(255,255,255,0.55)" }}>{b}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}