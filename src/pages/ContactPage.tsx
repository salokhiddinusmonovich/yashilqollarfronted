import { useState, useEffect, useRef } from "react";
import { useLang } from "../contexts/LanguageContext";

const GREEN = "#22C55E";
const DARK = "#060606";

type PageLang = "en" | "ru" | "uz";

const PAGE_UI: Record<PageLang, {
  eyebrow: string; title1: string; titleGreen: string; subtitle: string;
  contactDesc: string[]; locationLabel: string; responseText: string; responseHours: string;
  faqLabel: string; faq: { q: string; a: string }[];
}> = {
  en: {
    eyebrow: "Get in Touch",
    title1: "Let's unite",
    titleGreen: "for nature.",
    subtitle: "Volunteering, partnership, or just a question — pick whichever channel works for you below.",
    contactDesc: [
      "Registration, profile, and project participation",
      "News, project announcements, and reports",
      "Photos and videos from our events",
      "Partnerships, media, and general questions",
    ],
    locationLabel: "Our base",
    responseText: "We usually reply within",
    responseHours: "24 hours",
    faqLabel: "Frequently Asked Questions",
    faq: [
      { q: "How can I become a Yashil Qo'llar volunteer?", a: "We regularly run ecological actions, plogging events, and training sessions across Uzbekistan. Message us on our Telegram bot or channel — we'll connect you with the nearest event." },
      { q: "Can organizations partner with you?", a: "Yes. We work with schools, universities, businesses, and government bodies — from joint ecological actions to opening eco-clubs on-site. Message us to discuss the format." },
      { q: "What do volunteers actually do at events?", a: "Cleaning up areas and sorting waste, plogging (picking up litter while running or walking), recycling workshops, ecological safety trainings, and running eco-clubs in schools and universities." },
      { q: "How do you share results?", a: "We cover every event on our Telegram channel and social media — photos, videos, eco-challenges, and posts about what's been done. Transparency matters to us." },
    ],
  },
  ru: {
    eyebrow: "Свяжитесь с нами",
    title1: "Объединимся",
    titleGreen: "ради природы.",
    subtitle: "Волонтёрство, партнёрство или просто вопрос — выберите удобный канал ниже.",
    contactDesc: [
      "Регистрация, профиль и участие в проектах",
      "Новости, анонсы проектов и отчёты",
      "Фото и видео с наших мероприятий",
      "Партнёрства, СМИ и общие вопросы",
    ],
    locationLabel: "Наша база",
    responseText: "Обычно отвечаем в течение",
    responseHours: "24 часов",
    faqLabel: "Частые вопросы",
    faq: [
      { q: "Как я могу стать волонтёром Yashil Qo'llar?", a: "Мы регулярно проводим экоакции, плоггинги и обучающие мероприятия по всему Узбекистану. Напишите нам в Telegram-боте или канале — подключим вас к ближайшему мероприятию в вашем регионе." },
      { q: "Можно ли организациям сотрудничать с вами?", a: "Да. Мы работаем со школами, вузами, бизнесом и госорганами — от совместных экоакций до открытия эко-клубов на базе учреждения. Напишите нам, обсудим формат." },
      { q: "Чем конкретно занимаются волонтёры на мероприятиях?", a: "Уборка территорий и сортировка отходов, плоггинг (сбор мусора во время бега или ходьбы), обучение переработке отходов, тренинги по экологической безопасности и работа в эко-клубах при школах и вузах." },
      { q: "Как вы рассказываете о результатах?", a: "Мы освещаем каждое мероприятие в Telegram-канале и соцсетях — фото, видео, экочелленджи и посты о том, что уже сделано. Прозрачность для нас принципиальна." },
    ],
  },
  uz: {
    eyebrow: "Biz bilan bog'laning",
    title1: "Tabiat uchun",
    titleGreen: "birlashamiz.",
    subtitle: "Ko'ngillilik, hamkorlik yoki shunchaki savol — quyidagi qulay kanalni tanlang.",
    contactDesc: [
      "Ro'yxatdan o'tish, profil va loyihalarda ishtirok",
      "Yangiliklar, loyiha e'lonlari va hisobotlar",
      "Tadbirlarimizdan foto va videolar",
      "Hamkorlik, OAV va umumiy savollar",
    ],
    locationLabel: "Bizning bazamiz",
    responseText: "Odatda",
    responseHours: "24 soat ichida javob beramiz",
    faqLabel: "Tez-tez so'raladigan savollar",
    faq: [
      { q: "Yashil Qo'llarga qanday ko'ngilli bo'lsam bo'ladi?", a: "Biz O'zbekiston bo'ylab muntazam ravishda ekologik aksiyalar, plogging va o'quv tadbirlarini o'tkazamiz. Telegram-botimiz yoki kanalimizga yozing — sizni eng yaqin tadbirga bog'laymiz." },
      { q: "Tashkilotlar siz bilan hamkorlik qila oladimi?", a: "Ha. Biz maktablar, universitetlar, biznes va davlat organlari bilan ishlaymiz — birgalikdagi ekologik aksiyalardan tortib, muassasa negizida eko-klublar ochishgacha. Formatni muhokama qilish uchun yozing." },
      { q: "Tadbirlarda ko'ngillilar aniq nima qiladi?", a: "Hududlarni tozalash va chiqindilarni saralash, plogging (yugurish yoki yurish paytida chiqindi yig'ish), qayta ishlash bo'yicha mashg'ulotlar, ekologik xavfsizlik treninglari va maktab/universitetlardagi eko-klublar faoliyati." },
      { q: "Natijalar haqida qanday ma'lumot berasiz?", a: "Har bir tadbirni Telegram-kanalimiz va ijtimoiy tarmoqlarda yoritamiz — foto, video, ekologik challenge'lar va qilingan ishlar haqida postlar. Shaffoflik biz uchun muhim." },
    ],
  },
};

