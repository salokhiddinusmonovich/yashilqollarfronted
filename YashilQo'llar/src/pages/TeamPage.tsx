import { useState, useEffect, useRef } from "react";
import { useLang } from "../contexts/LanguageContext";
import { ENDPOINTS, baseHeaders, absMediaUrl } from "../config/api";

const GREEN = "#22C55E";

/* ─────────────────────────────────────────
   ТИПЫ — соответствуют TeamMemberSerializer
───────────────────────────────────────── */
type Focus = "founder" | "digital" | "media" | "organization";

interface TeamMember {
  id: number;
  fullname: string;
  photo: string | null;
  telegram_username: string | null;
  instagram: string | null;
  skills: string | null;
  focus: Focus;
}

const UI: Record<string, Record<string, string>> = {
  en: {
    eyebrow: "The People Behind the Mission", title: "Our", titleGreen: "Team",
    subtitle: "Dedicated volunteers making Yashil Qollar happen.",
    founder: "Founders", digital: "Digital", media: "Media", organization: "Organization",
    loading: "Loading team…", error: "Couldn't load the team. Please try again.", retry: "Retry",
    empty: "No team members in this group yet.",
    skills: "Skills",
  },
  uz: {
    eyebrow: "Missiya ortidagi odamlar", title: "Bizning", titleGreen: "Jamoamiz",
    subtitle: "Yashil Qollarni amalga oshirayotgan fidoyi kongillilar.",
    founder: "Asoschilar", digital: "Raqamli yo'nalish", media: "Media", organization: "Tashkiliy",
    loading: "Jamoa yuklanmoqda…", error: "Jamoani yuklab bo'lmadi. Qayta urinib ko'ring.", retry: "Qayta urinish",
    empty: "Bu guruhda hozircha azolar yo'q.",
    skills: "Ko'nikmalar",
  },
  ru: {
    eyebrow: "Люди за миссией", title: "Наша", titleGreen: "Команда",
    subtitle: "Преданные волонтёры, воплощающие Yashil Qollar в жизнь.",
    founder: "Основатели", digital: "Digital", media: "Медиа", organization: "Организация",
    loading: "Загружаем команду…", error: "Не удалось загрузить команду. Попробуйте ещё раз.", retry: "Повторить",
    empty: "В этой группе пока нет участников.",
    skills: "Навыки",
  },
};

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
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.07 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, []);
  return <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(26px)", transition: `opacity .8s cubic-bezier(.16,1,.3,1) ${delay}ms,transform .8s cubic-bezier(.16,1,.3,1) ${delay}ms` }}>{children}</div>;
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
      <span style={{ width: 28, height: 1.5, background: GREEN, borderRadius: 2, display: "inline-block", flexShrink: 0 }} />
      <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".28em", textTransform: "uppercase", color: GREEN, whiteSpace: "nowrap" }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${GREEN}40,transparent)` }} />
    </div>
  );
}

function absUrl(path: string | null) {
  return absMediaUrl(path);
}

function MemberCard({ member, delay, t }: { member: TeamMember; delay: number; t: Record<string, string> }) {
  const [hov, setHov] = useState(false);
  const initials = member.fullname.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const photoUrl = absUrl(member.photo);

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
          boxShadow: hov ? "0 20px 50px rgba(34,197,94,0.1)" : "none",
          backdropFilter: "blur(10px)", position: "relative", height: "100%",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: hov ? `linear-gradient(90deg,transparent,${GREEN}70,transparent)` : "transparent", transition: "background .3s" }} />

        <div style={{ position: "relative", width: "100%", aspectRatio: "3/4", overflow: "hidden" }}>
          {photoUrl ? (
            <img src={photoUrl} alt={member.fullname} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block", transition: "transform .4s ease", transform: hov ? "scale(1.04)" : "scale(1)" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: `linear-gradient(160deg,${GREEN}20 0%,rgba(34,197,94,0.04) 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <div style={{ width: 88, height: 88, borderRadius: "50%", background: `${GREEN}20`, border: `2px solid ${GREEN}45`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800, color: GREEN }}>{initials}</div>
              <span style={{ fontSize: 28, opacity: .25 }}>🌿</span>
            </div>
          )}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(to top,rgba(8,8,8,0.95) 0%,transparent 100%)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 16px" }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", lineHeight: 1.2 }}>{member.fullname}</div>
          </div>
        </div>

        <div style={{ padding: "14px 16px 18px" }}>
          {member.skills && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: 5 }}>{t.skills}</div>
              <p style={{ margin: 0, fontSize: 12.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{member.skills}</p>
            </div>
          )}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {member.telegram_username && (
              <a href={`https://t.me/${member.telegram_username.replace("@", "")}`} target="_blank" rel="noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.18)", borderRadius: 8, textDecoration: "none", color: GREEN, fontSize: 11.5, fontWeight: 600 }}>
                ✈️ Telegram
              </a>
            )}
            {member.instagram && (
              <a href={`https://instagram.com/${member.instagram.replace("@", "")}`} target="_blank" rel="noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "rgba(244,114,182,0.08)", border: "1px solid rgba(244,114,182,0.2)", borderRadius: 8, textDecoration: "none", color: "#F472B6", fontSize: 11.5, fontWeight: 600 }}>
                📸 Instagram
              </a>
            )}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

