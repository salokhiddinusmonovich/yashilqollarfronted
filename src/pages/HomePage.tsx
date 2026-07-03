import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logoImg from "./photo_2025-10-08_22-18-51.jpg";

/* ─────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap');

:root {
  --green: #22C55E;
  --green-dim: rgba(34,197,94,0.12);
  --green-glow: rgba(34,197,94,0.35);
  --dark: #060606;
  --card: rgba(255,255,255,0.025);
  --muted: rgba(255,255,255,0.38);
  --font-display: 'Anton', sans-serif;
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'Montserrat', sans-serif;
  --mx: 50%;
  --my: 50%;
}

* { -webkit-tap-highlight-color: transparent; }

@keyframes yq-fadeUp    { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
@keyframes yq-fadeIn    { from { opacity:0; } to { opacity:1; } }
@keyframes yq-float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
@keyframes yq-glow      { 0%,100%{filter:drop-shadow(0 0 18px rgba(34,197,94,.45))} 50%{filter:drop-shadow(0 0 40px rgba(34,197,94,.8))} }
@keyframes yq-spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes yq-spin-rev  { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
@keyframes yq-ringPulse { 0%,100%{opacity:.08;transform:scale(1)} 50%{opacity:.22;transform:scale(1.04)} }
@keyframes yq-ticker    { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
@keyframes yq-gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
@keyframes yq-blink     { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.35)} }
@keyframes yq-scanline  { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
@keyframes yq-scrollDot { 0%,100%{transform:translateY(0);opacity:.9} 50%{transform:translateY(14px);opacity:.3} }
@keyframes yq-letterUp  { from{opacity:0;transform:translateY(.7em) rotate(4deg)} to{opacity:1;transform:translateY(0) rotate(0)} }

/* ── Typography ── */
.hw {
  display: block;
  font-family: var(--font-display);
  line-height: 0.92;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  color: #fff;
  font-size: clamp(2.8rem, 6.5vw, 6rem);
}
.hw-em {
  background: linear-gradient(135deg, #22c55e, #34d399, #6ee7b7, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 300% 300%;
  animation: yq-gradShift 4s ease infinite;
}
.hw-letter { display: inline-block; will-change: transform, opacity; }
.hw-em-reveal {
  display: inline-block;
  clip-path: inset(0 100% 0 0);
  animation: yq-clipReveal 1.1s cubic-bezier(.16,1,.3,1) .55s forwards;
}
@keyframes yq-clipReveal { to { clip-path: inset(0 0 0 0); } }

.yq-eyebrow { animation: yq-fadeUp .7s ease 0s both; }
.yq-sub { animation: yq-fadeUp .8s ease .55s both; }
.yq-btns { animation: yq-fadeUp .8s ease .68s both; }

/* ── Buttons ── */
.yq-btn-primary {
  background: linear-gradient(135deg,#22c55e,#16a34a);
  color: #fff; border: none;
  font-family: var(--font-mono); font-size: 11px; font-weight: 800;
  letter-spacing: 1.5px; text-transform: uppercase;
  padding: 16px 34px; border-radius: 12px;
  display: inline-flex; align-items: center; gap: 10px;
  text-decoration: none; cursor: pointer;
  transition: box-shadow .3s cubic-bezier(.16,1,.3,1), filter .3s;
  box-shadow: 0 4px 24px rgba(34,197,94,0.22);
  position: relative;
}
.yq-btn-primary:hover { box-shadow: 0 14px 40px rgba(34,197,94,.45); filter:brightness(1.08); }

.yq-btn-ghost {
  background: rgba(255,255,255,0.025);
  color: rgba(255,255,255,.8);
  border: 1px solid rgba(255,255,255,.1);
  font-family: var(--font-mono); font-size: 11px; font-weight: 700;
  letter-spacing: 1.5px; text-transform: uppercase;
  padding: 16px 34px; border-radius: 12px;
  display: inline-flex; align-items: center; gap: 10px;
  text-decoration: none; cursor: pointer;
  transition: border-color .3s, color .3s, background .3s;
  backdrop-filter: blur(12px);
}
.yq-btn-ghost:hover { border-color:rgba(34,197,94,.5); color:#fff; background:rgba(34,197,94,.06); }

/* ── Hero layout ── */
.yq-hero-container {
  position: relative; overflow: hidden;
  background: var(--dark);
  padding-top: clamp(5rem,11vw,9rem);
  padding-bottom: 5rem;
  min-height: 100vh;
  display: flex; align-items: center;
}
.yq-hero-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  width: 100%; max-width: 1300px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem,5vw,5rem);
  gap: 4rem;
  position: relative; z-index: 5;
}

/* ── Planet rings ── */
.yq-ring-container { position:relative; display:flex; align-items:center; justify-content:center; width:100%; height:100%; min-height:400px; }
.yq-logo-anim { z-index:2; position:relative; width:100%; max-width:360px; height:auto; border-radius:50%; animation: yq-fadeIn 1.2s ease .2s both, yq-float 6s ease-in-out infinite, yq-glow 4s ease-in-out infinite; }
.yq-ring-a { position:absolute; width:120%; height:120%; border-radius:50%; border:1.5px solid rgba(34,197,94,.18); animation:yq-spin-slow 22s linear infinite; }
.yq-ring-b { position:absolute; width:145%; height:145%; border-radius:50%; border:1px dashed rgba(34,197,94,.09); animation:yq-spin-rev 34s linear infinite; }
.yq-ring-c { position:absolute; width:170%; height:170%; border-radius:50%; border:1px solid rgba(34,197,94,.04); animation:yq-ringPulse 6s ease-in-out infinite; }

.yq-orbit-dot {
  position:absolute; width:8px; height:8px; border-radius:50%;
  background:#22c55e; box-shadow:0 0 12px #22c55e;
  top:50%; left:50%;
  transform-origin: 0 0;
  animation: yq-spin-slow 22s linear infinite;
  margin-left: -4px; margin-top: calc(-60% - 4px);
}
.yq-orbit-dot-b {
  position:absolute; width:5px; height:5px; border-radius:50%;
  background:#34d399; box-shadow:0 0 8px #34d399;
  top:50%; left:50%;
  transform-origin: 0 0;
  animation: yq-spin-rev 34s linear infinite;
  margin-left: -2.5px; margin-top: calc(-72.5% - 2.5px);
}

/* ── Metric cards ── */
.yq-metric-dashboard {
  display: grid; grid-template-columns: repeat(3,1fr);
  gap: 1.1rem; margin-top: 3.5rem; max-width: 580px;
}
.yq-metric-card {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 16px; padding: 20px;
  display: flex; flex-direction: column;
  transition: border-color .28s, background .28s, transform .28s;
  backdrop-filter: blur(10px);
  position: relative; overflow: hidden;
}
.yq-metric-card::before {
  content:''; position:absolute; top:0; left:0; right:0; height:2px;
  background: linear-gradient(90deg,#22c55e,transparent);
  opacity:0; transition:opacity .28s;
}
.yq-metric-card:hover { border-color:rgba(34,197,94,.28); background:rgba(34,197,94,.03); transform:translateY(-4px); }
.yq-metric-card:hover::before { opacity:1; }
.yq-metric-number { font-family:var(--font-display); font-size:clamp(1.6rem,3vw,2.4rem); color:#fff; line-height:1; margin-bottom:6px; font-variant-numeric: tabular-nums; }
.yq-metric-label  { font-family:var(--font-mono); font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:rgba(255,255,255,.35); }
.yq-metric-dot    { width:6px; height:6px; border-radius:50%; background:#22c55e; box-shadow:0 0 8px #22c55e; margin-bottom:14px; animation:yq-blink 2.5s infinite; }

/* ── Ticker ── */
.yq-ticker-wrapper { overflow:hidden; background:#080808; border-top:1px solid rgba(34,197,94,.08); border-bottom:1px solid rgba(34,197,94,.08); padding:16px 0; position:relative; width:100%; }
.yq-ticker-track  { display:flex; width:max-content; animation:yq-ticker 38s linear infinite; }
.yq-ticker-item   { display:flex; align-items:center; gap:10px; padding:0 40px; font-family:var(--font-mono); font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,.28); white-space:nowrap; }
.yq-ticker-dot    { width:4px; height:4px; border-radius:50%; background:#22c55e; }

/* ── Scroll indicator ── */
.yq-scroll-indicator {
  position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  z-index: 5; opacity: .5;
}
.yq-scroll-indicator span {
  font-family: var(--font-mono); font-size: 9px; font-weight: 700;
  letter-spacing: .2em; text-transform: uppercase; color: rgba(255,255,255,.4);
}
.yq-scroll-dot-wrap {
  width: 20px; height: 32px; border: 1.5px solid rgba(255,255,255,.2); border-radius: 12px;
  display: flex; justify-content: center; padding-top: 6px;
}
.yq-scroll-dot { width: 3px; height: 6px; border-radius: 2px; background: #22c55e; animation: yq-scrollDot 1.6s ease-in-out infinite; }

/* ── Spotlight (follows cursor) ── */
.yq-spotlight {
  position: fixed; inset: 0; pointer-events: none; z-index: 1;
  background: radial-gradient(600px circle at var(--mx) var(--my), rgba(34,197,94,0.08), transparent 45%);
  transition: background .1s ease-out;
}

/* ── Floating blobs — глубина фона ── */
@keyframes yq-blobDrift1 { 0%,100%{ transform: translate(0,0) scale(1); } 33%{ transform: translate(60px,-40px) scale(1.15); } 66%{ transform: translate(-30px,50px) scale(0.9); } }
@keyframes yq-blobDrift2 { 0%,100%{ transform: translate(0,0) scale(1); } 40%{ transform: translate(-70px,30px) scale(1.1); } 70%{ transform: translate(40px,-60px) scale(0.95); } }
.yq-blob {
  position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0;
  opacity: 0.55;
}

/* ── Sparkles — мерцающие искры ── */
@keyframes yq-twinkle { 0%,100% { opacity: 0; transform: scale(0.4); } 50% { opacity: var(--sp-op, .8); transform: scale(1); } }
.yq-spark {
  position: absolute; border-radius: 50%; background: #6ee7b7;
  box-shadow: 0 0 6px 1px rgba(110,231,183,.8);
  animation: yq-twinkle ease-in-out infinite;
  pointer-events: none;
}

/* ── Video modal ── */
.yq-video-overlay {
  position: fixed; inset: 0; z-index: 2000;
  background: rgba(3,6,4,0.92); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 24px; animation: yq-fadeIn .25s ease both;
}
.yq-video-box {
  width: 100%; max-width: 920px; aspect-ratio: 16/9;
  border-radius: 18px; overflow: hidden; position: relative;
  border: 1px solid rgba(34,197,94,.3); box-shadow: 0 40px 100px rgba(0,0,0,.6);
  background: #000;
}
.yq-video-close {
  position: absolute; top: 14px; right: 14px; z-index: 2;
  width: 38px; height: 38px; border-radius: 50%;
  background: rgba(0,0,0,.55); border: 1px solid rgba(255,255,255,.15);
  color: #fff; font-size: 16px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(8px);
}
.yq-btn-play {
  background: rgba(255,255,255,0.03); color: rgba(255,255,255,.85);
  border: 1px solid rgba(255,255,255,.12);
  font-family: var(--font-mono); font-size: 11px; font-weight: 700;
  letter-spacing: 1.5px; text-transform: uppercase;
  padding: 16px 30px 16px 22px; border-radius: 12px;
  display: inline-flex; align-items: center; gap: 12px;
  cursor: pointer; transition: border-color .3s, background .3s, transform .3s;
}
.yq-btn-play:hover { border-color: rgba(34,197,94,.5); background: rgba(34,197,94,.06); transform: translateY(-2px); }
.yq-btn-play-icon {
  width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
  background: var(--green); display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 16px rgba(34,197,94,.5);
}

/* ── Section: manifesto ── */
.yq-manifesto {
  padding: clamp(5rem,10vw,8rem) clamp(1.5rem,5vw,5rem);
  max-width: 1300px; margin: 0 auto; position: relative; z-index: 2;
}
.yq-manifesto-line {
  font-family: var(--font-display);
  font-size: clamp(1.8rem,4.2vw,3.6rem);
  line-height: 1.15; text-transform: uppercase; letter-spacing: -0.01em;
  color: rgba(255,255,255,.14);
  transition: color .5s ease;
}
.yq-manifesto-line.active { color: #fff; }
.yq-manifesto-line .hl { color: var(--green); }

/* ── Responsive ── */
@media(max-width:1024px){
  .yq-hero-grid { grid-template-columns:1fr; gap:4rem; text-align:center; justify-items:center; }
  .yq-logo-col  { order:-1; width:100%; display:flex; justify-content:center; }
  .yq-sub, .yq-btns { display:flex; justify-content:center; }
  .yq-sub p { margin:1.5rem auto 0; }
  .yq-btns   { flex-wrap:wrap; }
  .yq-metric-dashboard { margin:3rem auto 0; }
  .yq-metric-card { align-items:center; text-align:center; }
}
@media(max-width:768px){
  .yq-logo-anim { width:55vw; max-width:220px; }
  .yq-ring-container { height:280px; min-height:280px; }
  .yq-metric-dashboard { grid-template-columns:1fr; max-width:300px; }
  .yq-scroll-indicator { display: none; }
}
`;

/* ─────────────────────────────────────────
   PARTICLE + LEAF CANVAS
───────────────────────────────────────── */
function ForestCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let id: number, w: number, h: number;
    const nodes: any[] = [], leaves: any[] = [], pulses: any[] = [];

    const resize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };

    const init = () => {
      resize();
      nodes.length = 0; leaves.length = 0; pulses.length = 0;
      for (let i = 0; i < 90; i++) {
        nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45, r: Math.random() * 2.2 + .6, a: Math.random() * .65 + .2, pulse: Math.random() * Math.PI * 2, pulseSpeed: Math.random() * .028 + .01 });
      }
      for (let i = 0; i < 28; i++) {
        leaves.push({ x: Math.random() * w, y: Math.random() * h + h, vx: (Math.random() - .5) * .65, vy: -(Math.random() * .85 + .28), size: Math.random() * 12 + 6, rot: Math.random() * Math.PI * 2, vrot: (Math.random() - .5) * .022, a: Math.random() * .38 + .13, wobble: Math.random() * Math.PI * 2, wobbleSpeed: Math.random() * .022 + .008, hue: Math.random() * 30 });
      }
      for (let i = 0; i < 6; i++) {
        pulses.push({ x: Math.random() * w, y: Math.random() * h, r: 0, maxR: Math.random() * 200 + 80, speed: Math.random() * .8 + .35, delay: i * 40 });
      }
    };

    const drawLeaf = (x: number, y: number, size: number, rot: number, alpha: number, hue: number) => {
      ctx.save();
      ctx.translate(x, y); ctx.rotate(rot);
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * .7, -size * .6, size * .7, size * .5, 0, size * .35);
      ctx.bezierCurveTo(-size * .7, size * .5, -size * .7, -size * .6, 0, -size);
      const g = ctx.createLinearGradient(0, -size, 0, size * .35);
      g.addColorStop(0, `hsl(${142 + hue},78%,52%)`);
      g.addColorStop(1, `hsl(${155 + hue},70%,37%)`);
      ctx.fillStyle = g; ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -size * .85); ctx.quadraticCurveTo(size * .08, 0, 0, size * .3);
      ctx.strokeStyle = "rgba(255,255,255,0.22)"; ctx.lineWidth = .85; ctx.stroke();
      ctx.restore(); ctx.globalAlpha = 1;
    };

    let frame = 0;
    const tick = () => {
      frame++;
      ctx.clearRect(0, 0, w, h);
      for (const p of pulses) {
        if (frame < p.delay) continue;
        p.r += p.speed;
        if (p.r > p.maxR) { p.r = 0; p.x = Math.random() * w; p.y = Math.random() * h; p.maxR = Math.random() * 200 + 80; }
        const fade = 1 - p.r / p.maxR;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(34,197,94,${.16 * fade})`; ctx.lineWidth = 1.5; ctx.stroke();
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 155) {
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(34,197,94,${.17 * (1 - d / 155)})`; ctx.lineWidth = .75; ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        n.pulse += n.pulseSpeed;
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0) n.x = w; if (n.x > w) n.x = 0;
        if (n.y < 0) n.y = h; if (n.y > h) n.y = 0;
        const pa = n.a * (.65 + .35 * Math.sin(n.pulse));
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4.5);
        grd.addColorStop(0, `rgba(34,197,94,${pa * .55})`); grd.addColorStop(1, "transparent");
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 4.5, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,197,94,${pa})`; ctx.fill();
      }
      for (const l of leaves) {
        l.wobble += l.wobbleSpeed;
        l.x += l.vx + Math.sin(l.wobble) * .5;
        l.y += l.vy; l.rot += l.vrot;
        if (l.y < -30) { l.y = h + 30; l.x = Math.random() * w; }
        drawLeaf(l.x, l.y, l.size, l.rot, l.a, l.hue);
      }
      id = requestAnimationFrame(tick);
    };

    init(); tick();
    const onResize = () => init();
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

/* ─────────────────────────────────────────
   NOISE TEXTURE OVERLAY — убирает "плоскость" фона
───────────────────────────────────────── */
function NoiseOverlay() {
  return (
    <svg style={{ position: "fixed", inset: 0, zIndex: 1, opacity: 0.03, pointerEvents: "none" }}>
      <filter id="yqNoise"><feTurbulence baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" /></filter>
      <rect width="100%" height="100%" filter="url(#yqNoise)" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   SPOTLIGHT — фон "светится" под курсором
───────────────────────────────────────── */
function Spotlight() {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return <div className="yq-spotlight" />;
}

/* ─────────────────────────────────────────
   SPLIT-TEXT REVEAL — буквы каскадом
───────────────────────────────────────── */
function SplitReveal({ text, baseDelay = 0 }: { text: string; baseDelay?: number }) {
  return (
    <>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="hw-letter"
          style={{ animation: `yq-letterUp .7s cubic-bezier(.16,1,.3,1) ${baseDelay + i * 0.028}s both` }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────
   MAGNETIC LINK — тянется к курсору
───────────────────────────────────────── */
function MagneticLink({ to, className, children }: { to: string; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.22}px, ${y * 0.3}px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = "translate(0,0)"; };

  return (
    <Link
      ref={ref}
      to={to}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ transition: "transform .18s cubic-bezier(.16,1,.3,1)" }}
    >
      {children}
    </Link>
  );
}

/* ─────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────── */
function Counter({ target }: { target: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const num = parseInt(target.replace(/\D/g, "")) || 0;
      let cur = 0; const step = Math.ceil(num / 55);
      const t = setInterval(() => { cur = Math.min(cur + step, num); setVal(cur); if (cur >= num) clearInterval(t); }, 22);
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  const num = parseInt(target.replace(/\D/g, "")) || 0;
  const plus = target.includes("+") ? "+" : "";
  const pct = target.includes("%") ? "%" : "";
  return <span ref={ref}>{val >= num ? target : val + plus + pct}</span>;
}

/* ─────────────────────────────────────────
   SCROLL-DRIVEN REVEAL — реагирует на прогресс скролла,
   не просто "появился/не появился"
───────────────────────────────────────── */
function ScrollReveal({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf: number;
    const update = () => {
      const el = ref.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = Math.max(0, Math.min(1, 1 - (rect.top - vh * 0.15) / (vh * 0.6)));
        setProgress(p);
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: progress,
        transform: `translateY(${(1 - progress) * 36}px) scale(${0.96 + progress * 0.04})`,
        willChange: "transform, opacity",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   MANIFESTO — построчный текст, подсвечивается по скроллу
───────────────────────────────────────── */
function ManifestoLine({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.6 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className={`yq-manifesto-line${active ? " active" : ""}`}>{children}</div>;
}

/* ─────────────────────────────────────────
   FLOATING BLOBS — размытые дрейфующие пятна,
   добавляют глубину фону поверх canvas-частиц
───────────────────────────────────────── */
function FloatingBlobs() {
  return (
    <>
      <div className="yq-blob" style={{
        width: 420, height: 420, top: "8%", left: "-6%",
        background: "radial-gradient(circle, rgba(34,197,94,0.35), transparent 70%)",
        animation: "yq-blobDrift1 22s ease-in-out infinite",
      }} />
      <div className="yq-blob" style={{
        width: 360, height: 360, bottom: "4%", right: "-4%",
        background: "radial-gradient(circle, rgba(16,185,129,0.28), transparent 70%)",
        animation: "yq-blobDrift2 26s ease-in-out infinite",
      }} />
      <div className="yq-blob" style={{
        width: 260, height: 260, top: "45%", right: "18%",
        background: "radial-gradient(circle, rgba(110,231,183,0.2), transparent 70%)",
        animation: "yq-blobDrift1 18s ease-in-out infinite reverse",
      }} />
    </>
  );
}

/* ─────────────────────────────────────────
   SPARKLES — мерцающие искры, разбросанные по hero
───────────────────────────────────────── */
function Sparkles({ count = 22 }: { count?: number }) {
  const sparks = useState(() =>
    Array.from({ length: count }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2.2 + 1,
      dur: Math.random() * 3 + 2.2,
      delay: Math.random() * 5,
      op: Math.random() * 0.5 + 0.4,
    }))
  )[0];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 3, pointerEvents: "none" }}>
      {sparks.map((s, i) => (
        <span
          key={i}
          className="yq-spark"
          style={{
            top: `${s.top}%`, left: `${s.left}%`,
            width: s.size, height: s.size,
            animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s`,
            ["--sp-op" as any]: s.op,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   VIDEO MODAL — интро-ролик по клику
   ⚠️ Положи свой видеофайл в /public/videos/intro.mp4
   (или замени src на ссылку на YouTube/Vimeo embed)
───────────────────────────────────────── */
function VideoModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className="yq-video-overlay" onClick={onClose}>
      <div className="yq-video-box" onClick={e => e.stopPropagation()}>
        <button className="yq-video-close" onClick={onClose} aria-label="Close video">✕</button>
        <video
          src="/videos/intro.mp4"
          poster={logoImg}
          controls
          autoPlay
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        >
          Sorry, your browser doesn't support embedded video.
        </video>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export function HomePage() {
  const [videoOpen, setVideoOpen] = useState(false);

  const metrics = [
    { number: "1,000+", label: "Active Volunteers" },
    { number: "45+", label: "Eco Projects" },
    { number: "100%", label: "Verified Impact" },
  ];

  const tickerItems = [
    "Sustainability", "Action Verified", "Ecological Integrity",
    "Community Capital", "Tree Survival Data", "Open Source Impact",
    "Region by Region", "Radical Transparency",
  ];

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <ForestCanvas />
      <NoiseOverlay />
      <Spotlight />
      <FloatingBlobs />

      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 75% 60% at 10% 25%, rgba(34,197,94,0.11) 0%, transparent 60%), radial-gradient(ellipse 55% 50% at 88% 75%, rgba(16,185,129,0.07) 0%, transparent 58%)",
      }} />

      <div style={{
        position: "fixed", top: 0, left: 0, width: "100%", height: "3px",
        background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.08), transparent)",
        animation: "yq-scanline 7s linear infinite",
        pointerEvents: "none", zIndex: 1,
      }} />

      {/* ── HERO ── */}
      <section className="yq-hero-container" style={{ position: "relative", zIndex: 2 }}>
        <Sparkles count={22} />
        <div className="yq-hero-grid">

          <div className="yq-content-col">
            <div className="yq-eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: "1.6rem" }}>
              <span style={{ width: 32, height: 1.5, background: "#22c55e", borderRadius: 2, display: "inline-block" }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 800, letterSpacing: ".28em", textTransform: "uppercase", color: "#22c55e" }}>
                Official Platform
              </span>
            </div>

            <h1 className="hw"><SplitReveal text="Yashil Qo'llar" baseDelay={0.1} /></h1>
            <h1 className="hw"><span className="hw-em hw-em-reveal">Platform</span></h1>

            <div className="yq-sub" style={{ marginTop: "1.6rem", maxWidth: 520 }}>
              <p style={{ color: "rgba(255,255,255,0.42)", fontFamily: "var(--font-sans)", fontSize: "1.05rem", lineHeight: 1.72, margin: 0 }}>
                Bridging the gap between hands-on volunteers and vital
                environmental initiatives. Together, we're building a more
                resilient Uzbekistan — one project, one tree, one community at a time.
              </p>
            </div>

            <div className="yq-btns" style={{ display: "flex", gap: "1rem", marginTop: "2.4rem", flexWrap: "wrap" }}>
              <MagneticLink to="/login" className="yq-btn-primary">
                Join Ecosystem
                <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                  <path d="M1 6H13M13 6L8 1M13 6L8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </MagneticLink>
              <MagneticLink to="/about" className="yq-btn-ghost">Read Blueprint</MagneticLink>
              <button className="yq-btn-play" onClick={() => setVideoOpen(true)}>
                <span className="yq-btn-play-icon">
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="none"><path d="M0 0L10 6L0 12V0Z" fill="#000" /></svg>
                </span>
                Watch the Story
              </button>
            </div>

            <div className="yq-metric-dashboard">
              {metrics.map((m, i) => (
                <ScrollReveal key={i} style={{ transitionDelay: `${i * 60}ms` }}>
                  <div className="yq-metric-card">
                    <div className="yq-metric-dot" />
                    <span className="yq-metric-number"><Counter target={m.number} /></span>
                    <span className="yq-metric-label">{m.label}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <div className="yq-logo-col">
            <div className="yq-ring-container">
              <img src={logoImg} alt="Yashil Qo'llar" className="yq-logo-anim" />
              <div className="yq-ring-a" />
              <div className="yq-ring-b" />
              <div className="yq-ring-c" />
              <div className="yq-orbit-dot" />
              <div className="yq-orbit-dot-b" />
            </div>
          </div>

        </div>

        <div className="yq-scroll-indicator">
          <span>Scroll</span>
          <div className="yq-scroll-dot-wrap"><div className="yq-scroll-dot" /></div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="yq-ticker-wrapper" style={{ position: "relative", zIndex: 2 }}>
        <div className="yq-ticker-track">
          {[...Array(4)].map((_, ti) => (
            <div key={ti} style={{ display: "flex" }}>
              {tickerItems.map((item, ii) => (
                <div className="yq-ticker-item" key={ii}>
                  {item} <div className="yq-ticker-dot" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── MANIFESTO ── */}
      <section className="yq-manifesto">
        <ManifestoLine>We don't count <span className="hl">trees planted.</span></ManifestoLine>
        <ManifestoLine>We count <span className="hl">trees survived.</span></ManifestoLine>
        <ManifestoLine>Every project, <span className="hl">GPS-tagged.</span></ManifestoLine>
        <ManifestoLine>Every result, <span className="hl">public.</span></ManifestoLine>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ position: "relative", zIndex: 2, padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,5rem) clamp(6rem,10vw,9rem)", maxWidth: 1300, margin: "0 auto", textAlign: "center" }}>
        <ScrollReveal>
          <h2 className="hw" style={{ fontSize: "clamp(2rem,5vw,4rem)", marginBottom: "1.4rem" }}>
            Ready to plant<br /><span className="hw-em">the future?</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-sans)", fontSize: "1rem", maxWidth: 460, margin: "0 auto 2.2rem", lineHeight: 1.7 }}>
            Join volunteers across all 14 regions of Uzbekistan already tracked, verified, and growing.
          </p>
          <MagneticLink to="/login" className="yq-btn-primary">
            Join Ecosystem
            <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
              <path d="M1 6H13M13 6L8 1M13 6L8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </MagneticLink>
        </ScrollReveal>
      </section>

      {videoOpen && <VideoModal onClose={() => setVideoOpen(false)} />}
    </>
  );
}

export default HomePage;