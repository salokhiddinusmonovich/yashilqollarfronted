import { useState, useEffect, useRef } from "react";
import betrader from "/sponsors/btr.png";
import tdiu from "/sponsors/tdiu.png";
import tosh_eco_bosh_bosh from "/sponsors/tosh_sh_eco_bosh_bosh.png";

const GREEN = "#22C55E";
type Lang = "EN" | "UZ" | "RU";
const LANGS: Lang[] = ["EN", "UZ", "RU"];

// ─── i18n ──────────────────────────────────────────────────────────────────────
const UI: Record<Lang, Record<string, string>> = {
  EN: {
    eyebrow: "Partners & Sponsors",
    title: "Those who make",
    titleGreen: "it possible.",
    subtitle: "Organizations supporting Yashil Qo'llar's mission to restore Uzbekistan's green cover.",
    section_main: "Main Partners",
    become_title: "Become a Partner",
    become_sub: "Partner with Yashil Qo'llar and gain visibility among a growing community of eco-conscious citizens and organizations across Uzbekistan.",
    cta: "Get in Touch →",
    benefits_title: "What you get",
    stat1: "Partners", stat2: "Regions", stat3: "Volunteers", stat4: "Trees planted",
  },
  UZ: {
    eyebrow: "Hamkorlar va Homiylar",
    title: "Buni mumkin qilganlar",
    titleGreen: "ular.",
    subtitle: "Yashil Qo'llarning O'zbekistonni yashillashtirish missiyasini qo'llab-quvvatlayotgan tashkilotlar.",
    section_main: "Asosiy Hamkorlar",
    become_title: "Hamkor bo'ling",
    become_sub: "Yashil Qo'llar bilan hamkorlik qiling va O'zbekiston bo'ylab ekologik jamoatchilik orasida ko'rinishga ega bo'ling.",
    cta: "Bog'lanish →",
    benefits_title: "Nima olasiz",
    stat1: "Hamkorlar", stat2: "Hududlar", stat3: "Ko'ngillilar", stat4: "Ekilgan daraxtlar",
  },
  RU: {
    eyebrow: "Партнёры и спонсоры",
    title: "Те, кто делает",
    titleGreen: "это возможным.",
    subtitle: "Организации, поддерживающие миссию Yashil Qo'llar по восстановлению зелёного покрова Узбекистана.",
    section_main: "Главные партнёры",
    become_title: "Стать партнёром",
    become_sub: "Партнёрство с Yashil Qo'llar даёт видимость среди экосознательного сообщества по всему Узбекистану.",
    cta: "Связаться →",
    benefits_title: "Что вы получаете",
    stat1: "Партнёров", stat2: "Регионов", stat3: "Волонтёров", stat4: "Посажено деревьев",
  },
};

const BENEFITS: Record<Lang, string[]> = {
  EN: ["Logo on all conference and project materials", "Dedicated feature on our website and social channels", "Access to volunteer and community network", "Speaking opportunity at events", "Co-branded planting campaigns"],
  UZ: ["Barcha materiallarda logotip", "Veb-sayt va ijtimoiy tarmoqlarda taqdimot", "Ko'ngilli hamjamiyatiga kirish", "Tadbirlarda nutq so'zlash imkoniyati", "Hamkorlikdagi ekish kampaniyalari"],
  RU: ["Логотип на всех материалах", "Публикация на сайте и в соцсетях", "Доступ к волонтёрскому сообществу", "Возможность выступить на мероприятиях", "Совместные кампании по посадке деревьев"],
};