export function TeamPage() {
  const { lang } = useLang();
  const t = UI[lang] || UI.en;

  const [members, setMembers] = useState<TeamMember[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);

    fetch(ENDPOINTS.team, {
      headers: baseHeaders(lang),
      signal: controller.signal,
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: TeamMember[]) => setMembers(data))
      .catch(err => {
        if (err.name !== "AbortError") setError(true);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [lang, reloadKey]);

  // Все участники в одну секцию, без группировки по focus

  return (
    <div style={{ minHeight: "100vh", background: "#060606", color: "#fff", fontFamily: "'Inter','Helvetica Neue',sans-serif", position: "relative", overflowX: "hidden" }}>
      <ForestCanvas />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 80% 60% at 10% 20%, rgba(34,197,94,0.1) 0%, transparent 60%), radial-gradient(ellipse 55% 50% at 90% 80%, rgba(34,197,94,0.06) 0%, transparent 55%)" }} />

      <main style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "clamp(100px,12vw,140px) clamp(16px,5vw,60px) 100px" }}>
        <FadeIn>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ width: 32, height: 1.5, background: GREEN, borderRadius: 2, display: "inline-block" }} />
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".28em", textTransform: "uppercase", color: GREEN }}>{t.eyebrow}</span>
          </div>
          <h1 style={{ margin: "0 0 14px", fontSize: "clamp(40px,7vw,72px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1 }}>
            <span style={{ color: "#fff" }}>{t.title} </span>
            <span style={{ color: GREEN, textShadow: "0 0 60px rgba(34,197,94,0.4)" }}>{t.titleGreen}</span>
          </h1>
          <p style={{ margin: "0 0 56px", fontSize: 16, color: "rgba(255,255,255,0.42)", maxWidth: 520, lineHeight: 1.75 }}>{t.subtitle}</p>
        </FadeIn>

        {/* ЗАГРУЗКА */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "80px 0", color: "rgba(255,255,255,0.4)" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", border: `3px solid rgba(34,197,94,0.15)`, borderTopColor: GREEN, animation: "yq-spin .8s linear infinite" }} />
            <span style={{ fontSize: 13 }}>{t.loading}</span>
          </div>
        )}

        {/* ОШИБКА */}
        {!loading && error && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "80px 0", textAlign: "center" }}>
            <span style={{ fontSize: 32 }}>⚠️</span>
            <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>{t.error}</p>
            <button
              onClick={() => setReloadKey(k => k + 1)}
              style={{ background: GREEN, border: "none", color: "#000", padding: "10px 22px", borderRadius: 10, fontSize: 12, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", cursor: "pointer" }}
            >
              {t.retry}
            </button>
          </div>
        )}

        {/* ВСЯ КОМАНДА В ОДНУ СЕКЦИЮ, ГОРИЗОНТАЛЬНЫЙ СКРОЛЛ */}
        {!loading && !error && members && members.length > 0 && (
          <div style={{ marginBottom: 72 }}>
            <FadeIn><SectionLabel label={t.founder} /></FadeIn>
            <div
              className="yq-team-row"
              style={{
                display: "flex",
                gap: 20,
                overflowX: "auto",
                paddingBottom: 12,
                scrollSnapType: "x proximity",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {members.map((m, i) => (
                <div key={m.id} style={{ flex: "0 0 220px", scrollSnapAlign: "start" }}>
                  <MemberCard member={m} delay={i * 60} t={t} />
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && (members || []).length === 0 && (
          <div style={{ padding: "48px 32px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, textAlign: "center", backdropFilter: "blur(8px)" }}>
            <div style={{ fontSize: 32, marginBottom: 14 }}>🌿</div>
            <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.3)", lineHeight: 1.7 }}>{t.empty}</p>
          </div>
        )}
      </main>

      <style>{`
        @keyframes yq-spin { to { transform: rotate(360deg); } }
        .yq-team-row::-webkit-scrollbar { height: 6px; }
        .yq-team-row::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); border-radius: 10px; }
        .yq-team-row::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.35); border-radius: 10px; }
        .yq-team-row::-webkit-scrollbar-thumb:hover { background: rgba(34,197,94,0.55); }
      `}</style>
    </div>
  );
}
