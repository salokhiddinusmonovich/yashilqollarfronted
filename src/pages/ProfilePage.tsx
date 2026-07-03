import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { fixMediaUrl } from "../config/api";

const GREEN = "#22C55E";

function ForestCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    let id: number, w: number, h: number;
    const nodes: any[] = [], leaves: any[] = [], pulses: any[] = [];
    const resize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight; };
    const init = () => {
      resize(); nodes.length = 0; leaves.length = 0; pulses.length = 0;
      for (let i = 0; i < 80; i++) nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45, r: Math.random() * 2 + .5, a: Math.random() * .65 + .2, pulse: Math.random() * Math.PI * 2, ps: Math.random() * .028 + .01 });
      for (let i = 0; i < 24; i++) leaves.push({ x: Math.random() * w, y: Math.random() * h + h, vx: (Math.random() - .5) * .65, vy: -(Math.random() * .85 + .28), size: Math.random() * 12 + 5, rot: Math.random() * Math.PI * 2, vrot: (Math.random() - .5) * .022, a: Math.random() * .38 + .13, wobble: Math.random() * Math.PI * 2, ws: Math.random() * .022 + .008, hue: Math.random() * 30 });
      for (let i = 0; i < 5; i++) pulses.push({ x: Math.random() * w, y: Math.random() * h, r: 0, maxR: Math.random() * 180 + 80, speed: Math.random() * .8 + .4, delay: i * 40 });
    };
    const drawLeaf = (x: number, y: number, sz: number, rot: number, alpha: number, hue: number) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha; ctx.beginPath(); ctx.moveTo(0, -sz); ctx.bezierCurveTo(sz * .7, -sz * .6, sz * .7, sz * .5, 0, sz * .35); ctx.bezierCurveTo(-sz * .7, sz * .5, -sz * .7, -sz * .6, 0, -sz); const g = ctx.createLinearGradient(0, -sz, 0, sz * .35); g.addColorStop(0, `hsl(${142 + hue},80%,52%)`); g.addColorStop(1, `hsl(${155 + hue},72%,38%)`); ctx.fillStyle = g; ctx.fill(); ctx.beginPath(); ctx.moveTo(0, -sz * .85); ctx.quadraticCurveTo(sz * .08, 0, 0, sz * .3); ctx.strokeStyle = "rgba(255,255,255,0.22)"; ctx.lineWidth = .85; ctx.stroke(); ctx.restore(); ctx.globalAlpha = 1; };
    let frame = 0;
    const tick = () => { frame++; ctx.clearRect(0, 0, w, h); for (const p of pulses) { if (frame < p.delay) continue; p.r += p.speed; if (p.r > p.maxR) { p.r = 0; p.x = Math.random() * w; p.y = Math.random() * h; } const fade = 1 - p.r / p.maxR; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.strokeStyle = `rgba(34,197,94,${.18 * fade})`; ctx.lineWidth = 1.5; ctx.stroke(); } for (let i = 0; i < nodes.length; i++)for (let j = i + 1; j < nodes.length; j++) { const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, d = Math.sqrt(dx * dx + dy * dy); if (d < 155) { ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.strokeStyle = `rgba(34,197,94,${.17 * (1 - d / 155)})`; ctx.lineWidth = .78; ctx.stroke(); } } for (const n of nodes) { n.pulse += n.ps; n.x += n.vx; n.y += n.vy; if (n.x < 0) n.x = w; if (n.x > w) n.x = 0; if (n.y < 0) n.y = h; if (n.y > h) n.y = 0; const pa = n.a * (.65 + .35 * Math.sin(n.pulse)); const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5); grd.addColorStop(0, `rgba(34,197,94,${pa * .55})`); grd.addColorStop(1, "transparent"); ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill(); ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(34,197,94,${pa})`; ctx.fill(); } for (const l of leaves) { l.wobble += l.ws; l.x += l.vx + Math.sin(l.wobble) * .5; l.y += l.vy; l.rot += l.vrot; if (l.y < -30) { l.y = h + 30; l.x = Math.random() * w; } drawLeaf(l.x, l.y, l.size, l.rot, l.a, l.hue); } id = requestAnimationFrame(tick); };
    init(); tick(); window.addEventListener("resize", init); return () => { cancelAnimationFrame(id); window.removeEventListener("resize", init); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null); const [vis, setVis] = useState(false);
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.05 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, []);
  return <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)", transition: `opacity .8s cubic-bezier(.16,1,.3,1) ${delay}ms,transform .8s cubic-bezier(.16,1,.3,1) ${delay}ms` }}>{children}</div>;
}

const FIELD_ICONS: Record<string, string> = { email: "✉️", phone: "📱", age: "🎂", education_place: "🎓", experience: "💬" };

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "13px 14px 13px 42px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 11, color: "#fff", fontSize: 13.5,
  fontFamily: "'Inter',sans-serif", outline: "none",
  boxSizing: "border-box", transition: "border-color .2s, background .2s",
};
const labelStyle: React.CSSProperties = {
  fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.32)",
  letterSpacing: ".14em", textTransform: "uppercase",
  display: "block", marginBottom: 8,
};
const focus = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = GREEN + "55"; e.target.style.background = "rgba(34,197,94,0.06)"; };
const blur = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; e.target.style.background = "rgba(255,255,255,0.04)"; };

function IconField({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, pointerEvents: "none", opacity: .7 }}>{icon}</span>
      {children}
    </div>
  );
}

export function ProfilePage() {
  const { user, isLoggedIn, loading: authLoading, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", phone: "", age: "", education_place: "", experience: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { if (!authLoading && !isLoggedIn) navigate("/login"); }, [authLoading, isLoggedIn]);

  useEffect(() => {
    if (user) {
      setForm({
        email: user.email || "",
        phone: user.phone || "",
        age: user.age?.toString() || "",
        education_place: user.education_place || "",
        experience: user.experience || "",
      });
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div style={{ minHeight: "100vh", background: "#060606", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", border: "3px solid rgba(34,197,94,0.15)", borderTopColor: GREEN, animation: "yq-spin .8s linear infinite" }} />
        <style>{`@keyframes yq-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const photoUrl = fixMediaUrl(user.photo);
  const initials = user.fullname.split(" ").filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSaved(false); setSaving(true);
    const res = await updateProfile({
      email: form.email,
      phone: form.phone,
      age: form.age ? Number(form.age) : null,
      education_place: form.education_place,
      experience: form.experience,
    } as any);
    setSaving(false);
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    else setError(res.error || "Failed to save.");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060606", color: "#fff", fontFamily: "'Inter','Helvetica Neue',sans-serif", position: "relative", overflowX: "hidden" }}>
      <ForestCanvas />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 80% 60% at 12% 15%, rgba(34,197,94,0.12) 0%, transparent 60%), radial-gradient(ellipse 55% 50% at 88% 85%, rgba(16,185,129,0.08) 0%, transparent 55%)" }} />

      <main style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "clamp(100px,12vw,130px) clamp(16px,5vw,40px) 100px" }}>

        <FadeIn>
          <div style={{
            display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap",
            padding: "32px 28px", marginBottom: 24, borderRadius: 22,
            background: "rgba(255,255,255,0.025)", border: "1px solid rgba(34,197,94,0.2)",
            position: "relative", overflow: "hidden", backdropFilter: "blur(10px)",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${GREEN}70,transparent)` }} />
            <div style={{
              width: 88, height: 88, borderRadius: "50%", flexShrink: 0, overflow: "hidden",
              background: GREEN, border: `2px solid ${GREEN}80`,
              boxShadow: `0 0 30px rgba(34,197,94,0.35)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 30, fontWeight: 800, color: "#04140a",
            }}>
              {photoUrl ? <img src={photoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h1 style={{ margin: "0 0 8px", fontSize: "clamp(22px,4vw,30px)", fontWeight: 900, letterSpacing: "-0.02em" }}>{user.fullname}</h1>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", padding: "4px 11px", borderRadius: 6, background: `${GREEN}18`, color: GREEN, border: `1px solid ${GREEN}35` }}>{user.role}</span>
                {user.username && <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.35)" }}>@{user.username}</span>}
              </div>
              {user.rank && (
                <div style={{ marginTop: 10, fontSize: 13, color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>{user.rank}</div>
              )}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={80}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 1, background: `${GREEN}10`, borderRadius: 18, overflow: "hidden", border: `1px solid ${GREEN}20`, marginBottom: 24 }}>
            {[
              { icon: "⭐", val: user.balance, lbl: "Eco-points" },
              { icon: "📋", val: user.projects_count, lbl: "Projects" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "26px 20px", background: "rgba(6,6,6,0.92)", textAlign: "center" }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: "clamp(24px,3.5vw,34px)", fontWeight: 800, color: GREEN, letterSpacing: "-0.02em", lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 8, letterSpacing: ".1em", textTransform: "uppercase" }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={140}>
          <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(34,197,94,0.18)", borderRadius: 20, padding: "30px 26px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${GREEN}60,transparent)` }} />

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
              <span style={{ width: 24, height: 1.5, background: GREEN, borderRadius: 2, display: "inline-block" }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".24em", textTransform: "uppercase", color: GREEN }}>Дозаполнить профиль</span>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Email</label>
                  <IconField icon={FIELD_ICONS.email}>
                    <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" style={inputStyle} onFocus={focus} onBlur={blur} />
                  </IconField>
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <IconField icon={FIELD_ICONS.phone}>
                    <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+998901234567" style={inputStyle} onFocus={focus} onBlur={blur} />
                  </IconField>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Age</label>
                <IconField icon={FIELD_ICONS.age}>
                  <input type="number" value={form.age} onChange={e => set("age", e.target.value)} placeholder="20" style={inputStyle} onFocus={focus} onBlur={blur} />
                </IconField>
              </div>
              <div>
                <label style={labelStyle}>Education place</label>
                <IconField icon={FIELD_ICONS.education_place}>
                  <input type="text" value={form.education_place} onChange={e => set("education_place", e.target.value)} placeholder="TDTU" style={inputStyle} onFocus={focus} onBlur={blur} />
                </IconField>
              </div>
              <div>
                <label style={labelStyle}>Experience</label>
                <IconField icon={FIELD_ICONS.experience}>
                  <input type="text" value={form.experience} onChange={e => set("experience", e.target.value)} placeholder="Tell about yourself" style={inputStyle} onFocus={focus} onBlur={blur} />
                </IconField>
              </div>

              {error && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "11px 15px", fontSize: 13, color: "#f87171" }}>{error}</div>
              )}
              {saved && (
                <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 10, padding: "11px 15px", fontSize: 13, color: GREEN, fontWeight: 600 }}>✓ Сохранено</div>
              )}

              <button type="submit" disabled={saving} style={{
                padding: "14px", background: saving ? "rgba(34,197,94,0.4)" : GREEN,
                border: "none", color: saving ? GREEN : "#000", borderRadius: 12,
                fontSize: 12, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase",
                cursor: saving ? "wait" : "pointer", fontFamily: "'Montserrat',sans-serif",
                boxShadow: saving ? "none" : "0 0 26px rgba(34,197,94,0.25)", transition: "all .25s",
              }}>
                {saving ? "Сохраняем…" : "Сохранить изменения"}
              </button>
            </form>
          </div>
        </FadeIn>
      </main>
    </div>
  );
}
