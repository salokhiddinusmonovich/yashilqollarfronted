import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../contexts/LanguageContext";
import logoImg from "./photo_2025-10-08_22-18-51.jpg";

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:wght@600;700;800&family=Inter:wght@300;400;500;600&display=swap');

:root {
  --green: #22C55E;
  --dark: #060606;
  --text-muted: rgba(255,255,255,0.44);
  --font-display: 'Anton', sans-serif;
  --font-sans: 'Inter', sans-serif;
  --font-label: 'Montserrat', sans-serif;
  --mx: 50%;
  --my: 50%;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
}

@keyframes yq-fadeUp    { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
@keyframes yq-spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes yq-spin-rev  { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
@keyframes yq-ticker    { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
@keyframes yq-scrollDot { 0%,100%{transform:translateY(0);opacity:.9} 50%{transform:translateY(12px);opacity:.3} }
@keyframes yq-logo-drift { 0%,100% { transform: translateY(0) rotateY(-7deg); } 50% { transform: translateY(-14px) rotateY(7deg); } }
@keyframes yq-orbit-dot  { from { transform: rotate(0deg) translateX(150px) rotate(0deg); } to { transform: rotate(360deg) translateX(150px) rotate(-360deg); } }
@keyframes yq-glow-pulse { 0%,100% { opacity: .5; } 50% { opacity: 1; } }
@keyframes yq-quote-ring { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes yq-quote-shimmer { 0%,100% { opacity: .5; box-shadow: 0 0 8px var(--green); } 50% { opacity: 1; box-shadow: 0 0 20px var(--green); } }
@keyframes yq-quote-rise { from { opacity: 0; transform: translateY(30px) scale(.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes yq-mark-float { 0%,100% { transform: translateY(0) rotate(-6deg); } 50% { transform: translateY(-8px) rotate(6deg); } }

/* ── Typography ── */
.hw { display: block; font-family: var(--font-display); line-height: 0.94; text-transform: uppercase; letter-spacing: -0.01em; color: #fff; font-size: clamp(2.6rem, 6vw, 5.4rem); }
.hw-accent { color: var(--green); }

.yq-fade-1 { animation: yq-fadeUp .7s cubic-bezier(.16,1,.3,1) .05s both; }
.yq-fade-2 { animation: yq-fadeUp .7s cubic-bezier(.16,1,.3,1) .18s both; }
.yq-fade-3 { animation: yq-fadeUp .7s cubic-bezier(.16,1,.3,1) .3s both; }
.yq-fade-4 { animation: yq-fadeUp .7s cubic-bezier(.16,1,.3,1) .42s both; }

/* ── Buttons ── */
.yq-btn-primary {
  background: var(--green); color: #04120a; border: none;
  font-family: var(--font-label); font-size: 11px; font-weight: 800;
  letter-spacing: .12em; text-transform: uppercase;
  padding: 15px 32px; border-radius: 10px;
  display: inline-flex; align-items: center; gap: 10px;
  text-decoration: none; cursor: pointer;
  transition: filter .2s, transform .2s;
}
.yq-btn-primary:hover { filter: brightness(1.08); transform: translateY(-1px); }
.yq-btn-primary:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }

/* ── Hero layout ── */
.yq-hero { position: relative; overflow: hidden; background: var(--dark); padding-top: clamp(4.5rem,9vw,7rem); padding-bottom: 4rem; min-height: 90vh; display: flex; align-items: center; }
.yq-hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; align-items: center; width: 100%; max-width: 1280px; margin: 0 auto; padding: 0 clamp(1.5rem,5vw,4rem); gap: 3.5rem; position: relative; z-index: 4; }

/* ── Logo ── */
.yq-logo-stage { position: relative; display: flex; align-items: center; justify-content: center; width: 100%; min-height: 380px; perspective: 1200px; }
.yq-logo-drift { animation: yq-logo-drift 7s ease-in-out infinite; transform-style: preserve-3d; }
.yq-logo-tilt { transition: transform .15s ease-out; transform-style: preserve-3d; }
.yq-logo-img { position: relative; z-index: 2; width: 100%; max-width: 300px; border-radius: 50%; display: block; }
.yq-logo-glow { position: absolute; z-index: 1; width: 340px; height: 340px; border-radius: 50%; background: radial-gradient(circle, rgba(34,197,94,.35), transparent 70%); animation: yq-glow-pulse 4s ease-in-out infinite; }
.yq-ring-a { position: absolute; width: 120%; height: 120%; border-radius: 50%; border: 1px solid rgba(34,197,94,.2); animation: yq-spin-slow 26s linear infinite; }
.yq-ring-b { position: absolute; width: 142%; height: 142%; border-radius: 50%; border: 1px dashed rgba(34,197,94,.1); animation: yq-spin-rev 38s linear infinite; }
.yq-orbit-dot { position: absolute; top: 50%; left: 50%; width: 8px; height: 8px; margin: -4px; border-radius: 50%; background: var(--green); box-shadow: 0 0 12px var(--green); animation: yq-orbit-dot 9s linear infinite; }

/* ── Metric cards ── */
.yq-metrics { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; margin-top: 3rem; max-width: 560px; }
.yq-metric-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 18px; transition: border-color .2s, transform .2s; display: flex; flex-direction: column; }
.yq-metric-card:hover { border-color: rgba(34,197,94,.3); transform: translateY(-3px); }
.yq-metric-number { display: block; font-family: var(--font-display); font-size: clamp(1.5rem,2.6vw,2.1rem); color: #fff; line-height: 1; margin-bottom: 6px; font-variant-numeric: tabular-nums; }
.yq-metric-label { display: block; font-family: var(--font-label); font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: rgba(255,255,255,.4); }

/* ── Region ticker ── */
.yq-ticker-wrap { overflow: hidden; background: #080808; border-top: 1px solid rgba(34,197,94,.1); border-bottom: 1px solid rgba(34,197,94,.1); padding: 15px 0; position: relative; z-index: 3; }
.yq-ticker-track { display: flex; width: max-content; animation: yq-ticker 52s linear infinite; }
.yq-ticker-item { display: flex; align-items: center; gap: 9px; padding: 0 30px; font-family: var(--font-label); font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.4); white-space: nowrap; }
.yq-ticker-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--green); flex-shrink: 0; }

/* ── Scroll cue ── */
.yq-scroll-cue { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 4; opacity: .5; }
.yq-scroll-cue span { font-family: var(--font-label); font-size: 9px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: rgba(255,255,255,.4); }
.yq-scroll-pill { width: 19px; height: 30px; border: 1.5px solid rgba(255,255,255,.22); border-radius: 12px; display: flex; justify-content: center; padding-top: 6px; }
.yq-scroll-pill i { width: 3px; height: 6px; border-radius: 2px; background: var(--green); animation: yq-scrollDot 1.6s ease-in-out infinite; }

/* ── Spotlight ── */
.yq-spotlight { position: fixed; inset: 0; pointer-events: none; z-index: 1; background: radial-gradient(560px circle at var(--mx) var(--my), rgba(34,197,94,0.06), transparent 45%); }
@media (pointer: coarse) { .yq-spotlight { display: none; } }

/* ── What we do ── */
.yq-what { padding: clamp(4rem,8vw,6rem) clamp(1.5rem,5vw,4rem); max-width: 1280px; margin: 0 auto; position: relative; z-index: 2; }
.yq-region-chip { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 999px; padding: 8px 16px; font-family: var(--font-sans); font-size: 13px; color: rgba(255,255,255,.75); transition: border-color .2s, transform .2s; }
.yq-region-chip:hover { border-color: rgba(34,197,94,.35); transform: translateY(-2px); }
.yq-region-chip i { width: 6px; height: 6px; border-radius: 50%; background: var(--green); box-shadow: 0 0 6px var(--green); flex-shrink: 0; }

/* ── Quote ── */
.yq-quote-stage { position: relative; perspective: 1400px; max-width: 760px; margin: 0 auto; padding: 30px 10px; }
.yq-quote-ring { position: absolute; inset: -30px; border-radius: 26px; background: conic-gradient(from 0deg, transparent, rgba(34,197,94,.5), transparent 30%); animation: yq-quote-ring 10s linear infinite; opacity: .35; filter: blur(18px); pointer-events: none; }
.yq-quote-card {
  position: relative; z-index: 2;
  background: linear-gradient(160deg, rgba(34,197,94,0.07), rgba(255,255,255,0.015));
  border: 1px solid rgba(34,197,94,0.22);
  border-radius: 18px; padding: 38px 34px 32px;
  transition: transform .18s ease-out;
  transform-style: preserve-3d;
  animation: yq-quote-rise .8s cubic-bezier(.16,1,.3,1) both;
  overflow: hidden;
}
.yq-quote-edge { position: absolute; left: 0; top: 12%; bottom: 12%; width: 3px; border-radius: 3px; background: var(--green); animation: yq-quote-shimmer 2.6s ease-in-out infinite; }
.yq-quote-mark { position: absolute; top: -6px; right: 18px; font-family: var(--font-display); font-size: 120px; line-height: 1; color: rgba(34,197,94,0.14); animation: yq-mark-float 5s ease-in-out infinite; pointer-events: none; user-select: none; }

/* ── Map ── */
.yq-map-wrap { position: relative; background: rgba(255,255,255,0.02); border: 1px solid rgba(34,197,94,0.16); border-radius: 22px; padding: clamp(20px,4vw,40px); overflow: hidden; }
.yq-map-svg { width: 100%; height: auto; display: block; }
.yq-map-region {
  fill: rgba(34,197,94,0.14); stroke: rgba(140,255,180,0.65); stroke-width: 1.2; stroke-linejoin: round; cursor: pointer;
  transition: fill .18s, stroke .18s;
  stroke-dasharray: 4000; stroke-dashoffset: 4000;
  animation: yq-map-draw 1.8s ease forwards, yq-map-breathe 4.5s ease-in-out 2s infinite;
}
.yq-map-region:hover, .yq-map-region.active { fill: rgba(34,197,94,0.65) !important; stroke: #fff !important; animation-play-state: paused; }
@keyframes yq-map-draw { to { stroke-dashoffset: 0; } }
@keyframes yq-map-breathe { 0%,100% { fill-opacity: 1; } 50% { fill-opacity: .55; } }
.yq-map-dot-wrap { opacity: 0; animation: yq-fadeIn2 .6s ease forwards; }
@keyframes yq-fadeIn2 { to { opacity: 1; } }
.yq-map-dot { fill: rgba(255,255,255,0.75); transition: r .18s, fill .18s; pointer-events: none; }
.yq-map-dot-pulse { fill: none; stroke: var(--green); stroke-width: 1.4; opacity: 0; animation: yq-map-pulse 2.8s ease-out infinite; pointer-events: none; }
@keyframes yq-map-pulse { 0% { r: 2px; opacity: .9; } 100% { r: 13px; opacity: 0; } }
.yq-map-chip { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 999px; padding: 7px 14px; font-family: var(--font-sans); font-size: 12.5px; color: rgba(255,255,255,.7); transition: border-color .18s, color .18s, transform .18s; cursor: default; }
.yq-map-chip.active { border-color: var(--green); color: #fff; transform: translateY(-1px); }
.yq-map-chip i { width: 5px; height: 5px; border-radius: 50%; background: var(--green); flex-shrink: 0; }

@media (max-width: 1024px) {
  .yq-hero-grid { grid-template-columns: 1fr; gap: 3rem; text-align: center; justify-items: center; }
  .yq-logo-col { order: -1; width: 100%; display: flex; justify-content: center; }
  .yq-fade-2, .yq-fade-3 { display: flex; justify-content: center; }
  .yq-fade-2 p { margin: 1.4rem auto 0; }
  .yq-metrics { margin: 2.6rem auto 0; }
}
@media (max-width: 768px) {
  .yq-logo-img { width: 55vw; max-width: 200px; }
  .yq-logo-stage { min-height: 260px; }
  .yq-metrics { grid-template-columns: 1fr; max-width: 280px; }
  .yq-scroll-cue { display: none; }
  .yq-quote-mark { font-size: 70px; }
}
`;

/* Ambient particle canvas */
function ForestCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let id: number, w: number, h: number;
    const nodes: any[] = [], leaves: any[] = [];
    const resize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    const init = () => {
      resize(); nodes.length = 0; leaves.length = 0;
      for (let i = 0; i < 60; i++) nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 2 + .6, a: Math.random() * .6 + .2, pulse: Math.random() * Math.PI * 2, pulseSpeed: Math.random() * .024 + .01 });
      for (let i = 0; i < 16; i++) leaves.push({ x: Math.random() * w, y: Math.random() * h + h, vx: (Math.random() - .5) * .5, vy: -(Math.random() * .7 + .22), size: Math.random() * 10 + 6, rot: Math.random() * Math.PI * 2, vrot: (Math.random() - .5) * .018, a: Math.random() * .3 + .12, wobble: Math.random() * Math.PI * 2, wobbleSpeed: Math.random() * .018 + .008 });
    };
    const drawLeaf = (x: number, y: number, size: number, rot: number, alpha: number) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * .7, -size * .6, size * .7, size * .5, 0, size * .35);
      ctx.bezierCurveTo(-size * .7, size * .5, -size * .7, -size * .6, 0, -size);
      const g = ctx.createLinearGradient(0, -size, 0, size * .35);
      g.addColorStop(0, "hsl(142,78%,50%)"); g.addColorStop(1, "hsl(155,68%,36%)");
      ctx.fillStyle = g; ctx.fill();
      ctx.restore(); ctx.globalAlpha = 1;
    };
    if (reduceMotion) { resize(); return; }
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 140) { ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.strokeStyle = `rgba(34,197,94,${.14 * (1 - d / 140)})`; ctx.lineWidth = .7; ctx.stroke(); }
      }
      for (const n of nodes) {
        n.pulse += n.pulseSpeed; n.x += n.vx; n.y += n.vy;
        if (n.x < 0) n.x = w; if (n.x > w) n.x = 0; if (n.y < 0) n.y = h; if (n.y > h) n.y = 0;
        const pa = n.a * (.65 + .35 * Math.sin(n.pulse));
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(34,197,94,${pa})`; ctx.fill();
      }
      for (const l of leaves) {
        l.wobble += l.wobbleSpeed; l.x += l.vx + Math.sin(l.wobble) * .45; l.y += l.vy; l.rot += l.vrot;
        if (l.y < -30) { l.y = h + 30; l.x = Math.random() * w; }
        drawLeaf(l.x, l.y, l.size, l.rot, l.a);
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

function MagneticLink({ to, className, children }: { to: string; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.12}px, ${y * 0.16}px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = "translate(0,0)"; };
  return (
    <Link ref={ref} to={to} className={className} onMouseMove={handleMove} onMouseLeave={reset} style={{ transition: "transform .15s ease-out" }}>
      {children}
    </Link>
  );
}

function Counter({ target }: { target: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const num = parseInt(target.replace(/\D/g, ""), 10) || 0;
      let cur = 0; const step = Math.ceil(num / 50);
      const t = setInterval(() => { cur = Math.min(cur + step, num); setVal(cur); if (cur >= num) clearInterval(t); }, 22);
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  const num = parseInt(target.replace(/\D/g, ""), 10) || 0;
  const suffix = target.replace(/[\d,\s]/g, "");
  return <span ref={ref}>{val >= num ? target : val.toLocaleString() + suffix}</span>;
}

function FadeIn({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)", transition: "opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1)" }}>{children}</div>;
}

function AnimatedLogo() {
  const innerRef = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    if (innerRef.current) innerRef.current.style.transform = `rotateY(${px * 14}deg) rotateX(${-py * 14}deg)`;
  };
  const reset = () => { if (innerRef.current) innerRef.current.style.transform = "rotateY(0) rotateX(0)"; };
  return (
    <div className="yq-logo-stage" onMouseMove={handleMove} onMouseLeave={reset}>
      <div className="yq-logo-glow" />
      <div className="yq-ring-a" />
      <div className="yq-ring-b" />
      <div className="yq-orbit-dot" />
      <div className="yq-logo-drift">
        <div ref={innerRef} className="yq-logo-tilt">
          <img src={logoImg} alt="Yashil Qo'llar" className="yq-logo-img" />
        </div>
      </div>
    </div>
  );
}

function QuoteBlock({ quote, author }: { quote: string; author: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    if (cardRef.current) cardRef.current.style.transform = `rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateZ(10px)`;
  };
  const reset = () => { if (cardRef.current) cardRef.current.style.transform = "rotateY(0) rotateX(0) translateZ(0)"; };
  return (
    <div className="yq-quote-stage" onMouseMove={handleMove} onMouseLeave={reset}>
      <div className="yq-quote-ring" />
      <div ref={cardRef} className="yq-quote-card">
        <span className="yq-quote-mark" aria-hidden="true">"</span>
        <div className="yq-quote-edge" />
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(15px,2vw,19px)", fontWeight: 300, lineHeight: 1.7, color: "rgba(255,255,255,0.9)", fontStyle: "italic", margin: "0 0 16px", position: "relative", zIndex: 2 }}>
          "{quote}"
        </p>
        <p style={{ fontFamily: "var(--font-label)", fontSize: 12.5, color: "var(--green)", margin: 0, fontWeight: 700, position: "relative", zIndex: 2 }}>— {author}</p>
      </div>
    </div>
  );
}

/* Real region boundaries, sourced from simplemaps.com admin1 GeoJSON,
   simplified and projected to this viewBox. Order matches t.mapRegions exactly. */
const REGION_PATHS = [
  { d: "M483.5,222.3 L479.8,219.3 L482.8,213.7 L487.2,215.3 L487.7,218.6 L483.5,222.3 Z", cx: 483.7, cy: 217.7 },
  { d: "M526.0,231.8 L522.7,231.0 L521.7,235.9 L519.8,238.2 L510.3,243.8 L503.1,246.3 L499.2,249.8 L492.8,243.0 L489.6,241.7 L487.4,242.8 L486.0,245.2 L485.8,251.4 L481.9,252.7 L485.9,263.2 L485.7,265.5 L482.3,265.3 L485.0,269.0 L483.7,270.7 L477.6,269.1 L478.3,266.6 L477.5,264.2 L479.3,257.7 L479.1,255.1 L477.6,254.8 L479.2,251.7 L477.4,251.9 L478.1,250.6 L476.9,248.5 L473.1,247.4 L473.4,246.2 L471.1,242.9 L468.0,240.0 L465.9,239.8 L463.1,235.1 L466.2,233.4 L466.6,232.2 L465.4,231.5 L467.1,228.5 L476.1,222.8 L476.8,216.6 L478.1,216.7 L481.4,211.8 L489.8,211.3 L489.7,208.2 L493.0,206.5 L496.7,201.8 L508.1,199.3 L509.2,196.8 L511.4,196.9 L518.4,188.6 L521.6,187.0 L521.3,184.3 L522.9,182.8 L526.4,181.6 L528.7,184.7 L531.8,185.9 L533.7,180.8 L537.0,176.8 L539.5,176.9 L546.6,172.3 L553.8,176.7 L553.3,178.4 L544.2,183.8 L540.3,183.3 L538.6,189.3 L533.2,190.2 L525.9,199.3 L517.4,204.0 L515.2,206.8 L518.0,209.6 L522.0,209.5 L526.5,213.6 L523.9,218.2 L525.3,220.4 L524.3,223.4 L526.0,226.2 L526.0,231.8 Z", cx: 502.2, cy: 221.2 },
  { d: "M587.7,256.5 L587.7,253.0 L583.6,250.4 L576.0,250.3 L573.0,247.0 L567.5,246.6 L565.3,243.1 L566.4,242.1 L565.4,240.0 L567.5,237.7 L574.2,236.4 L585.2,237.3 L586.7,232.6 L592.2,229.7 L596.9,232.1 L596.9,233.9 L599.1,234.6 L601.2,238.8 L605.1,240.1 L610.0,238.8 L610.4,241.0 L612.7,241.6 L615.4,239.7 L620.0,240.3 L618.1,243.2 L614.7,243.5 L610.0,245.9 L609.9,247.1 L606.7,247.6 L606.2,252.3 L603.9,251.4 L602.0,255.3 L597.4,252.5 L596.7,253.5 L594.4,250.3 L592.0,251.0 L592.7,255.3 L594.9,257.7 L594.1,260.6 L590.9,258.4 L589.7,258.9 L587.7,256.5 Z", cx: 590.5, cy: 243.9 },
  { d: "M536.5,246.7 L542.6,243.0 L549.4,243.6 L547.2,246.7 L554.5,250.4 L559.3,245.7 L565.3,243.1 L567.7,246.7 L571.2,246.3 L575.7,250.2 L583.6,250.4 L587.3,252.6 L587.7,256.5 L586.0,256.1 L578.5,264.4 L579.7,266.6 L577.8,267.3 L578.8,267.8 L574.4,267.4 L570.4,272.1 L568.3,269.9 L569.8,269.7 L568.8,266.5 L566.7,266.8 L566.1,269.3 L564.6,269.1 L562.9,268.4 L562.6,266.2 L552.1,263.0 L543.6,265.8 L543.5,268.1 L531.8,269.9 L530.4,268.8 L528.3,263.1 L523.0,262.1 L522.4,257.9 L526.7,255.6 L536.5,246.7 Z", cx: 554.6, cy: 257.0 },
  { d: "M565.3,243.1 L559.3,245.7 L554.5,250.4 L547.2,246.7 L549.4,243.6 L542.6,243.0 L536.5,246.7 L536.8,244.8 L531.7,242.5 L532.0,241.1 L534.7,241.5 L526.0,231.8 L526.0,226.2 L524.3,223.4 L525.3,220.4 L523.9,217.9 L526.5,213.6 L529.2,213.4 L533.4,210.6 L536.9,216.1 L536.5,220.8 L537.5,223.4 L539.0,220.9 L543.3,224.7 L546.0,223.8 L551.3,227.5 L552.2,223.7 L554.7,227.3 L556.2,225.4 L559.0,227.3 L560.8,225.1 L560.3,218.8 L564.7,218.9 L567.2,216.5 L568.6,212.7 L570.0,213.7 L569.7,211.8 L571.0,211.7 L575.2,218.0 L575.1,223.4 L576.2,224.8 L582.5,226.9 L586.0,225.1 L586.5,230.6 L585.3,231.8 L586.7,232.6 L585.2,237.3 L574.2,236.4 L567.5,237.7 L565.4,240.0 L566.4,242.1 L565.3,243.1 Z", cx: 553.2, cy: 230.8 },
  { d: "M463.1,235.1 L465.9,239.8 L468.0,240.0 L471.1,242.9 L473.4,246.2 L473.1,247.4 L476.9,248.5 L478.1,250.6 L477.4,251.9 L479.2,251.7 L477.6,254.8 L479.1,255.1 L479.3,257.7 L477.5,264.2 L478.3,266.6 L477.6,269.1 L462.5,270.6 L463.2,266.0 L452.7,268.6 L443.8,268.3 L443.4,264.7 L447.6,255.1 L445.8,254.6 L446.0,251.3 L448.8,250.6 L449.3,248.3 L456.2,251.9 L462.7,250.2 L461.8,249.5 L462.8,247.8 L462.1,245.5 L460.6,245.1 L459.9,239.0 L460.8,236.3 L463.1,235.1 Z M464.4,274.0 L472.6,272.3 L474.2,273.5 L474.2,276.1 L470.9,275.9 L468.4,277.4 L467.1,275.4 L466.6,276.3 L470.8,284.8 L469.3,285.5 L466.6,280.1 L467.5,284.7 L466.2,287.3 L464.0,285.3 L462.4,286.3 L462.8,284.0 L461.7,283.0 L462.8,283.1 L463.0,281.3 L462.2,277.5 L464.4,274.0 Z", cx: 462.8, cy: 256.9 },
  { d: "M449.3,248.3 L448.8,250.6 L445.9,251.5 L445.8,254.6 L447.6,255.1 L443.4,264.7 L443.3,267.4 L452.7,268.6 L463.4,266.0 L462.5,270.6 L460.3,271.5 L464.4,274.0 L462.2,277.5 L462.9,282.8 L461.7,283.0 L462.8,284.0 L461.5,287.2 L460.5,296.7 L458.2,298.6 L458.1,300.2 L453.5,301.3 L430.1,296.7 L422.8,300.0 L422.2,302.9 L420.3,303.2 L415.7,298.8 L415.4,294.8 L418.0,293.5 L418.3,289.4 L422.5,287.7 L421.1,282.1 L408.5,279.7 L406.1,277.8 L405.7,275.8 L403.2,276.1 L402.8,273.4 L404.2,271.0 L401.7,267.1 L401.3,257.3 L391.7,256.1 L398.0,243.0 L396.8,237.8 L392.2,235.6 L391.5,228.6 L396.5,225.4 L431.2,223.9 L434.2,225.2 L437.7,223.4 L441.0,230.5 L443.7,229.5 L444.2,230.5 L441.9,232.1 L443.1,233.9 L442.2,235.1 L443.4,235.5 L439.0,239.0 L439.2,240.4 L449.3,248.3 Z", cx: 427.4, cy: 261.9 },
  { d: "M391.7,256.1 L401.3,257.3 L401.7,267.1 L404.2,271.0 L402.8,273.4 L403.2,276.1 L405.9,276.0 L407.3,279.2 L421.7,283.0 L422.5,287.7 L418.3,289.4 L418.0,293.5 L415.4,294.8 L415.7,298.8 L420.3,303.2 L418.5,312.1 L407.3,310.0 L406.8,311.9 L402.0,312.0 L400.6,306.9 L394.1,305.7 L387.9,309.9 L383.6,307.3 L371.8,310.9 L369.3,310.1 L368.8,306.6 L363.0,299.9 L361.2,300.1 L360.9,302.0 L358.9,303.3 L343.9,302.9 L341.6,297.6 L342.9,293.5 L341.8,289.2 L339.3,285.8 L343.8,284.6 L345.0,282.6 L350.2,283.6 L352.7,272.4 L364.3,278.1 L373.3,276.8 L376.4,273.6 L374.1,272.3 L376.9,265.9 L376.5,258.9 L377.9,257.5 L377.3,254.1 L378.8,251.2 L383.2,252.3 L387.9,250.0 L390.5,252.5 L391.7,256.1 Z", cx: 384.0, cy: 286.8 },
  { d: "M339.8,304.2 L329.6,313.4 L331.0,318.2 L318.2,323.2 L313.5,327.9 L311.0,326.6 L306.3,327.6 L289.7,315.4 L289.3,313.1 L279.7,305.0 L250.5,284.0 L245.8,278.7 L244.8,273.8 L245.3,270.1 L242.2,258.7 L237.0,255.0 L245.7,242.4 L238.4,232.6 L246.3,228.8 L236.3,214.2 L248.7,209.5 L251.7,209.6 L264.2,229.1 L278.2,235.1 L288.7,241.7 L290.7,245.3 L294.9,243.8 L301.5,233.9 L303.6,235.8 L304.3,241.4 L305.8,242.0 L315.2,243.1 L317.1,238.2 L325.1,236.9 L327.3,234.8 L329.6,243.2 L332.0,245.0 L347.8,246.1 L346.9,254.6 L343.7,254.5 L339.7,263.5 L332.6,261.8 L329.7,262.8 L330.6,265.9 L329.5,268.1 L331.7,271.2 L329.0,272.2 L320.6,283.5 L326.7,290.9 L329.9,290.6 L334.4,293.2 L335.7,298.1 L339.0,300.5 L339.8,304.2 Z", cx: 290.2, cy: 270.6 },
  { d: "M396.5,225.4 L391.5,228.6 L392.2,235.6 L396.8,237.8 L398.0,243.0 L391.7,256.1 L390.5,252.5 L387.9,250.0 L383.2,252.3 L378.8,251.2 L377.3,254.1 L377.9,257.5 L376.5,258.9 L376.9,265.9 L374.1,272.3 L376.4,273.6 L373.3,276.8 L364.3,278.1 L352.7,272.4 L350.2,283.6 L345.0,282.6 L343.8,284.6 L339.3,285.8 L341.8,289.2 L342.9,293.5 L341.6,297.6 L343.9,302.9 L339.8,304.2 L339.0,300.5 L335.7,298.1 L334.4,293.2 L329.9,290.6 L326.7,290.9 L320.6,283.5 L329.0,272.2 L331.7,271.2 L329.5,268.1 L330.6,265.9 L329.7,262.8 L332.6,261.8 L339.7,263.5 L343.7,254.5 L346.9,254.6 L347.8,246.1 L332.0,245.0 L329.6,243.2 L327.3,234.8 L325.1,236.9 L317.1,238.2 L315.2,243.1 L305.8,242.0 L304.3,241.4 L303.6,235.8 L301.5,233.9 L294.9,243.8 L290.7,245.3 L288.7,241.7 L278.2,235.1 L264.2,229.1 L251.7,209.6 L248.7,209.5 L236.3,214.2 L221.3,193.6 L221.8,191.7 L229.9,186.8 L225.1,177.6 L225.9,167.4 L246.5,127.9 L236.5,124.6 L231.0,116.8 L272.3,110.0 L314.9,113.7 L332.3,105.7 L344.5,119.8 L353.1,125.4 L362.8,145.0 L373.5,141.0 L371.9,165.3 L370.5,167.1 L370.3,188.5 L388.1,190.7 L391.2,220.8 L393.6,221.0 L394.1,223.2 L396.5,225.4 Z", cx: 312.3, cy: 187.0 },
  { d: "M343.9,302.9 L358.9,303.3 L360.9,302.0 L361.2,300.1 L363.3,299.9 L365.1,303.4 L368.8,306.6 L369.3,310.1 L371.8,310.9 L383.6,307.3 L387.9,309.9 L393.6,305.7 L400.6,306.9 L402.0,312.0 L406.8,311.9 L407.3,310.0 L417.5,312.3 L417.2,315.6 L418.2,316.5 L428.4,319.7 L428.6,325.7 L423.1,327.7 L424.5,333.2 L423.6,339.6 L420.8,338.3 L418.8,339.2 L416.2,344.2 L410.5,349.2 L409.3,354.4 L400.7,360.3 L399.0,364.3 L394.4,368.9 L393.1,373.5 L389.8,370.8 L385.4,370.8 L381.1,368.9 L378.2,365.0 L367.0,359.6 L363.0,360.4 L353.9,358.9 L336.3,344.2 L328.7,340.6 L313.5,327.9 L318.2,323.2 L331.0,318.2 L329.4,314.5 L329.9,312.9 L339.8,304.2 L343.9,302.9 Z", cx: 373.8, cy: 332.9 },
  { d: "M393.1,373.5 L394.4,368.9 L399.0,364.3 L400.7,360.3 L409.3,354.4 L410.5,349.2 L416.2,344.2 L418.8,339.2 L420.8,338.3 L423.6,339.6 L424.6,336.5 L423.0,328.4 L423.8,326.9 L428.6,325.7 L433.6,327.0 L442.7,326.0 L445.7,331.1 L445.3,334.4 L442.3,335.7 L442.6,338.5 L441.3,340.2 L441.9,347.4 L443.8,352.9 L451.6,361.1 L452.6,364.3 L448.7,374.8 L444.3,376.7 L441.7,383.6 L434.0,394.5 L432.9,399.3 L433.7,404.9 L432.3,410.3 L431.1,408.4 L427.2,407.2 L424.6,408.8 L422.6,405.9 L414.1,410.4 L409.3,405.9 L408.4,403.2 L405.2,401.2 L394.3,403.1 L388.3,401.6 L390.4,398.4 L390.0,395.5 L388.5,394.0 L389.2,382.2 L393.8,376.2 L393.1,373.5 Z", cx: 421.3, cy: 371.3 },
  { d: "M165.0,191.7 L165.3,188.3 L170.4,185.7 L175.6,187.0 L176.4,191.3 L179.3,196.3 L182.8,197.2 L185.9,202.7 L198.2,213.2 L201.7,214.3 L204.4,218.5 L206.9,219.1 L211.3,214.4 L221.6,216.7 L231.2,225.9 L235.5,232.7 L238.4,232.6 L245.7,242.4 L237.0,255.0 L231.6,245.9 L229.0,231.6 L225.7,226.7 L216.9,220.2 L210.2,218.5 L206.1,224.6 L203.5,225.2 L196.2,220.0 L195.9,222.2 L188.6,220.5 L177.2,222.4 L174.2,220.7 L162.7,212.3 L163.6,207.2 L166.3,205.0 L162.1,196.9 L164.7,195.3 L171.4,197.0 L165.0,191.7 Z", cx: 196.4, cy: 216.6 },
  { d: "M231.0,116.8 L236.5,124.6 L246.5,127.9 L225.9,167.4 L225.1,177.6 L229.9,186.8 L221.0,193.0 L246.3,228.1 L238.4,232.6 L235.5,232.7 L225.2,219.3 L219.9,216.0 L211.3,214.4 L206.9,219.1 L204.4,218.5 L201.7,214.3 L198.2,213.2 L185.9,202.7 L182.8,197.2 L179.3,196.3 L176.4,191.3 L175.6,187.0 L170.4,185.7 L165.3,188.3 L164.9,191.8 L163.1,189.7 L157.1,188.1 L157.2,186.4 L159.9,185.4 L159.4,179.1 L161.4,177.2 L155.3,171.7 L139.9,172.5 L135.1,170.2 L133.6,168.9 L132.8,164.4 L130.1,161.3 L121.3,160.3 L110.6,149.0 L108.7,155.4 L99.0,153.7 L94.3,156.8 L100.7,161.2 L107.2,172.0 L103.9,172.5 L103.4,167.7 L101.4,165.8 L90.6,162.6 L86.8,165.8 L87.8,169.4 L86.1,173.7 L84.0,175.3 L84.8,177.0 L76.7,179.0 L68.4,178.3 L62.3,182.6 L59.1,188.1 L54.3,190.8 L53.3,192.1 L53.6,202.3 L55.4,206.5 L55.7,210.8 L57.6,214.1 L60.7,215.4 L56.0,220.3 L20.0,217.6 L20.0,46.0 L109.4,20.0 L110.6,20.5 L109.2,27.0 L104.6,32.4 L103.0,39.9 L97.8,52.1 L98.3,56.9 L101.2,64.5 L98.3,68.2 L99.1,72.5 L104.6,71.9 L108.4,66.1 L109.7,56.6 L111.9,54.5 L109.9,49.9 L110.6,46.5 L109.1,45.6 L113.9,39.9 L112.0,31.9 L113.2,25.5 L114.9,23.3 L145.3,42.5 L198.2,79.5 L200.7,84.8 L231.0,116.8 Z", cx: 119.1, cy: 120.8 },
];

const MAP_VIEWBOX = "0 0 640 430.4";

/* Real choropleth map — actual region borders, hoverable, linked to the legend below */
function UzbekistanMap({ regions }: { regions: readonly string[] }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="yq-map-wrap">
      <svg className="yq-map-svg" viewBox={MAP_VIEWBOX} xmlns="http://www.w3.org/2000/svg">
        {REGION_PATHS.map((r, i) => (
          <path
            key={i}
            d={r.d}
            className={"yq-map-region" + (active === i ? " active" : "")}
            style={{ animationDelay: `${i * 90}ms, ${1.8 + i * 0.06}s` }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(a => (a === i ? null : a))}
          />
        ))}
        {REGION_PATHS.map((r, i) => (
          <g key={"dot-" + i} className="yq-map-dot-wrap" style={{ animationDelay: `${1.6 + i * 0.09}s` }}>
            <circle className="yq-map-dot-pulse" cx={r.cx} cy={r.cy} style={{ animationDelay: `${i * 0.22}s` }} />
            <circle className="yq-map-dot" cx={r.cx} cy={r.cy} r={active === i ? 3.2 : 2} />
          </g>
        ))}
      </svg>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 22, justifyContent: "center" }}>
        {regions.map((r, i) => (
          <span
            key={i}
            className={"yq-map-chip" + (active === i ? " active" : "")}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(a => (a === i ? null : a))}
          >
            <i />{r}
          </span>
        ))}
      </div>
    </div>
  );
}

