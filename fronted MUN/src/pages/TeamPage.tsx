import { useState, useEffect } from "react";

const GREEN = "#22C55E";
const ORANGE = "#F97316";
const ORANGE_DARK = "#c2520a";

// photo: "/images/salokhiddin.png"
const secretariat = [
    { name: "Usmonov Salokhiddin", role: "MAIN SECRETARY GENERAL", badge: "SG" },
    { name: "HASANOVA KAMILA", role: "SECRETARY GENERAL", badge: "SG" },
    { name: "ATAKHANOVA MAFTUNA", role: "VICE SECRETARY GENERAL", badge: "SG" },
    { name: "SUREYA ABI", role: "VICE SECRETARY GENERAL", badge: "SG" },
];

const committee = [
    { name: "BEKHRUZ TADJIEV", role: "DIRECTOR GENERAL", badge: "OC" },
    { name: "ANVAROV BEKHRUZ", role: "PROGRAMMER", badge: "OC" },
    { name: "USMONOVA OYSHA", role: "CONFERENCE MANAGER", badge: "OC" },
    { name: "NASRULLAEV NUSRATILLA", role: "FINANCE MANAGER", badge: "OC" },
    { name: "TUYCHIEVA SALIMA", role: "HEAD OF MEDIA", badge: "OC" },
    { name: "YULDASHEVA LOLA", role: "VICE HEAD OF MEDIA", badge: "OC" },
    { name: "ISMOILOVA HADIJA", role: "HEAD OF VOLUNTEERS", badge: "OC" },
    { name: "RASULEV TAIR", role: "VOLUNTEERS COORDINATOR", badge: "OC" },
    { name: "NAZAROV JAVOHIR", role: "LEAD GRAPHIC DESIGNER", badge: "OC" },
    { name: "EVGENY KOTOV", role: "UI DESIGNER", badge: "OC" },
];

function MemberCard({ name, role, badge, photo, large = false }) {
    const [hovered, setHovered] = useState(false);
    const isSG = badge === "SG";
    const accentColor = isSG ? GREEN : ORANGE;
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: "#111",
                border: `1px solid ${hovered ? accentColor + "55" : "rgba(255,255,255,0.06)"}`,
                borderRadius: large ? 18 : 13,
                padding: large ? 16 : 11,
                transition: "border-color 0.2s, transform 0.2s",
                transform: hovered ? "translateY(-3px)" : "translateY(0)",
                cursor: "default",
                position: "relative", overflow: "hidden",
            }}
        >
            {/* Top glow line */}
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: hovered ? `linear-gradient(90deg, transparent, ${accentColor}, transparent)` : "transparent",
                transition: "background 0.3s",
            }} />

            {/* Photo area */}
            <div style={{
                position: "relative", width: "100%",
                aspectRatio: "3/4",
                background: isSG
                    ? `linear-gradient(160deg, ${GREEN} 0%, #15803d 100%)`
                    : `linear-gradient(160deg, ${ORANGE} 0%, ${ORANGE_DARK} 100%)`,
                borderRadius: large ? 12 : 8,
                overflow: "hidden", marginBottom: large ? 14 : 9,
            }}>
                {photo && (
                    <img src={photo} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", position: "absolute", inset: 0 }} />
                )}
                {!photo && (
                    <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "60%", height: "85%", background: "rgba(0,0,0,0.15)", borderRadius: "50% 50% 0 0" }} />
                )}
                {/* Badge always on top */}
                <div style={{
                    position: "absolute", top: 10, right: 10, zIndex: 2,
                    background: accentColor, color: "#000",
                    fontSize: 9, fontWeight: 900, letterSpacing: "0.05em",
                    padding: "3px 8px", borderRadius: 5, textTransform: "uppercase",
                }}>{badge}</div>
            </div>

            <div style={{ padding: "0 2px" }}>
                <div style={{
                    fontWeight: 900, fontSize: large ? 13 : 10, color: "#fff",
                    textTransform: "uppercase", letterSpacing: "0.01em", lineHeight: 1.2, marginBottom: 5,
                }}>{name}</div>
                <div style={{
                    fontWeight: 700, fontSize: large ? 10 : 8,
                    color: accentColor, opacity: 0.8,
                    textTransform: "uppercase", letterSpacing: "0.08em", lineHeight: 1.3,
                }}>{role}</div>
            </div>
        </div>
    );
}

function Nav({ isMobile, menuOpen, setMenuOpen }) {
    return (
        <>
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
                            <span key={item} style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer", color: item === "TEAM" ? ORANGE : "rgba(255,255,255,0.5)", borderBottom: item === "TEAM" ? `2px solid ${ORANGE}` : "2px solid transparent", paddingBottom: 2, whiteSpace: "nowrap" }}>{item}</span>
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
                        <span key={item} onClick={() => setMenuOpen(false)} style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: item === "TEAM" ? ORANGE : "rgba(255,255,255,0.6)", cursor: "pointer" }}>{item}</span>
                    ))}
                </div>
            )}
        </>
    );
}

export function TeamPage() {
    const [isMobile, setIsMobile] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check(); window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    return (
        <div style={{ minHeight: "100vh", background: "#080808", fontFamily: "'Inter','Helvetica Neue',sans-serif", color: "#fff", position: "relative", overflowX: "hidden" }}>
            {/* Green glow top-left */}
            <div style={{ position: "fixed", top: -200, left: -200, width: isMobile ? 500 : 900, height: isMobile ? 500 : 900, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(34,197,94,0.22) 0%, rgba(22,163,74,0.10) 35%, transparent 68%)", pointerEvents: "none", zIndex: 0 }} />

            <Nav isMobile={isMobile} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            <main style={{ paddingTop: isMobile ? 80 : 96, paddingBottom: 80, paddingLeft: isMobile ? 16 : "clamp(32px,5vw,80px)", paddingRight: isMobile ? 16 : "clamp(32px,5vw,80px)", maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>

                {/* Header */}
                <div style={{ marginBottom: isMobile ? 40 : 60 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 24, height: 2, background: GREEN, borderRadius: 2 }} />
                        <span style={{ color: GREEN, fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase" }}>Secretariat</span>
                    </div>
                    <h1 style={{ margin: 0, fontWeight: 900, textTransform: "uppercase", lineHeight: 1, fontSize: isMobile ? 36 : 56 }}>
                        <span style={{ color: GREEN }}>THE </span><span style={{ color: "#fff" }}>TEAM</span>
                    </h1>
                    <p style={{ margin: "12px 0 0", fontSize: 14, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>
                        The people behind Yashil Qo'llar MUN 2026 — dedicated to making it exceptional.
                    </p>
                </div>

                {/* Secretary General */}
                <div style={{ marginBottom: isMobile ? 48 : 72 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
                        <span style={{ color: GREEN, fontSize: 10, fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Secretary General</span>
                        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${GREEN}40, transparent)` }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: isMobile ? 12 : 20 }}>
                        {secretariat.map((m, i) => <MemberCard key={i} {...m} large />)}
                    </div>
                </div>

                {/* Organizing Committee */}
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
                        <span style={{ color: ORANGE, fontSize: 10, fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Organizing Committee</span>
                        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${ORANGE}40, transparent)` }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(auto-fill,minmax(150px,1fr))", gap: isMobile ? 10 : 14 }}>
                        {committee.map((m, i) => <MemberCard key={i} {...m} large={false} />)}
                    </div>
                </div>

            </main>
        </div>
    );
}