const PARTNERS = [
  {
    logo: betrader,
    logoBg: "#060924",
    logoFit: "contain" as const,
    logoPadding: 24,
    name: "Be Trader",
    desc: { EN: "Grand sponsor empowering youth development and financial literacy through educational initiatives.", UZ: "Yoshlar rivojlanishi va moliyaviy savodxonlikni qo'llab-quvvatlovchi bosh homiy.", RU: "Главный спонсор, поддерживающий развитие молодёжи и финансовую грамотность." },
    tag: { EN: "MAIN PARTNER", UZ: "ASOSIY HAMKOR", RU: "ГЛАВНЫЙ ПАРТНЁР" },
  },
  {
    logo: tdiu,
    logoBg: "#ffffff",
    logoFit: "contain" as const,
    logoPadding: 16,
    name: "Tashkent State University of Economics",
    desc: { EN: "Host university and academic foundation of the initiative.", UZ: "Tashabbusning mezbon universiteti va akademik asosi.", RU: "Принимающий университет и академическая основа инициативы." },
    tag: { EN: "ACADEMIC PARTNER", UZ: "AKADEMIK HAMKOR", RU: "АКАДЕМИЧЕСКИЙ ПАРТНЁР" },
  },
  {
    logo: tosh_eco_bosh_bosh,
    logoBg: "#060924",
    logoFit: "contain" as const,
    logoPadding: 16,
    name: "Toshkent Ekologiya Bosh Boshqarmasi",
    desc: { EN: "Official ecological partner supporting environmental sustainability and green initiatives across the capital.", UZ: "Poytaxt bo'ylab ekologik barqarorlikni qo'llab-quvvatlovchi rasmiy hamkor.", RU: "Официальный экологический партнёр по всей столице." },
    tag: { EN: "ECO PARTNER", UZ: "EKO HAMKOR", RU: "ЭКО ПАРТНЁР" },
  },
];

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

// ─── FadeIn ────────────────────────────────────────────────────────────────────
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