export function HomePage() {
  const { t } = useLang();

  const metrics = [
    { number: t.stat0val, label: t.stat0lbl },
    { number: t.stat1val, label: t.stat1lbl },
    { number: t.stat2val, label: t.stat2lbl },
  ];

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <ForestCanvas />
      <Spotlight />

      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 75% 60% at 10% 25%, rgba(34,197,94,0.1) 0%, transparent 60%), radial-gradient(ellipse 55% 50% at 88% 75%, rgba(16,185,129,0.06) 0%, transparent 58%)",
      }} />

      {/* ── HERO ── */}
      <section className="yq-hero" style={{ position: "relative", zIndex: 2 }}>
        <div className="yq-hero-grid">
          <div>
            <h1 className="hw yq-fade-1">{t.heroLine1} {t.heroLine2}</h1>
            <h1 className="hw yq-fade-1 hw-accent">{t.heroLine3} {t.heroLine4} {t.heroLine5}</h1>

            <div className="yq-fade-2" style={{ marginTop: "1.5rem", maxWidth: 500 }}>
              <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-sans)", fontSize: "1.02rem", lineHeight: 1.72, margin: 0 }}>{t.heroSub}</p>
            </div>

            <div className="yq-fade-3" style={{ marginTop: "2.2rem" }}>
              <MagneticLink to="/login" className="yq-btn-primary">
                {t.btnRegister}
                <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden="true">
                  <path d="M1 6H13M13 6L8 1M13 6L8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </MagneticLink>
            </div>

            <div className="yq-metrics yq-fade-4">
              {metrics.map((m, i) => (
                <div className="yq-metric-card" key={i}>
                  <span className="yq-metric-number"><Counter target={m.number} /></span>
                  <span className="yq-metric-label">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="yq-logo-col">
            <AnimatedLogo />
          </div>
        </div>

        <div className="yq-scroll-cue">
          <span>Scroll</span>
          <div className="yq-scroll-pill"><i /></div>
        </div>
      </section>

      {/* ── ACTIVITY TICKER — the 6 real activity types from the project brief ── */}
      <div className="yq-ticker-wrap">
        <div className="yq-ticker-track">
          {[0, 1].map(rep => (
            <div key={rep} style={{ display: "flex" }}>
              {t.homeCommittees.map((a, i) => <div className="yq-ticker-item" key={i}>{a.name}<div className="yq-ticker-dot" /></div>)}
            </div>
          ))}
        </div>
      </div>

      {/* ── MAP — where we are, all 14 regions ── */}
      <section className="yq-what">
        <FadeIn>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <span style={{ width: 28, height: 1.5, background: "var(--green)", borderRadius: 2, display: "inline-block" }} />
            <span style={{ fontFamily: "var(--font-label)", fontSize: 10, fontWeight: 800, letterSpacing: ".24em", textTransform: "uppercase", color: "var(--green)" }}>{t.mapLabel}</span>
          </div>
          <h2 className="hw" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", marginBottom: 16 }}>{t.mapTitle}</h2>
          <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-sans)", fontSize: 15.5, lineHeight: 1.8, maxWidth: 640, margin: "0 0 32px" }}>{t.mapBody}</p>
        </FadeIn>
        <FadeIn>
          <UzbekistanMap regions={t.mapRegions} />
        </FadeIn>
      </section>

      {/* ── QUOTE ── */}
      <section style={{ position: "relative", zIndex: 2, padding: "clamp(2rem,5vw,3.5rem) clamp(1.5rem,5vw,4rem)", maxWidth: 1280, margin: "0 auto" }}>
        <FadeIn>
          <QuoteBlock quote={t.quote} author={t.quoteAuthor} />
        </FadeIn>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ position: "relative", zIndex: 2, padding: "clamp(3.5rem,7vw,6rem) clamp(1.5rem,5vw,4rem) clamp(5rem,9vw,8rem)", maxWidth: 1280, margin: "0 auto", textAlign: "center" }}>
        <FadeIn>
          <h2 className="hw" style={{ fontSize: "clamp(1.9rem,4.6vw,3.6rem)", marginBottom: "1.2rem" }}>
            {t.ctaTitle1}<br /><span className="hw-accent">{t.ctaTitle2}</span>
          </h2>
          <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-sans)", fontSize: "1rem", maxWidth: 440, margin: "0 auto 2rem", lineHeight: 1.7 }}>{t.ctaSub}</p>
          <MagneticLink to="/login" className="yq-btn-primary">
            {t.btnRegister}
            <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden="true">
              <path d="M1 6H13M13 6L8 1M13 6L8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </MagneticLink>
        </FadeIn>
      </section>
    </>
  );
}

export default HomePage;