/* ─────────────────────────────────────────
   КОНТАКТЫ
   Замени href на реальные ссылки бота/канала.
───────────────────────────────────────── */
const contacts = [
  {
    label: "Telegram Bot",
    value: "@yashilqollar_bot",
    href: "https://t.me/yashilqollar_bot",
    icon: (
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    accent: GREEN,
  },
  {
    label: "Telegram Channel",
    value: "@yashilqollar",
    href: "https://t.me/yashilqollar",
    icon: (
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="yq-icon-pulse">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    accent: "#38BDF8",
  },
  {
    label: "Instagram",
    value: "@yashilqollar",
    href: "https://instagram.com/yashilqollar",
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="yq-icon-pulse">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" strokeWidth="2" />
      </svg>
    ),
    accent: "#F472B6",
  },
  {
    label: "Email",
    value: "yashilqollar@gmail.com",
    href: "mailto:yashilqollar@gmail.com",
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    accent: "#FACC15",
  },
];

/* ─────────────────────────────────────────
   ФОНОВЫЙ CANVAS (без изменений в логике)
───────────────────────────────────────── */
function ForestCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!; const ctx = canvas.getContext("2d")!;
    let id: number, w: number, h: number;
    const nodes: any[] = [], leaves: any[] = [], pulses: any[] = [];
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    const init = () => {
      resize(); nodes.length = 0; leaves.length = 0; pulses.length = 0;
      for (let i = 0; i < 90; i++) nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5, r: Math.random() * 2.2 + .6, a: Math.random() * .7 + .2, pulse: Math.random() * Math.PI * 2, pulseSpeed: Math.random() * .03 + .01 });
      for (let i = 0; i < 28; i++) leaves.push({ x: Math.random() * w, y: Math.random() * h + h, vx: (Math.random() - .5) * .7, vy: -(Math.random() * .9 + .3), size: Math.random() * 12 + 6, rot: Math.random() * Math.PI * 2, vrot: (Math.random() - .5) * .025, a: Math.random() * .4 + .15, wobble: Math.random() * Math.PI * 2, wobbleSpeed: Math.random() * .025 + .008, hue: Math.random() * 30 });
      for (let i = 0; i < 6; i++) pulses.push({ x: Math.random() * w, y: Math.random() * h, r: 0, maxR: Math.random() * 200 + 80, speed: Math.random() * .8 + .4, delay: Math.random() * 200 });
    };
    const drawLeaf = (x: number, y: number, size: number, rot: number, alpha: number, hue: number) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha; ctx.beginPath(); ctx.moveTo(0, -size); ctx.bezierCurveTo(size * .7, -size * .6, size * .7, size * .5, 0, size * .35); ctx.bezierCurveTo(-size * .7, size * .5, -size * .7, -size * .6, 0, -size); const g = ctx.createLinearGradient(0, -size, 0, size * .35); g.addColorStop(0, `hsl(${142 + hue},80%,52%)`); g.addColorStop(1, `hsl(${155 + hue},72%,38%)`); ctx.fillStyle = g; ctx.fill(); ctx.beginPath(); ctx.moveTo(0, -size * .85); ctx.quadraticCurveTo(size * .1, 0, 0, size * .3); ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.lineWidth = .9; ctx.stroke(); ctx.restore(); ctx.globalAlpha = 1; };
    let frame = 0;
    const tick = () => { frame++; ctx.clearRect(0, 0, w, h); for (const p of pulses) { if (frame < p.delay) continue; p.r += p.speed; if (p.r > p.maxR) { p.r = 0; p.x = Math.random() * w; p.y = Math.random() * h; p.maxR = Math.random() * 200 + 80; } const fade = 1 - p.r / p.maxR; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.strokeStyle = `rgba(34,197,94,${.18 * fade})`; ctx.lineWidth = 1.5; ctx.stroke(); } for (let i = 0; i < nodes.length; i++)for (let j = i + 1; j < nodes.length; j++) { const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, d = Math.sqrt(dx * dx + dy * dy); if (d < 160) { ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.strokeStyle = `rgba(34,197,94,${.18 * (1 - d / 160)})`; ctx.lineWidth = .8; ctx.stroke(); } } for (const n of nodes) { n.pulse += n.pulseSpeed; n.x += n.vx; n.y += n.vy; if (n.x < 0) n.x = w; if (n.x > w) n.x = 0; if (n.y < 0) n.y = h; if (n.y > h) n.y = 0; const pa = n.a * (.7 + .3 * Math.sin(n.pulse)); const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4); grd.addColorStop(0, `rgba(34,197,94,${pa * .6})`); grd.addColorStop(1, "transparent"); ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill(); ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(34,197,94,${pa})`; ctx.fill(); } for (const l of leaves) { l.wobble += l.wobbleSpeed; l.x += l.vx + Math.sin(l.wobble) * .55; l.y += l.vy; l.rot += l.vrot; if (l.y < -30) { l.y = h + 30; l.x = Math.random() * w; } drawLeaf(l.x, l.y, l.size, l.rot, l.a, l.hue); } id = requestAnimationFrame(tick); };
    init(); tick(); window.addEventListener("resize", init);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", init); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

function FadeIn({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null); const [vis, setVis] = useState(false);
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.06 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, []);
  return (<div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(26px)", transition: `opacity .8s cubic-bezier(.16,1,.3,1) ${delay}ms,transform .8s cubic-bezier(.16,1,.3,1) ${delay}ms`, ...style }}>{children}</div>);
}

/* ─────────────────────────────────────────
   БОЛЬШАЯ КАРТОЧКА КОНТАКТА
───────────────────────────────────────── */
function ContactCard({ c, desc, delay }: { c: typeof contacts[0]; desc: string; delay: number }) {
  const [hov, setHov] = useState(false);
  return (
    <FadeIn delay={delay}>
      <a
        href={c.href}
        target="_blank"
        rel="noreferrer"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className="yq-contact-card"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          background: hov ? `${c.accent}12` : "rgba(255,255,255,0.025)",
          border: `1px solid ${hov ? c.accent + "55" : "rgba(255,255,255,0.08)"}`,
          borderRadius: 18,
          padding: "22px 22px",
          textDecoration: "none",
          transition: "all .22s ease",
          transform: hov ? "translateY(-4px)" : "translateY(0)",
          position: "relative",
          overflow: "hidden",
          backdropFilter: "blur(8px)",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: hov ? `linear-gradient(90deg,transparent,${c.accent}80,transparent)` : "transparent", transition: "background .3s" }} />
        <div style={{
          width: 52, height: 52, borderRadius: 14, flexShrink: 0,
          background: hov ? `${c.accent}20` : "rgba(255,255,255,0.05)",
          border: `1px solid ${hov ? c.accent + "50" : "rgba(255,255,255,0.09)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: hov ? c.accent : "rgba(255,255,255,0.4)",
          transition: "all .22s",
        }}>{c.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.28)", letterSpacing: ".2em", textTransform: "uppercase", marginBottom: 5 }}>{c.label}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: hov ? "#fff" : "rgba(255,255,255,0.75)", transition: "color .2s", marginBottom: 3, wordBreak: "break-word" }}>{c.value}</div>
          <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>{desc}</div>
        </div>
        <div style={{ color: hov ? c.accent : "rgba(255,255,255,0.15)", fontSize: 20, transition: "all .22s", transform: hov ? "translateX(4px)" : "none", flexShrink: 0 }}>→</div>
      </a>
    </FadeIn>
  );
}

