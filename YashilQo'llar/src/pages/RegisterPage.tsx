import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "../contexts/AuthContext";

const GREEN = "#22C55E";

const REGIONS = ["Toshkent", "Samarqand", "Buxoro", "Namangan", "Andijon", "Farg'ona", "Navoiy", "Qashqadaryo", "Surxondaryo", "Sirdaryo", "Jizzax", "Xorazm", "Qoraqalpog'iston"];
const ROLES: UserRole[] = ["Volunteer", "Researcher", "Organizer"];
const ROLE_DESC: Record<string, string> = {
    Volunteer: "Plant trees, join events, track your impact",
    Researcher: "Document species, publish field reports",
    Organizer: "Lead projects, manage volunteer teams",
};

function ForestCanvas() {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = ref.current!; const ctx = canvas.getContext("2d")!;
        let id: number, w: number, h: number; const nodes: any[] = [], leaves: any[] = [];
        const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
        const init = () => { resize(); nodes.length = 0; leaves.length = 0; for (let i = 0; i < 70; i++)nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45, r: Math.random() * 2 + .5, a: Math.random() * .6 + .2, pulse: Math.random() * Math.PI * 2, ps: Math.random() * .025 + .01 }); for (let i = 0; i < 18; i++)leaves.push({ x: Math.random() * w, y: Math.random() * h + h, vx: (Math.random() - .5) * .6, vy: -(Math.random() * .8 + .28), size: Math.random() * 10 + 5, rot: Math.random() * Math.PI * 2, vrot: (Math.random() - .5) * .02, a: Math.random() * .32 + .1, wobble: Math.random() * Math.PI * 2, ws: Math.random() * .02 + .008, hue: Math.random() * 30 }); };
        const drawLeaf = (x: number, y: number, size: number, rot: number, alpha: number, hue: number) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha; ctx.beginPath(); ctx.moveTo(0, -size); ctx.bezierCurveTo(size * .7, -size * .6, size * .7, size * .5, 0, size * .35); ctx.bezierCurveTo(-size * .7, size * .5, -size * .7, -size * .6, 0, -size); const g = ctx.createLinearGradient(0, -size, 0, size * .35); g.addColorStop(0, `hsl(${142 + hue},78%,52%)`); g.addColorStop(1, `hsl(${155 + hue},70%,37%)`); ctx.fillStyle = g; ctx.fill(); ctx.beginPath(); ctx.moveTo(0, -size * .85); ctx.quadraticCurveTo(size * .08, 0, 0, size * .3); ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = .8; ctx.stroke(); ctx.restore(); ctx.globalAlpha = 1; };
        const tick = () => { ctx.clearRect(0, 0, w, h); for (let i = 0; i < nodes.length; i++)for (let j = i + 1; j < nodes.length; j++) { const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, d = Math.sqrt(dx * dx + dy * dy); if (d < 145) { ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.strokeStyle = `rgba(34,197,94,${.16 * (1 - d / 145)})`; ctx.lineWidth = .7; ctx.stroke(); } } for (const n of nodes) { n.pulse += n.ps; n.x += n.vx; n.y += n.vy; if (n.x < 0) n.x = w; if (n.x > w) n.x = 0; if (n.y < 0) n.y = h; if (n.y > h) n.y = 0; const pa = n.a * (.65 + .35 * Math.sin(n.pulse)); const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5); grd.addColorStop(0, `rgba(34,197,94,${pa * .5})`); grd.addColorStop(1, "transparent"); ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill(); ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(34,197,94,${pa})`; ctx.fill(); } for (const l of leaves) { l.wobble += l.ws; l.x += l.vx + Math.sin(l.wobble) * .5; l.y += l.vy; l.rot += l.vrot; if (l.y < -30) { l.y = h + 30; l.x = Math.random() * w; } drawLeaf(l.x, l.y, l.size, l.rot, l.a, l.hue); } id = requestAnimationFrame(tick); };
        init(); tick(); window.addEventListener("resize", init); return () => { cancelAnimationFrame(id); window.removeEventListener("resize", init); };
    }, []);
    return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 10, color: "#fff", fontSize: 13,
    fontFamily: "'Inter',sans-serif", outline: "none",
    boxSizing: "border-box", transition: "border-color .2s, background .2s",
};
const labelStyle: React.CSSProperties = {
    fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.28)",
    letterSpacing: ".18em", textTransform: "uppercase",
    display: "block", marginBottom: 7,
};

export function RegisterPage() {
    const { register, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", username: "", email: "", password: "", region: "Toshkent", role: "Volunteer" as UserRole });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 2-step form

    useEffect(() => { if (isLoggedIn) navigate("/"); }, [isLoggedIn]);

    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
    const focus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.target.style.borderColor = GREEN + "55"; e.target.style.background = "rgba(34,197,94,0.05)"; };
    const blur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; e.target.style.background = "rgba(255,255,255,0.04)"; };

    const handleNext = (e: React.FormEvent) => { e.preventDefault(); setStep(2); };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setError(""); setLoading(true);
        const res = await register(form);
        setLoading(false);
        if (res.ok) navigate("/");
        else setError(res.error || "Registration failed.");
    };

    return (
        <div style={{ minHeight: "100vh", background: "#060606", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif", position: "relative", padding: "20px" }}>
            <ForestCanvas />
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 70% 55% at 85% 80%, rgba(34,197,94,0.08) 0%, transparent 60%)" }} />

            <div style={{ position: "relative", zIndex: 5, width: "100%", maxWidth: 460 }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(34,197,94,0.12)", border: "1.5px solid rgba(34,197,94,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌱</div>
                            <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: ".1em", color: "#fff" }}>YASHIL QO'LLAR</span>
                        </div>
                    </Link>
                    <h1 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Join the movement</h1>
                    <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.38)" }}>Create your volunteer profile</p>
                </div>

                {/* Step indicator */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, justifyContent: "center" }}>
                    {[1, 2].map(s => (
                        <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: step >= s ? GREEN : "rgba(255,255,255,0.08)", border: `1.5px solid ${step >= s ? GREEN : "rgba(255,255,255,0.15)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: step >= s ? "#000" : "rgba(255,255,255,0.4)", transition: "all .25s" }}>
                                {step > s ? "✓" : s}
                            </div>
                            <span style={{ fontSize: 11, color: step >= s ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)", fontWeight: 600 }}>
                                {s === 1 ? "Your details" : "Your role"}
                            </span>
                            {s < 2 && <div style={{ width: 40, height: 1, background: step > s ? GREEN : "rgba(255,255,255,0.12)", transition: "background .3s" }} />}
                        </div>
                    ))}
                </div>

                {/* Card */}
                <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(34,197,94,0.18)", borderRadius: 20, padding: "28px 26px", backdropFilter: "blur(16px)", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${GREEN}60,transparent)` }} />

                    {/* STEP 1 */}
                    {step === 1 && (
                        <form onSubmit={handleNext} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div>
                                    <label style={labelStyle}>Full Name</label>
                                    <input type="text" placeholder="Your name" value={form.name} onChange={e => set("name", e.target.value)} required style={inputStyle} onFocus={focus} onBlur={blur} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Username</label>
                                    <input type="text" placeholder="@handle" value={form.username} onChange={e => set("username", e.target.value)} required style={inputStyle} onFocus={focus} onBlur={blur} />
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Email</label>
                                <input type="email" placeholder="you@example.com" value={form.email} onChange={e => set("email", e.target.value)} required style={inputStyle} onFocus={focus} onBlur={blur} />
                            </div>
                            <div>
                                <label style={labelStyle}>Password</label>
                                <input type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => set("password", e.target.value)} required minLength={6} style={inputStyle} onFocus={focus} onBlur={blur} />
                            </div>
                            <button type="submit" style={{ width: "100%", padding: "13px", background: GREEN, border: "none", color: "#000", borderRadius: 10, fontSize: 12, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Montserrat',sans-serif", boxShadow: "0 0 20px rgba(34,197,94,0.22)", transition: "all .2s" }}>
                                NEXT: CHOOSE ROLE →
                            </button>
                        </form>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div>
                                <label style={labelStyle}>Your region</label>
                                <select value={form.region} onChange={e => set("region", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }} onFocus={focus} onBlur={blur}>
                                    {REGIONS.map(r => <option key={r} value={r} style={{ background: "#111" }}>{r}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={labelStyle}>Your role</label>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {ROLES.map(role => (
                                        <div key={role} onClick={() => set("role", role)} style={{
                                            padding: "14px 16px", borderRadius: 11, cursor: "pointer",
                                            background: form.role === role ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.03)",
                                            border: `1px solid ${form.role === role ? GREEN + "45" : "rgba(255,255,255,0.08)"}`,
                                            transition: "all .18s",
                                        }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${form.role === role ? GREEN : "rgba(255,255,255,0.2)"}`, background: form.role === role ? GREEN : "transparent", transition: "all .18s", flexShrink: 0 }} />
                                                <div>
                                                    <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{role}</div>
                                                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{ROLE_DESC[role]}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {error && (
                                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 9, padding: "10px 14px", fontSize: 13, color: "#f87171" }}>
                                    {error}
                                </div>
                            )}

                            <div style={{ display: "flex", gap: 10 }}>
                                <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: "13px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Montserrat',sans-serif", letterSpacing: ".08em" }}>
                                    ← BACK
                                </button>
                                <button type="submit" disabled={loading} style={{ flex: 2, padding: "13px", background: loading ? "rgba(34,197,94,0.4)" : GREEN, border: "none", color: loading ? GREEN : "#000", borderRadius: 10, fontSize: 12, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", cursor: loading ? "wait" : "pointer", fontFamily: "'Montserrat',sans-serif", boxShadow: loading ? "none" : "0 0 20px rgba(34,197,94,0.22)", transition: "all .25s" }}>
                                    {loading ? "CREATING…" : "CREATE ACCOUNT →"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <p style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
                    Already a member?{" "}
                    <Link to="/login" style={{ color: GREEN, fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
                </p>
            </div>

            <style>{`input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.18)} input,select{color-scheme:dark} select option{background:#111;color:#fff}`}</style>
        </div>
    );
}