import { useState, useEffect, useRef } from "react";
import { useLang } from "../contexts/LanguageContext";
import { ENDPOINTS, baseHeaders, fixMediaUrl } from "../config/api";

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
    title: "Our", titleGreen: "Team",
    loading: "Loading team…", error: "Couldn't load the team. Please try again.", retry: "Retry",
    empty: "No team members in this group yet.",
  },
  uz: {
    title: "Bizning", titleGreen: "Jamoamiz",
    loading: "Jamoa yuklanmoqda…", error: "Jamoani yuklab bo'lmadi. Qayta urinib ko'ring.", retry: "Qayta urinish",
    empty: "Bu guruhda hozircha azolar yo'q.",
  },
  ru: {
    title: "Наша", titleGreen: "Команда",
    loading: "Загружаем команду…", error: "Не удалось загрузить команду. Попробуйте ещё раз.", retry: "Повторить",
    empty: "В этой группе пока нет участников.",
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

/** Кастомный порядок карточек на странице команды (не по id из API).
 * Ищем по подстроке в fullname (без учёта регистра). Кого нет в списке —
 * уходят в конец, сохраняя свой относительный порядок. */
const CUSTOM_ORDER = ["durdona", "abdulboriy", "komronbek", "salokhiddin", "muhammad rizo", "anvarjon"];

function sortByCustomOrder(members: TeamMember[]): TeamMember[] {
  return [...members].sort((a, b) => {
    const ia = CUSTOM_ORDER.findIndex(key => a.fullname.toLowerCase().includes(key));
    const ib = CUSTOM_ORDER.findIndex(key => b.fullname.toLowerCase().includes(key));
    const posA = ia === -1 ? CUSTOM_ORDER.length : ia;
    const posB = ib === -1 ? CUSTOM_ORDER.length : ib;
    return posA - posB;
  });
}

const absUrl = fixMediaUrl;

/* Настоящие логотипы вместо эмодзи, с пульсирующим свечением при ховере на карточку */
function TelegramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="yq-team-icon" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="yq-team-icon" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" strokeWidth="2.5" />
    </svg>
  );
}

/** Поле skills теперь пишется так:
 *   •  Co-Founder and CTO
 *   • Victory loves preparation
 * Первый пункт — конкретная должность (роль), второй — цитата.
 * Если пунктов меньше двух, недостающее просто не показываем. */
function parseSkills(text: string | null): { title: string | null; quote: string | null } {
  if (!text) return { title: null, quote: null };
  const parts = text.split("•").map(s => s.trim()).filter(Boolean);
  return { title: parts[0] || null, quote: parts[1] || null };
}

