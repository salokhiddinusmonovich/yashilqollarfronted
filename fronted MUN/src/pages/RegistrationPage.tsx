import { useEffect, useState } from "react";

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScl1fYhbUqZg_9kX2Ghkob-oiEtYD2pNlwXwXnVwZ3EQjdDjg/viewform?usp=publish-editor";
const GREEN = "#22C55E";
const ORANGE = "#F97316";

const steps = [
    {
        num: "01", title: "FILL THE FORM",
        desc: "Provide your details accurately in the registration form below.",
        icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
    },
    {
        num: "02", title: "CONFIRMATION",
        desc: "Wait for the approval email from our secretariat team.",
        icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
        num: "03", title: "PARTICIPATE",
        desc: "Get ready for an elite diplomatic experience at Yashil Qo'llar MUN 2026.",
        icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    },
];

function StepCard({ step, isMobile }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
            flex: 1, minWidth: isMobile ? "100%" : 220,
            background: "#111",
            border: `1px solid ${hovered ? GREEN + "60" : "rgba(255,255,255,0.07)"}`,
            borderRadius: 20, padding: "32px 28px",
            position: "relative",
            transition: "border-color 0.25s, transform 0.25s",
            transform: hovered ? "translateY(-4px)" : "translateY(0)",
        }}>
            <div style={{ position: "absolute", top: 20, right: 24, fontSize: 56, fontWeight: 900, color: "rgba(255,255,255,0.03)", lineHeight: 1, letterSpacing: "-0.05em", userSelect: "none" }}>{step.num}</div>
            <div style={{
                width: 56, height: 56, borderRadius: 16,
                border: `1px solid ${hovered ? GREEN + "70" : "rgba(255,255,255,0.1)"}`,
                background: hovered ? `${GREEN}12` : "rgba(255,255,255,0.03)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: hovered ? GREEN : "rgba(255,255,255,0.35)",
                marginBottom: 24, transition: "all 0.25s",
            }}>{step.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: hovered ? "#fff" : "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10, transition: "color 0.2s" }}>{step.title}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.65 }}>{step.desc}</div>
            <div style={{ position: "absolute", bottom: 0, left: 24, right: 24, height: 2, background: hovered ? `linear-gradient(90deg, transparent, ${GREEN}, transparent)` : "transparent", borderRadius: "0 0 2px 2px", transition: "background 0.3s" }} />
        </div>
    );
}

