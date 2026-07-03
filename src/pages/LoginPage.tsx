import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, User } from "../contexts/AuthContext";
import { ENDPOINTS, baseHeaders } from "../config/api";

const GREEN = "#22C55E";
const POLL_INTERVAL_MS = 2000;
const TIMEOUT_MS = 5 * 60 * 1000; // 5 минут на подтверждение

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

type Stage = "idle" | "waiting" | "error";

export function LoginPage() {
  const { loginWithTokens, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState("");
  const pollRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => { if (isLoggedIn) navigate("/"); }, [isLoggedIn]);

  useEffect(() => {
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const stopPolling = () => {
    if (pollRef.current) { window.clearInterval(pollRef.current); pollRef.current = null; }
    if (timeoutRef.current) { window.clearTimeout(timeoutRef.current); timeoutRef.current = null; }
  };

  const pollStatus = useCallback((token: string) => {
    pollRef.current = window.setInterval(async () => {
      try {
        const res = await fetch(ENDPOINTS.loginTokenStatus(token), { headers: baseHeaders("en") });
        if (res.status === 404) {
          stopPolling();
          setStage("error");
          setError("Ссылка устарела. Попробуй ещё раз.");
          return;
        }
        const data = await res.json();
        if (data.status === "confirmed") {
          stopPolling();
          loginWithTokens(data.access, data.refresh, data.user as User);
          navigate("/");
        }
      } catch {
        // временный сбой сети — пробуем на следующем тике, не обрываем сразу
      }
    }, POLL_INTERVAL_MS);

    timeoutRef.current = window.setTimeout(() => {
      stopPolling();
      setStage("error");
      setError("Время ожидания истекло. Попробуй войти ещё раз.");
    }, TIMEOUT_MS);
  }, [loginWithTokens, navigate]);

  const handleStart = async () => {
    setError(""); setStage("waiting");
    try {
      const res = await fetch(ENDPOINTS.loginToken, { method: "POST", headers: baseHeaders("en") });
      if (!res.ok) throw new Error();
      const data = await res.json();
      window.open(data.deep_link, "_blank");
      pollStatus(data.token);
    } catch {
      setStage("error");
      setError("Не удалось начать вход. Проверь соединение и попробуй снова.");
    }
  };

  const handleRetry = () => { stopPolling(); setStage("idle"); setError(""); };

  return (
    <div style={{ minHeight: "100vh", background: "#060606", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif", position: "relative", padding: "20px" }}>
      <ForestCanvas />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 80% 60% at 15% 20%, rgba(34,197,94,0.1) 0%, transparent 60%)" }} />

      <div style={{ position: "relative", zIndex: 5, width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(34,197,94,0.12)", border: "1.5px solid rgba(34,197,94,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🌱</div>
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: ".1em", color: "#fff" }}>YASHIL QO'LLAR</span>
            </div>
          </Link>
          <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Присоединяйся</h1>
          <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.38)" }}>Вход прямо через приложение Telegram</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(34,197,94,0.18)", borderRadius: 20, padding: "32px 28px", backdropFilter: "blur(16px)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${GREEN}60,transparent)` }} />

          {stage === "idle" && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {[
                  { n: "1", t: "Жми кнопку — откроется Telegram" },
                  { n: "2", t: "Бот пришлёт: «Вход подтверждён»" },
                  { n: "3", t: "Вернись на эту вкладку — готово" },
                ].map(s => (
                  <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${GREEN}18`, border: `1px solid ${GREEN}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: GREEN, flexShrink: 0 }}>{s.n}</div>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{s.t}</span>
                  </div>
                ))}
              </div>

              <button onClick={handleStart} style={{
                width: "100%", padding: "15px", background: GREEN, border: "none", color: "#000",
                borderRadius: 12, fontSize: 13, fontWeight: 800, letterSpacing: ".08em",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                cursor: "pointer", fontFamily: "'Montserrat',sans-serif",
                boxShadow: "0 0 26px rgba(34,197,94,0.28)",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                Продолжить в Telegram
              </button>

              <p style={{ margin: "16px 0 0", fontSize: 11.5, color: "rgba(255,255,255,0.3)", lineHeight: 1.6, textAlign: "center" }}>
                Ты остаёшься внутри Telegram — номер телефона нигде вводить не нужно.
              </p>
            </>
          )}

          {stage === "waiting" && (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <div style={{ width: 40, height: 40, margin: "0 auto 18px", borderRadius: "50%", border: "3px solid rgba(34,197,94,0.15)", borderTopColor: GREEN, animation: "yq-spin .8s linear infinite" }} />
              <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 600, color: "#fff" }}>Ждём подтверждения…</p>
              <p style={{ margin: 0, fontSize: 12.5, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                Открылся Telegram — найди сообщение от бота и дождись "✅ Вход подтверждён". Эта страница обновится сама.
              </p>
              <button onClick={handleRetry} style={{
                marginTop: 18, background: "transparent", border: "none",
                color: "rgba(255,255,255,0.35)", fontSize: 12, textDecoration: "underline", cursor: "pointer",
              }}>
                Отменить
              </button>
            </div>
          )}

          {stage === "error" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#f87171", marginBottom: 16 }}>
                {error}
              </div>
              <button onClick={handleRetry} style={{
                width: "100%", padding: "13px", background: GREEN, border: "none", color: "#000",
                borderRadius: 11, fontSize: 12, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase",
                cursor: "pointer", fontFamily: "'Montserrat',sans-serif",
              }}>
                Попробовать снова
              </button>
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.25)", lineHeight: 1.6 }}>
          Отдельной формы регистрации нет — первое подтверждение в боте само создаёт аккаунт.
        </p>
      </div>

      <style>{`@keyframes yq-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}