function MemberCard({ member, delay }: { member: TeamMember; delay: number }) {
  const [hov, setHov] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const initials = member.fullname.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const photoUrl = absUrl(member.photo);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    if (cardRef.current) cardRef.current.style.transform = `perspective(900px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateY(-6px)`;
  };
  const reset = () => { setHov(false); if (cardRef.current) cardRef.current.style.transform = "perspective(900px) rotateY(0) rotateX(0) translateY(0)"; };
  const { title, quote } = parseSkills(member.skills);

  return (
    <FadeIn delay={delay}>
      <div
        ref={cardRef}
        className="yq-team-card"
        onMouseEnter={() => setHov(true)}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{
          background: "rgba(255,255,255,0.025)",
          border: `1px solid ${hov ? GREEN + "50" : "rgba(255,255,255,0.08)"}`,
          borderRadius: 20, overflow: "hidden",
          transition: "transform .18s ease-out, border-color .28s, box-shadow .28s",
          transformStyle: "preserve-3d",
          boxShadow: hov ? "0 24px 60px rgba(34,197,94,0.15)" : "none",
          backdropFilter: "blur(10px)", position: "relative", height: "100%",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: hov ? `linear-gradient(90deg,transparent,${GREEN}70,transparent)` : "transparent", transition: "background .3s" }} />

        <div style={{ position: "relative", width: "100%", aspectRatio: "3/4", overflow: "hidden" }}>
          {photoUrl ? (
            <img src={photoUrl} alt={member.fullname} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block", transition: "transform .4s ease", transform: hov ? "scale(1.06)" : "scale(1)" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: `linear-gradient(160deg,${GREEN}20 0%,rgba(34,197,94,0.04) 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <div style={{ width: 88, height: 88, borderRadius: "50%", background: `${GREEN}20`, border: `2px solid ${GREEN}45`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800, color: GREEN }}>{initials}</div>
              <span style={{ fontSize: 28, opacity: .25 }}>🌿</span>
            </div>
          )}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55%", background: "linear-gradient(to top,rgba(8,8,8,0.97) 0%,transparent 100%)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 16px" }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", lineHeight: 1.2, marginBottom: 6 }}>{member.fullname}</div>
            {/* Роль — переливающийся градиентный текст вместо статичного бейджа */}
            {title && (
              <span
                className="yq-role-shimmer"
                style={{
                  display: "inline-block", fontSize: 11.5, fontWeight: 800, letterSpacing: ".02em",
                  backgroundImage: `linear-gradient(90deg, ${GREEN} 0%, #86efac 25%, ${GREEN} 50%, #4ade80 75%, ${GREEN} 100%)`,
                  backgroundSize: "200% auto", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
                  animation: "yq-role-shimmer 2.6s linear infinite",
                }}
              >
                {title}
              </span>
            )}
          </div>

          {/* Гигантская пульсирующая кавычка-декор */}
          {quote && (
            <span
              aria-hidden="true"
              style={{
                position: "absolute", top: 8, right: 12, fontFamily: "Georgia, serif", fontSize: 64, lineHeight: 1,
                color: "rgba(34,197,94,0.18)", pointerEvents: "none",
                animation: "yq-quote-float 4s ease-in-out infinite",
              }}
            >
              "
            </span>
          )}
        </div>

        {/* Цитата — эластично "выпрыгивает" при наведении */}
        {quote && (
          <div style={{
            padding: "16px 18px 20px",
            maxHeight: hov ? 200 : 0, opacity: hov ? 1 : 0,
            transform: hov ? "translateY(0) scale(1)" : "translateY(10px) scale(.94)",
            overflow: "hidden",
            transition: "max-height .4s cubic-bezier(.34,1.56,.64,1), opacity .3s ease, transform .4s cubic-bezier(.34,1.56,.64,1)",
          }}>
            <p style={{ margin: 0, fontSize: 13, fontStyle: "italic", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
              "{quote}"
            </p>
          </div>
        )}

        <div style={{ padding: member.skills ? "0 16px 18px" : "14px 16px 18px", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {member.telegram_username && (
            <a href={`https://t.me/${member.telegram_username.replace("@", "")}`} target="_blank" rel="noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.18)", borderRadius: 8, textDecoration: "none", color: GREEN, fontSize: 11.5, fontWeight: 600 }}>
              <TelegramIcon /> Telegram
            </a>
          )}
          {member.instagram && (
            <a href={`https://instagram.com/${member.instagram.replace("@", "")}`} target="_blank" rel="noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "rgba(244,114,182,0.08)", border: "1px solid rgba(244,114,182,0.2)", borderRadius: 8, textDecoration: "none", color: "#F472B6", fontSize: 11.5, fontWeight: 600 }}>
              <InstagramIcon /> Instagram
            </a>
          )}
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

  return (
    <div style={{ minHeight: "100vh", background: "#060606", color: "#fff", fontFamily: "'Inter','Helvetica Neue',sans-serif", position: "relative", overflowX: "hidden" }}>
      <ForestCanvas />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 80% 60% at 10% 20%, rgba(34,197,94,0.1) 0%, transparent 60%), radial-gradient(ellipse 55% 50% at 90% 80%, rgba(34,197,94,0.06) 0%, transparent 55%)" }} />

      <main style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "clamp(100px,12vw,140px) clamp(16px,5vw,60px) 100px" }}>
        <FadeIn>
          <h1 style={{ margin: "0 0 56px", fontSize: "clamp(40px,7vw,72px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1 }}>
            <span style={{ color: "#fff" }}>{t.title} </span>
            <span style={{ color: GREEN, textShadow: "0 0 60px rgba(34,197,94,0.4)" }}>{t.titleGreen}</span>
          </h1>
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

        {/* ВСЯ КОМАНДА В ОДНУ СЕКЦИЮ, СЕТКА 4 В РЯД, АДАПТИВНО */}
        {!loading && !error && members && members.length > 0 && (
          <div style={{ marginBottom: 72 }}>
            <div
              className="yq-team-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 20,
              }}
            >
              {sortByCustomOrder(members).map((m, i) => (
                <MemberCard key={m.id} member={m} delay={i * 60} />
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
        @keyframes yq-team-icon-glow { 0%,100% { filter: drop-shadow(0 0 0px currentColor); transform: scale(1); } 50% { filter: drop-shadow(0 0 6px currentColor); transform: scale(1.15); } }
        .yq-team-card:hover .yq-team-icon { animation: yq-team-icon-glow 1s ease-in-out infinite; }
        @keyframes yq-role-shimmer { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
        @keyframes yq-quote-float { 0%,100% { transform: translateY(0) rotate(-4deg); opacity: .18; } 50% { transform: translateY(-6px) rotate(4deg); opacity: .3; } }

        /* ── Адаптивная сетка команды ── */
        @media (max-width: 980px) {
          .yq-team-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 720px) {
          .yq-team-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 460px) {
          .yq-team-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}