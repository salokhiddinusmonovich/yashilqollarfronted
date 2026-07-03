import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, TelegramWidgetData } from "../contexts/AuthContext";

const GREEN = "#22C55E";

/* ─────────────────────────────────────────
   ⚠️ ЗАМЕНИ на реальный username своего бота
   (без @, то что стоит после t.me/)
   И не забудь: в BotFather → /setdomain → указать
   тот домен, с которого реально открывается сайт
   (например yashilqollarfronted.vercel.app).
   Telegram Login Widget НЕ работает на localhost.
───────────────────────────────────────── */
const BOT_USERNAME = "yashilqollarbot";

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramWidgetData) => void;
  }
}

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
    };
    const drawLeaf = (x: number, y: number, size: number, rot: number, alpha: number, hue: number) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha;
      ctx.beginPath(); ctx.moveTo(0, -size); ctx.bezierCurveTo(size * .7, -size * .6, size * .7, size * .5, 0, size * .35); ctx.bezierCurveTo(-size * .7, size * .5, -size * .7, -size * .6, 0, -size);
      const g = ctx.createLinearGradient(0, -size, 0, size * .35); g.addColorStop(0, `hsl(${142 + hue},78%,52%)`); g.addColorStop(1, `hsl(${155 + hue},70%,37%)`);
      ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.moveTo(0, -size * .85); ctx.quadraticCurveTo(size * .08, 0, 0, size * .3); ctx.strokeStyle = "rgba(255,255,255,0.22)"; ctx.lineWidth = .85; ctx.stroke();
      ctx.restore(); ctx.globalAlpha = 1;
    };
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) { const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, d = Math.sqrt(dx * dx + dy * dy); if (d < 150) { ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.strokeStyle = `rgba(34,197,94,${.17 * (1 - d / 150)})`; ctx.lineWidth = .7; ctx.stroke(); } }
      for (const n of nodes) { n.pulse += n.ps; n.x += n.vx; n.y += n.vy; if (n.x < 0) n.x = w; if (n.x > w) n.x = 0; if (n.y < 0) n.y = h; if (n.y > h) n.y = 0; const pa = n.a * (.65 + .35 * Math.sin(n.pulse)); const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5); grd.addColorStop(0, `rgba(34,197,94,${pa * .55})`); grd.addColorStop(1, "transparent"); ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill(); ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(34,197,94,${pa})`; ctx.fill(); }
      for (const l of leaves) { l.wobble += l.ws; l.x += l.vx + Math.sin(l.wobble) * .5; l.y += l.vy; l.rot += l.vrot; if (l.y < -30) { l.y = h + 30; l.x = Math.random() * w; } drawLeaf(l.x, l.y, l.size, l.rot, l.a, l.hue); }
      id = requestAnimationFrame(tick);
    };
    init(); tick(); window.addEventListener("resize", init);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", init); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

function TelegramLoginWidget({ onAuth, onError }: { onAuth: (data: TelegramWidgetData) => void; onError: (msg: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (BOT_USERNAME === "YOUR_BOT_USERNAME") {
      onError("Bot username is not configured yet.");
      return;
    }

    window.onTelegramAuth = (user: TelegramWidgetData) => onAuth(user);

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", BOT_USERNAME);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "12");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");

    containerRef.current?.appendChild(script);

    return () => {
      delete window.onTelegramAuth;
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [onAuth, onError]);

  return (
    <div style={{ display: "flex", justifyContent: "center", minHeight: 50 }}>
      <div ref={containerRef} />
    </div>
  );
}

export function LoginPage() {
  const { loginWithTelegram, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (isLoggedIn) navigate("/"); }, [isLoggedIn]);

  const handleTelegramAuth = async (data: TelegramWidgetData) => {
    setError(""); setLoading(true);
    const res = await loginWithTelegram(data);
    setLoading(false);
    if (res.ok) navigate("/");
    else setError(res.error || "Telegram login failed.");
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
          <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Присоединяйся</h1>
          <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.38)" }}>Один клик через Telegram — без пароля</p>
        </div>

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(34,197,94,0.18)", borderRadius: 20, padding: "32px 28px", backdropFilter: "blur(16px)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${GREEN}60,transparent)` }} />

          {/* Пошаговая инструкция — снимает путаницу "что вообще происходит" */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
            {[
              { n: "1", t: "Жми кнопку ниже" },
              { n: "2", t: "Подтверди вход в Telegram" },
              { n: "3", t: "Готово — ты в аккаунте" },
            ].map(s => (
              <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${GREEN}18`, border: `1px solid ${GREEN}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: GREEN, flexShrink: 0 }}>{s.n}</div>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{s.t}</span>
              </div>
            ))}
          </div>

          <p style={{ margin: "0 0 20px", fontSize: 12.5, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, textAlign: "center" }}>
            Никакого пароля и отдельной регистрации — Telegram сам подтверждает, что это ты.
          </p>
          <TelegramLoginWidget onAuth={handleTelegramAuth} onError={setError} />

          {/* Fallback для тех, у кого виджет не открылся (частая проблема на мобиле) */}
          <a
            href={`https://t.me/${BOT_USERNAME}`}
            target="_blank" rel="noreferrer"
            style={{
              display: "block", textAlign: "center", marginTop: 14,
              fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "underline",
            }}
          >
            Кнопка не открывается? Открыть бота напрямую →
          </a>

          {error && (
            <div style={{ marginTop: 16, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 9, padding: "10px 14px", fontSize: 13, color: "#f87171" }}>
              {error}
            </div>
          )}

          {loading && (
            <div style={{ marginTop: 16, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
              Signing in…
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.25)", lineHeight: 1.6 }}>
          Отдельной формы регистрации нет — первый вход через Telegram сам создаёт аккаунт.
        </p>
      </div>

      <style>{`input::placeholder{color:rgba(255,255,255,0.18)}`}</style>
    </div>
  );
}