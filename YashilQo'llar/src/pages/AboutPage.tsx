import { useState, useEffect, useRef } from "react";
import { useLang } from "../contexts/LanguageContext";

const GREEN = "#22C55E";

const PROJECT_LOCATIONS = [
  { id: "UZ-TK", name: "Toshkent", lat: 41.2995, lon: 69.2401, trees: 12000, vol: 340 },
  { id: "UZ-QR", name: "Qoraqalpogiston", lat: 43.7667, lon: 59.4333, trees: 31000, vol: 640 },
  { id: "UZ-FA", name: "Fargona", lat: 40.3834, lon: 71.7878, trees: 15200, vol: 480 },
  { id: "UZ-SA", name: "Samarqand", lat: 39.6542, lon: 66.9597, trees: 9300, vol: 195 },
  { id: "UZ-NG", name: "Namangan", lat: 41.0011, lon: 71.6725, trees: 7800, vol: 160 },
  { id: "UZ-NW", name: "Navoiy", lat: 40.0840, lon: 65.3792, trees: 22000, vol: 520 },
];

const YANDEX_MAP_URL =
  "https://yandex.uz/map-widget/v1/?ll=63.0000%2C41.5000&z=6&l=map&lang=en_US&pt=" +
  PROJECT_LOCATIONS.map(p => `${p.lon},${p.lat},pm2gnl`).join("~");

