import { useState, useEffect, useRef } from "react";
import { useLang } from "../contexts/LanguageContext";
import { ENDPOINTS, baseHeaders, fixMediaUrl } from "../config/api";

const GREEN = "#22C55E";

const UI: Record<string, Record<string, string>> = {
  en: {
    eyebrow: "Partners & Sponsors",
    title: "Those who make", titleGreen: "it possible.",
    subtitle: "Organizations supporting Yashil Qo'llar's mission to restore Uzbekistan's green cover.",
    loading: "Loading partners…", error: "Couldn't load partners. Please try again.", retry: "Retry",
    empty: "No partners listed yet.",
  },
  uz: {
    eyebrow: "Hamkorlar va Homiylar",
    title: "Buni mumkin qilganlar", titleGreen: "ular.",
    subtitle: "Yashil Qo'llarning O'zbekistonni yashillashtirish missiyasini qo'llab-quvvatlayotgan tashkilotlar.",
    loading: "Hamkorlar yuklanmoqda…", error: "Hamkorlarni yuklab bo'lmadi. Qayta urinib ko'ring.", retry: "Qayta urinish",
    empty: "Hozircha hamkorlar yo'q.",
  },
  ru: {
    eyebrow: "Партнёры и спонсоры",
    title: "Те, кто делает", titleGreen: "это возможным.",
    subtitle: "Организации, поддерживающие миссию Yashil Qo'llar по восстановлению зелёного покрова Узбекистана.",
    loading: "Загружаем партнёров…", error: "Не удалось загрузить партнёров. Попробуйте ещё раз.", retry: "Повторить",
    empty: "Пока нет партнёров.",
  },
};

interface Partner {
  id: number; name: string; description: string | null; logo: string | null;
  instagram: string | null; telegram: string | null; linkedin: string | null;
}