function FaqItem({ item, open, onToggle, delay }: { item: { q: string; a: string }; open: boolean; onToggle: () => void; delay: number }) {
  return (
    <FadeIn delay={delay}>
      <div style={{ background: open ? "rgba(34,197,94,0.05)" : "rgba(255,255,255,0.02)", border: `1px solid ${open ? GREEN + "40" : "rgba(255,255,255,0.07)"}`, borderRadius: 14, overflow: "hidden", transition: "all .25s", backdropFilter: "blur(8px)" }}>
        <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "18px 20px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: open ? "#fff" : "rgba(255,255,255,0.8)", lineHeight: 1.45, transition: "color .2s" }}>{item.q}</span>
          <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, background: open ? `${GREEN}20` : "rgba(255,255,255,0.05)", border: `1px solid ${open ? GREEN + "50" : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", color: open ? GREEN : "rgba(255,255,255,0.3)", fontSize: 18, transition: "all .22s" }}>{open ? "−" : "+"}</div>
        </button>
        <div style={{ maxHeight: open ? 220 : 0, overflow: "hidden", transition: "max-height .38s cubic-bezier(.16,1,.3,1)" }}>
          <p style={{ margin: 0, padding: "0 20px 20px", fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.8 }}>{item.a}</p>
        </div>
      </div>
    </FadeIn>
  );
}

export function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { lang: siteLang } = useLang();
  const t = PAGE_UI[(siteLang as PageLang) in PAGE_UI ? (siteLang as PageLang) : "en"];

  return (
    <div style={{ minHeight: "100vh", background: DARK, fontFamily: "'Inter','Helvetica Neue',sans-serif", color: "#fff", position: "relative", overflowX: "hidden" }}>
      <ForestCanvas />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 80% 60% at 15% 20%, rgba(34,197,94,0.13) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 85% 80%, rgba(16,185,129,0.09) 0%, transparent 55%)" }} />

      <main className="yq-contact-main" style={{ position: "relative", zIndex: 1, paddingTop: "clamp(88px,12vw,110px)", paddingBottom: 100, paddingLeft: "clamp(16px,5vw,88px)", paddingRight: "clamp(16px,5vw,88px)", maxWidth: 980, margin: "0 auto" }}>

        {/* HEADER */}
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: "clamp(48px,8vw,72px)" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{ display: "inline-block", width: 36, height: 1.5, background: GREEN, borderRadius: 2 }} />
              <span style={{ color: GREEN, fontSize: 10, fontWeight: 800, letterSpacing: ".32em", textTransform: "uppercase" }}>{t.eyebrow}</span>
              <span style={{ display: "inline-block", width: 36, height: 1.5, background: GREEN, borderRadius: 2 }} />
            </div>
            <h1 style={{ margin: "0 0 18px", fontWeight: 900, fontSize: "clamp(34px,7vw,64px)", color: "#fff", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
              {t.title1} <br />
              <span style={{ color: GREEN, textShadow: "0 0 80px rgba(34,197,94,0.45)" }}>{t.titleGreen}</span>
            </h1>
            <p style={{ margin: "0 auto", fontSize: 16, color: "rgba(255,255,255,0.4)", maxWidth: 480, lineHeight: 1.75 }}>
              {t.subtitle}
            </p>
          </div>
        </FadeIn>

        {/* КОНТАКТЫ — сетка карточек */}
        <div className="yq-contact-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 20 }}>
          {contacts.map((c, i) => <ContactCard key={i} c={c} desc={t.contactDesc[i]} delay={i * 60} />)}
        </div>

        {/* ЛОКАЦИЯ + БЕЙДЖ ОТВЕТА */}
        <div className="yq-contact-grid" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 14, marginBottom: "clamp(56px,9vw,80px)" }}>
          <FadeIn delay={260}>
            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "22px 22px", backdropFilter: "blur(8px)", height: "100%", boxSizing: "border-box" }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📍</div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.28)", letterSpacing: ".2em", textTransform: "uppercase", marginBottom: 6 }}>{t.locationLabel}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 6 }}>Tashkent, Uzbekistan</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.7 }}>Islom Karimov street 49</div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={320}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "22px", background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.18)", borderRadius: 18, height: "100%", boxSizing: "border-box" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: GREEN, boxShadow: `0 0 10px ${GREEN}`, flexShrink: 0, animation: "blink 2s infinite" }} />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{t.responseText} <strong style={{ color: GREEN }}>{t.responseHours}</strong></span>
            </div>
          </FadeIn>
        </div>

        {/* FAQ */}
        <div>
          <FadeIn>
            <p style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.2)", letterSpacing: ".22em", textTransform: "uppercase", margin: "0 0 20px", textAlign: "center" }}>{t.faqLabel}</p>
          </FadeIn>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {t.faq.map((item, i) => (
              <FaqItem key={i} item={item} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} delay={i * 55} />
            ))}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes blink { 0%,100% { opacity:.5; transform:scale(1); } 50% { opacity:1; transform:scale(1.3); } }
        @keyframes yq-icon-glow { 0%,100% { filter: drop-shadow(0 0 0px currentColor); transform: scale(1); } 50% { filter: drop-shadow(0 0 8px currentColor); transform: scale(1.12); } }
        .yq-contact-card:hover .yq-icon-pulse { animation: yq-icon-glow 1.1s ease-in-out infinite; }

        /* ── Мобильный дизайн ── */
        @media (max-width: 640px) {
          .yq-contact-grid { grid-template-columns: 1fr !important; }
          .yq-contact-card { padding: 18px !important; gap: 14px !important; }
        }
      `}</style>
    </div>
  );
}