// All UI text by language — keyed to LanguageContext lang ("en"|"uz"|"ru")
const UI: Record<string, Record<string, string>> = {
  en: {
    eyebrow: "Yashil Qollar — Green Hands",
    hero1: "We give Uzbekistan",
    hero2: "its green back.",
    heroPara: "Founded in 2021, Yashil Qollar is a community-driven ecological organization restoring forests, green belts, and urban canopy across all 14 regions of Uzbekistan.",
    stat1: "Trees planted", stat2: "Volunteers", stat3: "Active regions", stat4: "Years running",
    missionEyebrow: "Our Mission",
    missionTitle: "Restoration at the scale the crisis demands.",
    missionBody: "Uzbekistan has lost over 50% of its natural forest cover in the last century. The Aral Sea catastrophe turned millions of hectares into salt desert. Yashil Qollar exists to reverse this measurably, region by region.",
    quote: "A tree planted without community is a tree abandoned. We measure success in survival rates, not ceremonies.",
    quoteAuthor: "Aziz Karimov, Founder",
    howLabel: "How We Work",
    teamLabel: "The Team",
    mapLabel: "Active Regions 2026",
    mapTitle: "Where we work.",
    v1t: "Root causes first", v1b: "Every project begins with soil analysis, community consent, and a 10-year maintenance plan.",
    v2t: "Community-led", v2b: "Local families, schools, and farmers design and own each project. We are the facilitators.",
    v3t: "Place-specific", v3b: "Each region gets species, layouts, and water strategies matched to its own climate and culture.",
    v4t: "Radical transparency", v4b: "Every tree is GPS-tagged. Every tenge spent is published. Survival data including failures is public.",
  },
  uz: {
    eyebrow: "Yashil Qollar — Yashil Qollar",
    hero1: "Biz Ozbekistonga",
    hero2: "yashillikni qaytaramiz.",
    heroPara: "2021-yilda tashkil etilgan Yashil Qollar — Ozbekistonning barcha 14 viloyatida ormontiklashtirish va yashil kamarlarni tiklayotgan jamoatchilik tashkiloti.",
    stat1: "Ekilgan daraxtlar", stat2: "Kongillilar", stat3: "Faol hududlar", stat4: "Yil davomida",
    missionEyebrow: "Bizning Missiyamiz",
    missionTitle: "Inqiroz talabiga mos miqyosda tiklanish.",
    missionBody: "Ozbekiston oxirgi asrda tabiiy ormon qoplamining 50 foizidan ortigini yoqotdi. Orol dengizi fojiasi millionlab gektarni shor cholga aylantirdi.",
    quote: "Jamoasiz ekilgan daraxt — tashlab ketilgan daraxt. Biz muvaffaqiyatni omon qolish surati bilan olechaymiz.",
    quoteAuthor: "Aziz Karimov, Asoschi",
    howLabel: "Qanday Ishlaymiz",
    teamLabel: "Jamoa",
    mapLabel: "2026-yil Faol Hududlar",
    mapTitle: "Qayerda ishlaymiz.",
    v1t: "Avvalo ildiz sabablar", v1b: "Har bir loyiha tuproq tahlili va 10 yillik parvarishlash rejasidan boshlanadi.",
    v2t: "Jamoat boshchiligida", v2b: "Mahalliy oilalar, maktablar va fermerlar har bir loyihani ozlari loyihalashtiradi.",
    v3t: "Joy-maxsus", v3b: "Har bir hudud oz iqlimi va madaniyatiga mos turlar va suv strategiyasini oladi.",
    v4t: "Mutlaq shaffoflik", v4b: "Har bir daraxt GPS-belgilangan. Sarflangan har bir som elon qilinadi.",
  },
  ru: {
    eyebrow: "Yashil Qollar — Zelionye Ruki",
    hero1: "My vozvrashchayem Uzbekistanu",
    hero2: "yego zelen.",
    heroPara: "Osnovannyy v 2021 godu, Yashil Qollar vosstanavlivayushchaya lesa i zelionye poyasa vo vsekh 14 regionakh Uzbekistana.",
    stat1: "Posazhenoq derevyev", stat2: "Volonterov", stat3: "Aktivnykh regionov", stat4: "Let raboty",
    missionEyebrow: "Nasha Missiya",
    missionTitle: "Vosstanovleniye v masshtabe, kotorogo trebuyet krizis.",
    missionBody: "Uzbekistan poteryar boleye 50% svoego lesnogo pokrova. Katastrofa Aralskogo morya prevratila milliony gektarov v solyanuyu pustynyu.",
    quote: "Derevo posazhennoye bez obshchestva — eto broshennoye derevo. My izmerya yem uspekh vyzhivayemostyu.",
    quoteAuthor: "Aziz Karimov, Osnovatel",
    howLabel: "Kak My Rabotayem",
    teamLabel: "Komanda",
    mapLabel: "Aktivnyye Regiony 2026",
    mapTitle: "Gde my rabotayem.",
    v1t: "Snachala pervoprichiny", v1b: "Kazhdyy proyekt nachinayetsya s analiza pochvy i plana ukhoda na 10 let.",
    v2t: "Pod rukovodstvom obshchiny", v2b: "Mestnyye semyi i fermery vladeyut kazhdym proyektom.",
    v3t: "Mespetsifichnost", v3b: "Kazhdyy region poluchayot vidy podkhodsyashchiye yego klimatu.",
    v4t: "Radikalnaya prozrachnost", v4b: "Kazhdoye derevo imeyet GPS-metku. Kazhdyy tenge publikuyetsya.",
  },
};

const TEAM_DATA = [
  { name: "Aziz Karimov", roles: { en: "Founder and CEO", uz: "Asoschisi va Bosh Direktor", ru: "Osnovatel i CEO" }, initials: "AK", color: "#10b981" },
  { name: "Malika Yusupova", roles: { en: "Head of Reforestation", uz: "Ormontiklashtirish rahbari", ru: "Rukovoditel Reforestation" }, initials: "MY", color: "#34d399" },
  { name: "Jasur Toshmatov", roles: { en: "Community Lead", uz: "Jamoat rahbari", ru: "Rukovoditel soobshchestva" }, initials: "JT", color: "#6ee7b7" },
  { name: "Nilufar Ergasheva", roles: { en: "Research and Development", uz: "Tadqiqot va rivojlanish", ru: "Issledovaniya i razrabotki" }, initials: "NE", color: "#a7f3d0" },
];

function ForestCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!; const ctx = canvas.getContext("2d")!;
    let id: number, w: number, h: number;
    const nodes: any[] = [], leaves: any[] = [], pulses: any[] = [];
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    const init = () => {
      resize(); nodes.length = 0; leaves.length = 0; pulses.length = 0;
      for (let i = 0; i < 85; i++) nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45, r: Math.random() * 2.2 + .5, a: Math.random() * .7 + .2, pulse: Math.random() * Math.PI * 2, ps: Math.random() * .028 + .01 });
      for (let i = 0; i < 26; i++) leaves.push({ x: Math.random() * w, y: Math.random() * h + h, vx: (Math.random() - .5) * .65, vy: -(Math.random() * .9 + .28), size: Math.random() * 12 + 5, rot: Math.random() * Math.PI * 2, vrot: (Math.random() - .5) * .022, a: Math.random() * .4 + .13, wobble: Math.random() * Math.PI * 2, ws: Math.random() * .022 + .008, hue: Math.random() * 30 });
      for (let i = 0; i < 6; i++) pulses.push({ x: Math.random() * w, y: Math.random() * h, r: 0, maxR: Math.random() * 200 + 80, speed: Math.random() * .8 + .4, delay: i * 38 });
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
      for (const p of pulses) { if (frame < p.delay) continue; p.r += p.speed; if (p.r > p.maxR) { p.r = 0; p.x = Math.random() * w; p.y = Math.random() * h; p.maxR = Math.random() * 200 + 80; } const fade = 1 - p.r / p.maxR; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.strokeStyle = `rgba(34,197,94,${.18 * fade})`; ctx.lineWidth = 1.5; ctx.stroke(); }
      for (let i = 0; i < nodes.length; i++)for (let j = i + 1; j < nodes.length; j++) { const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, d = Math.sqrt(dx * dx + dy * dy); if (d < 160) { ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.strokeStyle = `rgba(34,197,94,${.18 * (1 - d / 160)})`; ctx.lineWidth = .8; ctx.stroke(); } }
      for (const n of nodes) { n.pulse += n.ps; n.x += n.vx; n.y += n.vy; if (n.x < 0) n.x = w; if (n.x > w) n.x = 0; if (n.y < 0) n.y = h; if (n.y > h) n.y = 0; const pa = n.a * (.65 + .35 * Math.sin(n.pulse)); const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5); grd.addColorStop(0, `rgba(34,197,94,${pa * .6})`); grd.addColorStop(1, "transparent"); ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill(); ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(34,197,94,${pa})`; ctx.fill(); }
      for (const l of leaves) { l.wobble += l.ws; l.x += l.vx + Math.sin(l.wobble) * .55; l.y += l.vy; l.rot += l.vrot; if (l.y < -30) { l.y = h + 30; l.x = Math.random() * w; } drawLeaf(l.x, l.y, l.size, l.rot, l.a, l.hue); }
      id = requestAnimationFrame(tick);
    };
    init(); tick(); window.addEventListener("resize", init);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", init); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

function FadeIn({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null); const [vis, setVis] = useState(false);
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.06 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, []);
  return (<div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(26px)", transition: `opacity .85s cubic-bezier(.16,1,.3,1) ${delay}ms,transform .85s cubic-bezier(.16,1,.3,1) ${delay}ms`, ...style }}>{children}</div>);
}

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0); const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; obs.disconnect(); let cur = 0; const step = Math.ceil(value / 55); const t = setInterval(() => { cur = Math.min(cur + step, value); setDisplay(cur); if (cur >= value) clearInterval(t); }, 20); }, [{ threshold: .4 }]); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, [value]);
  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
}

function Divider() { return <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(34,197,94,0.22),transparent)", margin: "0 0 72px" }} />; }

function SectionLabel({ label }: { label: string }) {
  return (<div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}><span style={{ width: 28, height: 1.5, background: GREEN, borderRadius: 2, display: "inline-block", flexShrink: 0 }} /><span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".28em", textTransform: "uppercase", color: GREEN }}>{label}</span></div>);
}

function ValueCard({ icon, title, body, delay }: { icon: string; title: string; body: string; delay: number }) {
  const [hov, setHov] = useState(false);
  return (<FadeIn delay={delay}><div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${hov ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 16, padding: "26px 22px", transition: "all .25s", transform: hov ? "translateY(-4px)" : "translateY(0)", backdropFilter: "blur(8px)", position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: hov ? `linear-gradient(90deg,transparent,${GREEN}60,transparent)` : "transparent", transition: "background .28s" }} /><span style={{ fontSize: 26, display: "block", marginBottom: 14 }}>{icon}</span><h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 10px", color: "#fff" }}>{title}</h3><p style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.72, margin: 0 }}>{body}</p></div></FadeIn>);
}

function TeamCard({ member, lang, delay }: { member: typeof TEAM_DATA[0]; lang: string; delay: number }) {
  const [hov, setHov] = useState(false);
  const roleText = (member.roles as any)[lang] || member.roles.en;
  return (<FadeIn delay={delay}><div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${hov ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.07)"}`, borderRadius: 16, padding: "24px 20px", display: "flex", flexDirection: "column", gap: 14, transition: "all .25s", transform: hov ? "translateY(-4px)" : "translateY(0)", backdropFilter: "blur(8px)" }}><div style={{ width: 52, height: 52, borderRadius: "50%", background: `${member.color}1a`, border: `1.5px solid ${member.color}45`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: member.color }}>{member.initials}</div><div><div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#fff" }}>{member.name}</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)" }}>{roleText}</div></div></div></FadeIn>);
}