export function RegistrationPage() {
    const [isMobile, setIsMobile] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [btnHovered, setBtnHovered] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check(); window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    return (
        <div style={{ minHeight: "100vh", background: "#080808", fontFamily: "'Inter','Helvetica Neue',sans-serif", color: "#fff", position: "relative", overflowX: "hidden" }}>
            {/* Green glow top-left */}
            <div style={{ position: "fixed", top: -200, left: -200, width: isMobile ? 500 : 900, height: isMobile ? 500 : 900, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(34,197,94,0.28) 0%, rgba(22,163,74,0.12) 40%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
            {/* Soft right glow */}
            <div style={{ position: "fixed", top: "30%", right: -300, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(34,197,94,0.07) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

            {/* Nav */}
            <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(8,8,8,0.90)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: isMobile ? "0 20px" : "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>T</div>
                    <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: "0.1em" }}>TT MUN</span>
                </div>
                {!isMobile && (
                    <div style={{ display: "flex", gap: 24 }}>
                        {["HOME", "ABOUT", "COMMITTEES", "TEAM", "SCHEDULE", "REGISTER NOW", "SPONSORS", "CONTACT"].map(item => (
                            <span key={item} style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer", color: item === "REGISTER NOW" ? ORANGE : "rgba(255,255,255,0.5)", borderBottom: item === "REGISTER NOW" ? `2px solid ${ORANGE}` : "2px solid transparent", paddingBottom: 2, whiteSpace: "nowrap" }}>{item}</span>
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
                        <span key={item} onClick={() => setMenuOpen(false)} style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: item === "REGISTER NOW" ? ORANGE : "rgba(255,255,255,0.6)", cursor: "pointer" }}>{item}</span>
                    ))}
                </div>
            )}

            <main style={{ position: "relative", zIndex: 1, paddingTop: isMobile ? 80 : 100, paddingBottom: 100, paddingLeft: isMobile ? 16 : "clamp(32px,5vw,80px)", paddingRight: isMobile ? 16 : "clamp(32px,5vw,80px)", maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>

                {/* Label */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                    <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, transparent, ${GREEN})`, borderRadius: 2 }} />
                    <span style={{ color: GREEN, fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase" }}>Registration Open</span>
                    <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, ${GREEN}, transparent)`, borderRadius: 2 }} />
                </div>

                {/* Hero */}
                <h1 style={{ margin: 0, fontSize: isMobile ? "clamp(36px,11vw,52px)" : "clamp(52px,7vw,88px)", fontWeight: 900, letterSpacing: "-0.03em", textTransform: "uppercase", lineHeight: 1, marginBottom: 24 }}>
                    <span style={{ color: "#fff" }}>JOIN THE </span>
                    <span style={{ color: GREEN }}>CONFERENCE</span>
                </h1>
                <p style={{ fontSize: isMobile ? 14 : 16, color: "rgba(255,255,255,0.35)", lineHeight: 1.7, maxWidth: 480, marginBottom: 72 }}>
                    Yashil Qo'llar MUN 2026 — Tashkent, July 21. Register now and secure your seat among 150+ delegates from 100+ countries.
                </p>

                {/* Steps */}
                <div style={{ width: "100%", display: "flex", flexDirection: isMobile ? "column" : "row", gap: 16, marginBottom: 64, position: "relative" }}>
                    {!isMobile && <div style={{ position: "absolute", top: 44, left: "calc(33% - 8px)", right: "calc(33% - 8px)", height: 1, background: `linear-gradient(90deg, transparent, ${GREEN}35, transparent)`, zIndex: 0 }} />}
                    {steps.map((step, i) => <StepCard key={i} step={step} isMobile={isMobile} />)}
                </div>

                {/* CTA */}
                <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", inset: -24, background: `radial-gradient(ellipse, ${GREEN}25 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none", opacity: btnHovered ? 1 : 0.5, transition: "opacity 0.3s" }} />
                    <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer"
                        onMouseEnter={() => setBtnHovered(true)}
                        onMouseLeave={() => setBtnHovered(false)}
                        style={{
                            position: "relative", zIndex: 1, display: "inline-block",
                            background: btnHovered ? "#16a34a" : GREEN,
                            color: "#000", padding: isMobile ? "16px 36px" : "20px 60px",
                            borderRadius: 14, fontSize: isMobile ? 12 : 13,
                            fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none",
                            transition: "background 0.2s, transform 0.2s",
                            transform: btnHovered ? "scale(1.04)" : "scale(1)",
                            boxShadow: `0 20px 60px ${GREEN}35`,
                        }}>
                        OPEN REGISTRATION FORM →
                    </a>
                </div>
                <p style={{ marginTop: 24, fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>FREE TO ATTEND · TASHKENT, UZBEKISTAN · MAY 31, 2026</p>

                {/* Embedded Google Form */}
                <div style={{
                    width: "100%", maxWidth: 760, marginTop: 72,
                    borderRadius: 20, overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: `0 0 80px ${GREEN}12`,
                }}>
                    <div style={{
                        background: "#111", padding: "14px 22px",
                        borderBottom: "1px solid rgba(255,255,255,0.07)",
                        display: "flex", alignItems: "center", gap: 10,
                    }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                            Registration Form
                        </span>
                    </div>
                    <iframe
                        src="https://docs.google.com/forms/d/e/1FAIpQLScl1fYhbUqZg_9kX2Ghkob-oiEtYD2pNlwXwXnVwZ3EQjdDjg/viewform?usp=publish-editor"
                        width="100%"
                        height="920"
                        frameBorder="0"
                        marginHeight={0}
                        marginWidth={0}
                        style={{ display: "block", background: "#fff" }}
                    >
                        Loading…
                    </iframe>
                </div>

            </main>
        </div>
    );
}