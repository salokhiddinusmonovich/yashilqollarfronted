import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const GREEN = "#22C55E";
const BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "YashilQollarBot";

// ─── Forest canvas ─────────────────────────────────────────────────────────────
function ForestCanvas() {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const c = ref.current!; const ctx = c.getContext("2d")!;
        let id: number, w: number, h: number;
        const nodes: any[] = [], leaves: any[] = [], pulses: any[] = [];
        const resize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight; };
        const init = () => {
            resize(); nodes.length = 0; leaves.length = 0; pulses.length = 0;
            for (let i = 0; i < 70; i++) nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4, r: Math.random() * 2 + .5, a: Math.random() * .6 + .2, pulse: Math.random() * Math.PI * 2, ps: Math.random() * .025 + .01 });
            for (let i = 0; i < 20; i++) leaves.push({ x: Math.random() * w, y: Math.random() * h + h, vx: (Math.random() - .5) * .6, vy: -(Math.random() * .8 + .25), size: Math.random() * 11 + 5, rot: Math.random() * Math.PI * 2, vrot: (Math.random() - .5) * .02, a: Math.random() * .35 + .12, wobble: Math.random() * Math.PI * 2, ws: Math.random() * .02 + .008, hue: Math.random() * 30 });
            for (let i = 0; i < 5; i++) pulses.push({ x: Math.random() * w, y: Math.random() * h, r: 0, maxR: Math.random() * 180 + 80, speed: Math.random() * .7 + .35, delay: i * 40 });
        };
        const drawLeaf = (x: number, y: number, sz: number, rot: number, alpha: number, hue: number) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha; ctx.beginPath(); ctx.moveTo(0, -sz); ctx.bezierCurveTo(sz * .7, -sz * .6, sz * .7, sz * .5, 0, sz * .35); ctx.bezierCurveTo(-sz * .7, sz * .5, -sz * .7, -sz * .6, 0, -sz); const g = ctx.createLinearGradient(0, -sz, 0, sz * .35); g.addColorStop(0, `hsl(${142 + hue},80%,52%)`); g.addColorStop(1, `hsl(${155 + hue},72%,38%)`); ctx.fillStyle = g; ctx.fill(); ctx.beginPath(); ctx.moveTo(0, -sz * .85); ctx.quadraticCurveTo(sz * .08, 0, 0, sz * .3); ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = .8; ctx.stroke(); ctx.restore(); ctx.globalAlpha = 1; };
        let frame = 0;
        const tick = () => { frame++; ctx.clearRect(0, 0, w, h); for (const p of pulses) { if (frame < p.delay) continue; p.r += p.speed; if (p.r > p.maxR) { p.r = 0; p.x = Math.random() * w; p.y = Math.random() * h; } const fade = 1 - p.r / p.maxR; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.strokeStyle = `rgba(34,197,94,${.16 * fade})`; ctx.lineWidth = 1.5; ctx.stroke(); } for (let i = 0; i < nodes.length; i++)for (let j = i + 1; j < nodes.length; j++) { const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, d = Math.sqrt(dx * dx + dy * dy); if (d < 145) { ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.strokeStyle = `rgba(34,197,94,${.16 * (1 - d / 145)})`; ctx.lineWidth = .7; ctx.stroke(); } } for (const n of nodes) { n.pulse += n.ps; n.x += n.vx; n.y += n.vy; if (n.x < 0) n.x = w; if (n.x > w) n.x = 0; if (n.y < 0) n.y = h; if (n.y > h) n.y = 0; const pa = n.a * (.65 + .35 * Math.sin(n.pulse)); const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5); grd.addColorStop(0, `rgba(34,197,94,${pa * .5})`); grd.addColorStop(1, "transparent"); ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill(); ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(34,197,94,${pa})`; ctx.fill(); } for (const l of leaves) { l.wobble += l.ws; l.x += l.vx + Math.sin(l.wobble) * .5; l.y += l.vy; l.rot += l.vrot; if (l.y < -30) { l.y = h + 30; l.x = Math.random() * w; } drawLeaf(l.x, l.y, l.size, l.rot, l.a, l.hue); } id = requestAnimationFrame(tick); };
        init(); tick(); window.addEventListener("resize", init);
        return () => { cancelAnimationFrame(id); window.removeEventListener("resize", init); };
    }, []);
    return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

export function LoginPage() {
    const { loginWithTelegram, isLoggedIn, loading } = useAuth();
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState("");
    const [loadingAuth, setLoadingAuth] = useState(false);

    // Already logged in → go home
    useEffect(() => {
        if (!loading && isLoggedIn) navigate("/");
    }, [isLoggedIn, loading]);

    // Inject Telegram widget
    useEffect(() => {
        if (!containerRef.current) return;

        (window as any).onTelegramAuth = async (tgData: any) => {
            setLoadingAuth(true);
            setError("");
            const result = await loginWithTelegram(tgData);
            setLoadingAuth(false);
            if (result.ok) {
                navigate("/");
            } else {
                setError(result.error || "Login failed. Please try again.");
            }
        };

        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.setAttribute("data-telegram-login", BOT_USERNAME);
        script.setAttribute("data-size", "large");
        script.setAttribute("data-radius", "12");
        script.setAttribute("data-onauth", "onTelegramAuth(user)");
        script.setAttribute("data-request-access", "write");
        script.async = true;

        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(script);

        return () => { delete (window as any).onTelegramAuth; };
    }, []);

    return (
        <div style={{ minHeight: "100vh", background: "#060606", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif", position: "relative", padding: "20px" }}>
            <ForestCanvas />
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 80% 60% at 15% 20%, rgba(34,197,94,0.1) 0%, transparent 60%)" }} />

            <div style={{ position: "relative", zIndex: 5, width: "100%", maxWidth: 420 }}>

                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <Link to="/" style={{ textDecoration: "none", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(34,197,94,0.12)", border: "1.5px solid rgba(34,197,94,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🌱</div>
                        <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: ".1em", color: "#fff" }}>YASHIL QO'LLAR</span>
                    </Link>
                    <h1 style={{ margin: "16px 0 6px", fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Welcome back</h1>
                    <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Sign in with your Telegram account</p>
                </div>

                {/* Card */}
                <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 20, padding: "32px 28px", backdropFilter: "blur(16px)", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${GREEN}60,transparent)` }} />

                    {/* How it works */}
                    <div style={{ marginBottom: 28 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: ".15em", textTransform: "uppercase", margin: "0 0 14px" }}>How it works</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {[
                                { n: "1", text: "Click the Telegram button below" },
                                { n: "2", text: "Confirm in your Telegram app" },
                                { n: "3", text: "You're in — no password needed" },
                            ].map(step => (
                                <div key={step.n} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${GREEN}18`, border: `1px solid ${GREEN}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: GREEN, flexShrink: 0 }}>{step.n}</div>
                                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{step.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 24 }} />

                    {/* Telegram widget */}
                    {loadingAuth ? (
                        <div style={{ textAlign: "center", padding: "16px 0" }}>
                            <div style={{ width: 28, height: 28, border: `2px solid ${GREEN}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin .7s linear infinite", margin: "0 auto 10px" }} />
                            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Verifying with Telegram…</p>
                        </div>
                    ) : (
                        <div ref={containerRef} style={{ display: "flex", justifyContent: "center", minHeight: 54 }} />
                    )}

                    {error && (
                        <div style={{ marginTop: 16, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#f87171", textAlign: "center" }}>
                            {error}
                        </div>
                    )}

                    {/* Info note */}
                    <p style={{ margin: "20px 0 0", fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center", lineHeight: 1.6 }}>
                        We only access your public Telegram profile.<br />No passwords stored.
                    </p>
                </div>

                <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
                    New here?{" "}
                    <Link to="/" style={{ color: GREEN, fontWeight: 600, textDecoration: "none" }}>Just sign in — account auto-created</Link>
                </p>
            </div>

            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );
}