// ─── Forest canvas ─────────────────────────────────────────────────────────────
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
      for (let i = 0; i < 80; i++) nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45, r: Math.random() * 2 + .5, a: Math.random() * .65 + .2, pulse: Math.random() * Math.PI * 2, ps: Math.random() * .028 + .01 });
      for (let i = 0; i < 22; i++) leaves.push({ x: Math.random() * w, y: Math.random() * h + h, vx: (Math.random() - .5) * .65, vy: -(Math.random() * .85 + .28), size: Math.random() * 12 + 5, rot: Math.random() * Math.PI * 2, vrot: (Math.random() - .5) * .022, a: Math.random() * .38 + .13, wobble: Math.random() * Math.PI * 2, ws: Math.random() * .022 + .008, hue: Math.random() * 30 });
      for (let i = 0; i < 5; i++) pulses.push({ x: Math.random() * w, y: Math.random() * h, r: 0, maxR: Math.random() * 180 + 80, speed: Math.random() * .8 + .4, delay: i * 40 });
    };
    const drawLeaf = (x: number, y: number, size: number, rot: number, alpha: number, hue: number) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha;
      ctx.beginPath(); ctx.moveTo(0, -size); ctx.bezierCurveTo(size * .7, -size * .6, size * .7, size * .5, 0, size * .35); ctx.bezierCurveTo(-size * .7, size * .5, -size * .7, -size * .6, 0, -size);
      const g = ctx.createLinearGradient(0, -size, 0, size * .35); g.addColorStop(0, `hsl(${142 + hue},80%,52%)`); g.addColorStop(1, `hsl(${155 + hue},72%,38%)`);
      ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.moveTo(0, -size * .85); ctx.quadraticCurveTo(size * .08, 0, 0, size * .3); ctx.strokeStyle = "rgba(255,255,255,0.22)"; ctx.lineWidth = .85; ctx.stroke();
      ctx.restore(); ctx.globalAlpha = 1;
    };
    let frame = 0;
    const tick = () => {
      frame++; ctx.clearRect(0, 0, w, h);
      for (const p of pulses) {
        if (frame < p.delay) continue;
        p.r += p.speed;
        if (p.r > p.maxR) { p.r = 0; p.x = Math.random() * w; p.y = Math.random() * h; p.maxR = Math.random() * 180 + 80; }
        const fade = 1 - p.r / p.maxR;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.strokeStyle = `rgba(34,197,94,${.18 * fade})`; ctx.lineWidth = 1.5; ctx.stroke();
      }
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 155) { ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.strokeStyle = `rgba(34,197,94,${.17 * (1 - d / 155)})`; ctx.lineWidth = .78; ctx.stroke(); }
      }
      for (const n of nodes) {
        n.pulse += n.ps; n.x += n.vx; n.y += n.vy;
        if (n.x < 0) n.x = w; if (n.x > w) n.x = 0; if (n.y < 0) n.y = h; if (n.y > h) n.y = 0;
        const pa = n.a * (.65 + .35 * Math.sin(n.pulse));
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
        grd.addColorStop(0, `rgba(34,197,94,${pa * .55})`); grd.addColorStop(1, "transparent");
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(34,197,94,${pa})`; ctx.fill();
      }
      for (const l of leaves) {
        l.wobble += l.ws; l.x += l.vx + Math.sin(l.wobble) * .5; l.y += l.vy; l.rot += l.vrot;
        if (l.y < -30) { l.y = h + 30; l.x = Math.random() * w; }
        drawLeaf(l.x, l.y, l.size, l.rot, l.a, l.hue);
      }
      id = requestAnimationFrame(tick);
    };
    init(); tick();
    window.addEventListener("resize", init);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", init); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.06 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)", transition: `opacity .8s cubic-bezier(.16,1,.3,1) ${delay}ms,transform .8s cubic-bezier(.16,1,.3,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

function TelegramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="yq-partner-icon" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="yq-partner-icon" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" strokeWidth="2.5" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="yq-partner-icon" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="4" />
      <path d="M7.5 10v6.5M7.5 7.5v.01" strokeLinecap="round" />
      <path d="M11.5 16.5V12.7c0-1.2.9-2.2 2.1-2.2 1.2 0 1.9.9 1.9 2.2v3.8M11.5 10.3v6.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Partner card ──────────────────────────────────────────────────────────────
function PartnerCard({ partner, delay }: { partner: Partner; delay: number }) {
  const [hov, setHov] = useState(false);
  const logoUrl = fixMediaUrl(partner.logo);

  return (
    <FadeIn delay={delay}>
      <div
        className="yq-partner-card"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: "rgba(255,255,255,0.025)",
          border: `1px solid ${hov ? GREEN + "50" : "rgba(255,255,255,0.08)"}`,
          borderRadius: 20, overflow: "hidden",
          transition: "all .28s ease",
          transform: hov ? "translateY(-6px)" : "translateY(0)",
          boxShadow: hov ? "0 24px 60px rgba(34,197,94,0.12)" : "none",
          backdropFilter: "blur(10px)",
          position: "relative",
          display: "flex", flexDirection: "column",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: hov ? `linear-gradient(90deg,transparent,${GREEN}70,transparent)` : "transparent", transition: "background .3s" }} />

        <div style={{ width: "100%", aspectRatio: "16/9", overflow: "hidden", background: "#0e0e14", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {logoUrl ? (
            <img src={logoUrl} alt={partner.name} style={{ maxWidth: "88%", maxHeight: "88%", objectFit: "contain", transition: "transform .4s", transform: hov ? "scale(1.04)" : "scale(1)" }} />
          ) : (
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", fontWeight: 700 }}>{partner.name}</span>
          )}
        </div>

        <div style={{ padding: "20px 22px 24px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#fff", lineHeight: 1.25 }}>{partner.name}</h3>
          {partner.description && <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.7 }}>{partner.description}</p>}

          {(partner.telegram || partner.instagram || partner.linkedin) && (
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              {partner.telegram && (
                <a href={partner.telegram} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.18)", borderRadius: 8, textDecoration: "none", color: GREEN, fontSize: 11.5, fontWeight: 600 }}>
                  <TelegramIcon /> Telegram
                </a>
              )}
              {partner.instagram && (
                <a href={partner.instagram} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "rgba(244,114,182,0.08)", border: "1px solid rgba(244,114,182,0.2)", borderRadius: 8, textDecoration: "none", color: "#F472B6", fontSize: 11.5, fontWeight: 600 }}>
                  <InstagramIcon /> Instagram
                </a>
              )}
              {partner.linkedin && (
                <a href={partner.linkedin} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 8, textDecoration: "none", color: "#38BDF8", fontSize: 11.5, fontWeight: 600 }}>
                  <LinkedInIcon /> LinkedIn
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export function SponsorsPage() {
  const { lang } = useLang();
  const t = UI[lang] || UI.en;

  const [partners, setPartners] = useState<Partner[] | null>(null);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setPartners(null);
    setError(false);
    fetch(ENDPOINTS.partners, { headers: baseHeaders(lang) })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(setPartners)
      .catch(() => setError(true));
  }, [lang, reloadKey]);

  return (
    <div style={{ minHeight: "100vh", background: "#060606", color: "#fff", fontFamily: "'Inter','Helvetica Neue',sans-serif", position: "relative", overflowX: "hidden" }}>
      <ForestCanvas />

      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 75% 55% at 8% 18%, rgba(34,197,94,0.1) 0%, transparent 58%), radial-gradient(ellipse 55% 45% at 92% 82%, rgba(34,197,94,0.06) 0%, transparent 55%)"
      }} />

      <main style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "clamp(100px,12vw,140px) clamp(16px,5vw,60px) 100px" }}>

        <FadeIn>
          <div style={{ marginBottom: 56 }}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".28em", textTransform: "uppercase", color: GREEN }}>{t.eyebrow}</span>
            <h1 style={{ margin: "10px 0 14px", fontSize: "clamp(36px,6vw,68px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1 }}>
              <span style={{ color: "#fff" }}>{t.title} </span>
              <span style={{ color: GREEN, textShadow: "0 0 60px rgba(34,197,94,0.4)" }}>{t.titleGreen}</span>
            </h1>
            <p style={{ margin: 0, fontSize: 16, color: "rgba(255,255,255,0.38)", maxWidth: 520, lineHeight: 1.75 }}>{t.subtitle}</p>
          </div>
        </FadeIn>

        {!partners && !error && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "80px 0", color: "rgba(255,255,255,0.4)" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", border: "3px solid rgba(34,197,94,0.15)", borderTopColor: GREEN, animation: "yq-spin .8s linear infinite" }} />
            <span style={{ fontSize: 13 }}>{t.loading}</span>
          </div>
        )}

        {error && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "80px 0", textAlign: "center" }}>
            <span style={{ fontSize: 32 }}>⚠️</span>
            <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>{t.error}</p>
            <button onClick={() => setReloadKey(k => k + 1)} style={{ background: GREEN, border: "none", color: "#000", padding: "10px 22px", borderRadius: 10, fontSize: 12, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", cursor: "pointer" }}>{t.retry}</button>
          </div>
        )}

        {!error && partners && partners.length === 0 && (
          <p style={{ color: "rgba(255,255,255,0.35)", textAlign: "center", padding: "60px 0" }}>{t.empty}</p>
        )}

        {!error && partners && partners.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20, marginBottom: 80 }}>
            {partners.map((p, i) => <PartnerCard key={p.id} partner={p} delay={i * 80} />)}
          </div>
        )}

      </main>

      <style>{`
        @keyframes yq-spin { to { transform: rotate(360deg); } }
        @keyframes yq-partner-icon-glow { 0%,100% { filter: drop-shadow(0 0 0px currentColor); transform: scale(1); } 50% { filter: drop-shadow(0 0 6px currentColor); transform: scale(1.15); } }
        .yq-partner-card:hover .yq-partner-icon { animation: yq-partner-icon-glow 1s ease-in-out infinite; }
      `}</style>
    </div>
  );
}