export function AboutPage() {
  const { lang } = useLang();
  const [activePin, setActivePin] = useState<string | null>(null);

  // Use LanguageContext lang ("en"|"uz"|"ru"), fallback to "en"
  const t = UI[lang] || UI.en;

  const totalTrees = PROJECT_LOCATIONS.reduce((s, p) => s + p.trees, 0);
  const totalVol = PROJECT_LOCATIONS.reduce((s, p) => s + p.vol, 0);

  const stats = [
    { val: totalTrees, suf: "+", label: t.stat1 },
    { val: totalVol, suf: "+", label: t.stat2 },
    { val: 6, suf: "", label: t.stat3 },
    { val: 4, suf: "", label: t.stat4 },
  ];

  const values = [
    { icon: "🌱", title: t.v1t, body: t.v1b },
    { icon: "🤝", title: t.v2t, body: t.v2b },
    { icon: "📍", title: t.v3t, body: t.v3b },
    { icon: "📊", title: t.v4t, body: t.v4b },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#060606", color: "#fff", fontFamily: "'Inter','Helvetica Neue',sans-serif", position: "relative", overflowX: "hidden" }}>
      <ForestCanvas />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 80% 60% at 12% 22%, rgba(34,197,94,0.11) 0%, transparent 60%), radial-gradient(ellipse 55% 50% at 88% 78%, rgba(16,185,129,0.07) 0%, transparent 55%)" }} />

      <main style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "clamp(100px,12vw,140px) clamp(16px,5vw,60px) 100px" }}>

        {/* HERO */}
        <FadeIn>
          <SectionLabel label={t.eyebrow} />
          <h1 style={{ margin: "0 0 24px", fontSize: "clamp(42px,7vw,86px)", fontWeight: 900, lineHeight: .98, letterSpacing: "-0.03em" }}>
            <span style={{ color: "#fff", display: "block" }}>{t.hero1}</span>
            <span style={{ color: GREEN, display: "block", textShadow: "0 0 80px rgba(34,197,94,0.4)" }}>{t.hero2}</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.48)", fontSize: "clamp(15px,2vw,18px)", maxWidth: 560, lineHeight: 1.78, margin: "0 0 64px" }}>{t.heroPara}</p>
        </FadeIn>

        {/* STATS */}
        <FadeIn delay={120}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 1, background: `${GREEN}10`, borderRadius: 20, overflow: "hidden", border: `1px solid ${GREEN}16`, marginBottom: 80 }}>
            {stats.map((s, i) => (
              <div key={i} style={{ padding: "32px 20px", background: "rgba(6,6,6,0.92)", textAlign: "center" }}>
                <div style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, color: GREEN, letterSpacing: "-0.03em", lineHeight: 1 }}><Counter value={s.val} suffix={s.suf} /></div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 10, letterSpacing: ".1em", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        <Divider />

        {/* MISSION */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 56, alignItems: "center", marginBottom: 80 }}>
          <FadeIn>
            <SectionLabel label={t.missionEyebrow} />
            <h2 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 20px" }}>{t.missionTitle}</h2>
            <p style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.82, fontSize: 15, margin: 0 }}>{t.missionBody}</p>
          </FadeIn>
          <FadeIn delay={140}>
            <div style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.18)", borderLeft: `3px solid ${GREEN}`, borderRadius: "0 16px 16px 0", padding: "32px 28px", backdropFilter: "blur(8px)" }}>
              <p style={{ fontSize: "clamp(15px,2.2vw,21px)", fontWeight: 300, lineHeight: 1.68, color: "rgba(255,255,255,0.82)", fontStyle: "italic", margin: "0 0 16px" }}>"{t.quote}"</p>
              <p style={{ fontSize: 13, color: GREEN, margin: 0, fontWeight: 700 }}>— {t.quoteAuthor}</p>
            </div>
          </FadeIn>
        </div>

        <Divider />

        {/* VALUES */}
        <FadeIn><SectionLabel label={t.howLabel} /></FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 14, marginBottom: 80 }}>
          {values.map((v, i) => <ValueCard key={i} icon={v.icon} title={v.title} body={v.body} delay={i * 70} />)}
        </div>

        <Divider />

        {/* TEAM */}
        <FadeIn><SectionLabel label={t.teamLabel} /></FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14, marginBottom: 80 }}>
          {TEAM_DATA.map((m, i) => <TeamCard key={i} member={m} lang={lang} delay={i * 65} />)}
        </div>

        <Divider />

        {/* MAP */}
        <FadeIn>
          <SectionLabel label={t.mapLabel} />
          <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 36px" }}>{t.mapTitle}</h2>
        </FadeIn>
        <FadeIn delay={100}>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(34,197,94,0.18)", borderRadius: 24, padding: 24, position: "relative", overflow: "hidden", backdropFilter: "blur(8px)" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${GREEN}50,transparent)` }} />
            <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid rgba(34,197,94,0.1)", marginBottom: 16 }}>
              <iframe src={YANDEX_MAP_URL} title="Project locations" width="100%" height="420" style={{ display: "block", border: "none" }} allowFullScreen />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 8 }}>
              {PROJECT_LOCATIONS.map(loc => (
                <button key={loc.id} onClick={() => setActivePin(activePin === loc.id ? null : loc.id)} style={{ background: activePin === loc.id ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.025)", border: `1px solid ${activePin === loc.id ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.07)"}`, borderRadius: 11, padding: "10px 14px", textAlign: "left", cursor: "pointer", color: "#fff", fontFamily: "'Inter',sans-serif", transition: "all .2s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: GREEN, boxShadow: `0 0 6px ${GREEN}`, flexShrink: 0, display: "inline-block" }} />
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{loc.name}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", display: "flex", gap: 12 }}>
                    <span>🌳 {loc.trees.toLocaleString()}</span><span>👤 {loc.vol}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </FadeIn>
      </main>
    </div>
  );
}