// ─── Partner card ──────────────────────────────────────────────────────────────
function PartnerCard({ partner, lang, delay }: { partner: typeof PARTNERS[0]; lang: Lang; delay: number }) {
  const [hov, setHov] = useState(false);
  return (
    <FadeIn delay={delay}>
      <div
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
        {/* top shimmer */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: hov ? `linear-gradient(90deg,transparent,${GREEN}70,transparent)` : "transparent", transition: "background .3s" }} />

        {/* Logo */}
        <div style={{
          width: "100%", aspectRatio: "16/9", overflow: "hidden",
          background: partner.logoBg, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: partner.logoPadding, boxSizing: "border-box",
        }}>
          <img src={partner.logo} alt={partner.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: partner.logoFit, transition: "transform .4s", transform: hov ? "scale(1.04)" : "scale(1)" }} />
        </div>

        {/* Content */}
        <div style={{ padding: "20px 22px 24px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 5, background: `${GREEN}14`, color: GREEN, border: `1px solid ${GREEN}28`, alignSelf: "flex-start" }}>
            {partner.tag[lang]}
          </span>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#fff", lineHeight: 1.25 }}>{partner.name}</h3>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.7 }}>{partner.desc[lang]}</p>
        </div>
      </div>
    </FadeIn>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export function SponsorsPage() {
  const [lang, setLang] = useState<Lang>("EN");
  const t = UI[lang];
  const benefits = BENEFITS[lang];

  const stats = [
    { val: "3", label: t.stat1 },
    { val: "6", label: t.stat2 },
    { val: "1,000+", label: t.stat3 },
    { val: "97K+", label: t.stat4 },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#060606", color: "#fff", fontFamily: "'Inter','Helvetica Neue',sans-serif", position: "relative", overflowX: "hidden" }}>
      <ForestCanvas />

      {/* Ambient overlays */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 75% 55% at 8% 18%, rgba(34,197,94,0.1) 0%, transparent 58%), radial-gradient(ellipse 55% 45% at 92% 82%, rgba(34,197,94,0.06) 0%, transparent 55%)"
      }} />

      <main style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "clamp(100px,12vw,140px) clamp(16px,5vw,60px) 100px" }}>

        {/* ── Header ── */}
        <FadeIn>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 56 }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ width: 32, height: 1.5, background: GREEN, borderRadius: 2, display: "inline-block" }} />
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".28em", textTransform: "uppercase", color: GREEN }}>{t.eyebrow}</span>
              </div>
              <h1 style={{ margin: "0 0 14px", fontSize: "clamp(36px,6vw,68px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1 }}>
                <span style={{ color: "#fff" }}>{t.title} </span>
                <span style={{ color: GREEN, textShadow: "0 0 60px rgba(34,197,94,0.4)" }}>{t.titleGreen}</span>
              </h1>
              <p style={{ margin: 0, fontSize: 16, color: "rgba(255,255,255,0.38)", maxWidth: 520, lineHeight: 1.75 }}>{t.subtitle}</p>
            </div>

            {/* Lang switcher */}
            <div style={{ display: "flex", gap: 6, flexShrink: 0, alignSelf: "flex-start", marginTop: 8 }}>
              {LANGS.map(l => (
                <button key={l} onClick={() => setLang(l)} style={{
                  padding: "7px 14px", borderRadius: 8, cursor: "pointer",
                  background: lang === l ? `${GREEN}18` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${lang === l ? GREEN + "45" : "rgba(255,255,255,0.09)"}`,
                  color: lang === l ? GREEN : "rgba(255,255,255,0.4)",
                  fontSize: 11, fontWeight: 800, letterSpacing: ".1em", transition: "all .18s",
                  fontFamily: "'Inter',sans-serif",
                }}>{l}</button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ── Stats strip ── */}
        <FadeIn delay={80}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 1, background: `${GREEN}10`, borderRadius: 16, overflow: "hidden", border: `1px solid ${GREEN}18`, marginBottom: 72 }}>
            {stats.map((s, i) => (
              <div key={i} style={{ padding: "24px 20px", background: "rgba(6,6,6,0.9)", textAlign: "center" }}>
                <div style={{ fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 800, color: GREEN, letterSpacing: "-0.02em", lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 8, letterSpacing: ".1em", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* ── Section label ── */}
        <FadeIn delay={100}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
            <span style={{ width: 28, height: 1.5, background: GREEN, borderRadius: 2, display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".28em", textTransform: "uppercase", color: GREEN, whiteSpace: "nowrap" }}>{t.section_main}</span>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${GREEN}40,transparent)` }} />
          </div>
        </FadeIn>

        {/* ── Partner cards grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20, marginBottom: 80 }}>
          {PARTNERS.map((p, i) => (
            <PartnerCard key={i} partner={p} lang={lang} delay={i * 80} />
          ))}
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(34,197,94,0.2),transparent)", marginBottom: 72 }} />

        {/* ── Become a partner ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 48, alignItems: "start" }}>

          {/* Left: CTA */}
          <FadeIn>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ width: 24, height: 1.5, background: GREEN, borderRadius: 2, display: "inline-block" }} />
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".28em", textTransform: "uppercase", color: GREEN }}>Partnership</span>
              </div>
              <h2 style={{ margin: "0 0 16px", fontSize: "clamp(26px,4vw,44px)", fontWeight: 900, letterSpacing: "-0.025em", lineHeight: 1.05, color: "#fff" }}>
                {t.become_title}
              </h2>
              <p style={{ margin: "0 0 28px", fontSize: 15, color: "rgba(255,255,255,0.4)", lineHeight: 1.75, maxWidth: 420 }}>{t.become_sub}</p>
              <a href="/contact" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: GREEN, color: "#000", border: "none",
                padding: "14px 28px", borderRadius: 11,
                fontSize: 12, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase",
                textDecoration: "none", cursor: "pointer",
                boxShadow: "0 0 32px rgba(34,197,94,0.25)", transition: "all .25s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 48px rgba(34,197,94,0.45)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 32px rgba(34,197,94,0.25)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                {t.cta}
              </a>
            </div>
          </FadeIn>

          {/* Right: Benefits */}
          <FadeIn delay={120}>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "28px 24px", backdropFilter: "blur(8px)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${GREEN}50,transparent)` }} />
              <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.25)", letterSpacing: ".2em", textTransform: "uppercase", marginBottom: 20 }}>{t.benefits_title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {benefits.map((b, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${GREEN}18`, border: `1px solid ${GREEN}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <span style={{ fontSize: 10, color: GREEN }}>✓</span>
                    </div>
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

      </main>
    </div>
  );
}
