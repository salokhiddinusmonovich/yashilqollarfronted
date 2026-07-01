import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const GREEN = "#22C55E";

function ForestCanvas() {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = ref.current!;
        const ctx = canvas.getContext("2d")!;
        let id: number, w: number, h: number;
        const nodes: any[] = [], leaves: any[] = [], pulses: any[] = [];
        const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
        const init = () => {
            resize(); nodes.length = 0; leaves.length = 0; pulses.length = 0;
            for (let i = 0; i < 70; i++) nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45, r: Math.random() * 2 + .5, a: Math.random() * .65 + .2, pulse: Math.random() * Math.PI * 2, ps: Math.random() * .028 + .01 });
            for (let i = 0; i < 20; i++) leaves.push({ x: Math.random() * w, y: Math.random() * h + h, vx: (Math.random() - .5) * .65, vy: -(Math.random() * .85 + .28), size: Math.random() * 11 + 5, rot: Math.random() * Math.PI * 2, vrot: (Math.random() - .5) * .022, a: Math.random() * .35 + .12, wobble: Math.random() * Math.PI * 2, ws: Math.random() * .022 + .008, hue: Math.random() * 30 });
            for (let i = 0; i < 5; i++) pulses.push({ x: Math.random() * w, y: Math.random() * h, r: 0, maxR: Math.random() * 180 + 80, speed: Math.random() * .7 + .35, delay: i * 40 });
        };
        const drawLeaf = (x: number, y: number, size: number, rot: number, alpha: number, hue: number) => {
            ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha;
            ctx.beginPath(); ctx.moveTo(0, -size); ctx.bezierCurveTo(size * .7, -size * .6, size * .7, size * .5, 0, size * .35); ctx.bezierCurveTo(-size * .7, size * .5, -size * .7, -size * .6, 0, -size);
            const g = ctx.createLinearGradient(0, -size, 0, size * .35); g.addColorStop(0, `hsl(${142 + hue},78%,52%)`); g.addColorStop(1, `hsl(${155 + hue},70%,37%)`);
            ctx.fillStyle = g; ctx.fill();
            ctx.beginPath(); ctx.moveTo(0, -size * .85); ctx.quadraticCurveTo(size * .08, 0, 0, size * .3); ctx.strokeStyle = "rgba(255,255,255,0.22)"; ctx.lineWidth = .85; ctx.stroke();
            ctx.restore(); ctx.globalAlpha = 1;
        };
        let frame = 0;
        const tick = () => {
            frame++; ctx.clearRect(0, 0, w, h);
            for (const p of pulses) { if (frame < p.delay) continue; p.r += p.speed; if (p.r > p.maxR) { p.r = 0; p.x = Math.random() * w; p.y = Math.random() * h; p.maxR = Math.random() * 180 + 80; } const fade = 1 - p.r / p.maxR; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.strokeStyle = `rgba(34,197,94,${.18 * fade})`; ctx.lineWidth = 1.5; ctx.stroke(); }
            for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) { const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, d = Math.sqrt(dx * dx + dy * dy); if (d < 150) { ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.strokeStyle = `rgba(34,197,94,${.17 * (1 - d / 150)})`; ctx.lineWidth = .75; ctx.stroke(); } }
            for (const n of nodes) { n.pulse += n.ps; n.x += n.vx; n.y += n.vy; if (n.x < 0) n.x = w; if (n.x > w) n.x = 0; if (n.y < 0) n.y = h; if (n.y > h) n.y = 0; const pa = n.a * (.65 + .35 * Math.sin(n.pulse)); const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5); grd.addColorStop(0, `rgba(34,197,94,${pa * .55})`); grd.addColorStop(1, "transparent"); ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill(); ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(34,197,94,${pa})`; ctx.fill(); }
            for (const l of leaves) { l.wobble += l.ws; l.x += l.vx + Math.sin(l.wobble) * .5; l.y += l.vy; l.rot += l.vrot; if (l.y < -30) { l.y = h + 30; l.x = Math.random() * w; } drawLeaf(l.x, l.y, l.size, l.rot, l.a, l.hue); }
            id = requestAnimationFrame(tick);
        };
        init(); tick();
        window.addEventListener("resize", init);
        return () => { cancelAnimationFrame(id); window.removeEventListener("resize", init); };
    }, []);
    return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

const inputStyle: React.CSSProperties = {
    width: "100%", padding: "13px 16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 11, color: "#fff", fontSize: 14,
    fontFamily: "'Inter',sans-serif", outline: "none",
    boxSizing: "border-box", transition: "border-color .2s, background .2s",
};

export function LoginPage() {
    const { login, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);

    useEffect(() => { if (isLoggedIn) navigate("/"); }, [isLoggedIn]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); setLoading(true);
        const res = await login(email, password);
        setLoading(false);
        if (res.ok) navigate("/");
        else setError(res.error || "Login failed.");
    };

    return (
        <div style={{ minHeight: "100vh", background: "#060606", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif", position: "relative", padding: "20px" }}>
            <ForestCanvas />
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 80% 60% at 15% 20%, rgba(34,197,94,0.1) 0%, transparent 60%)" }} />

            <div style={{ position: "relative", zIndex: 5, width: "100%", maxWidth: 420 }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(34,197,94,0.12)", border: "1.5px solid rgba(34,197,94,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🌱</div>
                            <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: ".1em", color: "#fff" }}>YASHIL QO'LLAR</span>
                        </div>
                    </Link>
                    <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Welcome back</h1>
                    <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.38)" }}>Sign in to your volunteer account</p>
                </div>

                {/* Card */}
                <div style={{
                    background: "rgba(255,255,255,0.025)", border: "1px solid rgba(34,197,94,0.18)",
                    borderRadius: 20, padding: "32px 28px", backdropFilter: "blur(16px)",
                    position: "relative", overflow: "hidden",
                }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${GREEN}60,transparent)` }} />

                    {/* Demo hint */}
                    <div style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.18)", borderRadius: 10, padding: "10px 14px", marginBottom: 22, fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                        <strong style={{ color: GREEN }}>Demo:</strong> use <code style={{ color: "rgba(255,255,255,0.7)" }}>aziz@yashilqollar.uz</code> / <code style={{ color: "rgba(255,255,255,0.7)" }}>demo123</code>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                            <label style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: ".18em", textTransform: "uppercase", display: "block", marginBottom: 7 }}>Email</label>
                            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle}
                                onFocus={e => { e.target.style.borderColor = GREEN + "55"; e.target.style.background = "rgba(34,197,94,0.05)" }}
                                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; e.target.style.background = "rgba(255,255,255,0.04)" }} />
                        </div>
                        <div>
                            <label style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: ".18em", textTransform: "uppercase", display: "block", marginBottom: 7 }}>Password</label>
                            <div style={{ position: "relative" }}>
                                <input type={showPw ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={{ ...inputStyle, paddingRight: 44 }}
                                    onFocus={e => { e.target.style.borderColor = GREEN + "55"; e.target.style.background = "rgba(34,197,94,0.05)" }}
                                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; e.target.style.background = "rgba(255,255,255,0.04)" }} />
                                <button type="button" onClick={() => setShowPw(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 15 }}>
                                    {showPw ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 9, padding: "10px 14px", fontSize: 13, color: "#f87171" }}>
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={loading} style={{
                            width: "100%", padding: "14px",
                            background: loading ? "rgba(34,197,94,0.4)" : GREEN,
                            border: "none", color: loading ? GREEN : "#000",
                            borderRadius: 11, fontSize: 13, fontWeight: 800,
                            letterSpacing: ".12em", textTransform: "uppercase",
                            cursor: loading ? "wait" : "pointer", transition: "all .25s",
                            fontFamily: "'Montserrat',sans-serif",
                            boxShadow: loading ? "none" : "0 0 24px rgba(34,197,94,0.25)",
                        }}>
                            {loading ? "SIGNING IN…" : "SIGN IN →"}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
                    Don't have an account?{" "}
                    <Link to="/register" style={{ color: GREEN, fontWeight: 600, textDecoration: "none" }}>Join as volunteer</Link>
                </p>
            </div>

            <style>{`input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.18)} input{color-scheme:dark}`}</style>
        </div>
    );
}