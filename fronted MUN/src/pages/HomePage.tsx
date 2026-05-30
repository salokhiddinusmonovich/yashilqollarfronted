import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logoImg from "./photo_2025-10-08_22-18-51.jpg";
import { useLang } from "../contexts/LanguageContext";

/* ─────────────────────────────────────────
   GLOBAL CSS  — animations + layout
───────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:wght@700;900&family=Inter:wght@400;500&display=swap');

/* ── keyframes ── */
@keyframes yq-fadeUp      {from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
@keyframes yq-fadeIn      {from{opacity:0}to{opacity:1}}
@keyframes yq-introOut    {0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.08)}}
@keyframes yq-logoIn      {from{opacity:0;transform:scale(0.5) rotate(-8deg)}to{opacity:1;transform:scale(1) rotate(0deg)}}
@keyframes yq-pulse       {0%,100%{opacity:1}50%{opacity:0.25}}
@keyframes yq-float       {0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes yq-glow        {0%,100%{filter:drop-shadow(0 0 14px rgba(16,185,129,.55))}50%{filter:drop-shadow(0 0 34px rgba(16,185,129,1))}}
@keyframes yq-spin-slow   {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes yq-spin-rev    {from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
@keyframes yq-introBar    {from{width:0}to{width:130px}}
@keyframes yq-ringPulse   {0%,100%{opacity:.1}50%{opacity:.28}}
@keyframes yq-ticker      {0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes yq-gradShift   {0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes yq-borderGlow  {0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0)}50%{box-shadow:0 0 32px 4px rgba(16,185,129,.18)}}
@keyframes yq-countUp     {from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes yq-slideInLeft {from{opacity:0;transform:translateX(-50px)}to{opacity:1;transform:translateX(0)}}
@keyframes yq-slideInRight{from{opacity:0;transform:translateX(50px)}to{opacity:1;transform:translateX(0)}}
@keyframes yq-scaleIn     {from{opacity:0;transform:scale(0.88)}to{opacity:1;transform:scale(1)}}
@keyframes yq-orb1        {0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(60px,-40px) scale(1.1)}66%{transform:translate(-40px,30px) scale(0.95)}}
@keyframes yq-orb2        {0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-50px,50px) scale(0.9)}66%{transform:translate(40px,-30px) scale(1.08)}}
@keyframes yq-shimmer     {0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes yq-cardIn      {from{opacity:0;transform:translateY(30px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}

/* ── intro ── */
.yq-intro{position:fixed;inset:0;z-index:9999;background:#020202;display:flex;flex-direction:column;align-items:center;justify-content:center;animation:yq-fadeIn .2s ease}
.yq-intro.out{animation:yq-introOut .7s cubic-bezier(.4,0,.6,1) forwards}
.yq-intro-logo{animation:yq-logoIn .9s cubic-bezier(.22,1,.36,1) .1s both}
.yq-intro-label{animation:yq-fadeUp .7s ease .85s both}
.yq-intro-bar{width:0;height:2px;background:linear-gradient(90deg,#10b981,#34d399);border-radius:2px;margin-top:36px;animation:yq-introBar 1.8s cubic-bezier(.4,0,.2,1) .4s both}

/* ── hero text ── */
.hw{display:block;font-family:'Anton',sans-serif;line-height:.88;text-transform:uppercase;letter-spacing:-.02em;color:#fff}
.hw-em{background:linear-gradient(135deg,#10b981,#34d399,#6ee7b7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:200% 200%;animation:yq-gradShift 4s ease infinite}
.hw:nth-child(1){animation:yq-fadeUp .9s cubic-bezier(.22,1,.36,1) .05s both}
.hw:nth-child(2){animation:yq-fadeUp .9s cubic-bezier(.22,1,.36,1) .18s both}
.hw:nth-child(3){animation:yq-fadeUp .9s cubic-bezier(.22,1,.36,1) .31s both}
.yq-sub{animation:yq-fadeUp .75s ease .5s both}
.yq-btns{animation:yq-fadeUp .75s ease .62s both}
.yq-stats{animation:yq-fadeUp .75s ease .74s both}
.yq-logo-anim{animation:yq-fadeIn 1.1s ease .25s both,yq-float 5s ease-in-out 1.4s infinite,yq-glow 3.5s ease-in-out 1.4s infinite}
.yq-dot{animation:yq-pulse 2s ease-in-out infinite}

/* ── rings ── */
.yq-ring-a{position:absolute;border-radius:50%;border:1.5px solid rgba(16,185,129,.25);animation:yq-spin-slow 12s linear infinite}
.yq-ring-b{position:absolute;border-radius:50%;border:1px dashed rgba(16,185,129,.15);animation:yq-spin-rev 20s linear infinite}
.yq-ring-c{position:absolute;border-radius:50%;border:1px solid rgba(16,185,129,.07);animation:yq-ringPulse 5s ease-in-out infinite}
.yq-orbit-dot{position:absolute;width:8px;height:8px;background:#10b981;border-radius:50%;box-shadow:0 0 12px #10b981,0 0 24px rgba(16,185,129,.6)}

/* ── buttons ── */
.yq-btn-primary{background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:800;letter-spacing:1.6px;text-transform:uppercase;padding:15px 30px;border-radius:12px;display:inline-flex;align-items:center;gap:8px;text-decoration:none;cursor:pointer;transition:all .25s;white-space:nowrap;position:relative;overflow:hidden}
.yq-btn-primary::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.15),transparent);opacity:0;transition:opacity .2s}
.yq-btn-primary:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(16,185,129,.4)}
.yq-btn-primary:hover::before{opacity:1}
.yq-btn-ghost{background:transparent;color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.15);font-family:'Montserrat',sans-serif;font-size:11px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;padding:15px 30px;border-radius:12px;display:inline-flex;align-items:center;gap:8px;text-decoration:none;cursor:pointer;transition:all .25s;white-space:nowrap;backdrop-filter:blur(8px)}
.yq-btn-ghost:hover{border-color:rgba(16,185,129,.6);color:#fff;transform:translateY(-3px);background:rgba(16,185,129,.06)}
.yq-btn-emerald{background:transparent;color:#10b981;border:1.5px solid rgba(16,185,129,.4);font-family:'Montserrat',sans-serif;font-size:11px;font-weight:800;letter-spacing:1.6px;text-transform:uppercase;padding:16px 40px;border-radius:12px;display:inline-flex;align-items:center;gap:8px;text-decoration:none;cursor:pointer;transition:all .25s;animation:yq-borderGlow 3s ease-in-out infinite}
.yq-btn-emerald:hover{background:rgba(16,185,129,.1);border-color:#10b981;transform:translateY(-2px);box-shadow:0 8px 32px rgba(16,185,129,.2)}

/* ── stat pills ── */
.yq-stat-pill{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px 20px;display:inline-flex;flex-direction:column;align-items:center;transition:all .25s;cursor:default;position:relative;overflow:hidden}
.yq-stat-pill::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(16,185,129,.06),transparent);opacity:0;transition:opacity .25s}
.yq-stat-pill:hover{border-color:rgba(16,185,129,.35);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.3)}
.yq-stat-pill:hover::after{opacity:1}

/* ── ticker ── */
.yq-ticker-wrapper{overflow:hidden;background:#0a0a0a;border-top:1px solid rgba(16,185,129,.08);border-bottom:1px solid rgba(16,185,129,.08);padding:14px 0;position:relative}
.yq-ticker-wrapper::before,.yq-ticker-wrapper::after{content:'';position:absolute;top:0;bottom:0;width:80px;z-index:2}
.yq-ticker-wrapper::before{left:0;background:linear-gradient(90deg,#0a0a0a,transparent)}
.yq-ticker-wrapper::after{right:0;background:linear-gradient(270deg,#0a0a0a,transparent)}
.yq-ticker-track{display:flex;width:max-content;animation:yq-ticker 28s linear infinite}
.yq-ticker-track:hover{animation-play-state:paused}
.yq-ticker-item{display:flex;align-items:center;gap:10px;padding:0 28px;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.35);white-space:nowrap;transition:color .2s}
.yq-ticker-item:hover{color:rgba(16,185,129,.8)}
.yq-ticker-dot{width:5px;height:5px;border-radius:50%;background:#10b981;opacity:.5;flex-shrink:0}

/* ── layout ── */
.yq-hero-grid{display:grid;grid-template-columns:1fr 1fr;align-items:center;width:100%;padding:0 clamp(1.5rem,5vw,5rem);gap:2rem}

/* ── committee cards ── */
.committee-card{position:relative;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.06);border-radius:24px;padding:40px;overflow:hidden;transition:all .3s cubic-bezier(.22,1,.36,1);cursor:default}
.committee-card:hover{border-color:rgba(16,185,129,.35);background:rgba(16,185,129,.04);transform:translateY(-6px);box-shadow:0 24px 60px rgba(0,0,0,.5),0 0 40px rgba(16,185,129,.06)}
.committee-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#10b981,transparent);opacity:0;transition:opacity .3s}
.committee-card:hover::before{opacity:1}

/* ── badge ── */
.badge{font-family:'Montserrat',sans-serif;font-size:9px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;padding:4px 10px;border-radius:6px;border:1px solid;cursor:default}
.badge-beginner{color:#22c55e;border-color:rgba(34,197,94,.35);background:rgba(34,197,94,.1)}
.badge-intermediate{color:#f59e0b;border-color:rgba(245,158,11,.35);background:rgba(245,158,11,.1)}
.badge-advanced{color:#f97316;border-color:rgba(249,115,22,.35);background:rgba(249,115,22,.1)}

/* ── scroll reveal ── */
.yq-reveal{opacity:0;transform:translateY(32px);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1)}
.yq-reveal.visible{opacity:1;transform:translateY(0)}
.yq-reveal-left{opacity:0;transform:translateX(-40px);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1)}
.yq-reveal-left.visible{opacity:1;transform:translateX(0)}
.yq-reveal-scale{opacity:0;transform:scale(0.92);transition:opacity .7s ease,transform .7s ease}
.yq-reveal-scale.visible{opacity:1;transform:scale(1)}

/* ── arena grid ── */
.arena-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.25rem}

/* ── responsive ── */
@media(max-width:1024px){.arena-grid{grid-template-columns:1fr 1fr}}
@media(max-width:768px){
  .yq-hero-grid{grid-template-columns:1fr;padding:0 1.25rem;gap:0}
  .yq-logo-col{order:-1;display:flex;justify-content:center;padding:1.5rem 0}
  .yq-btns{flex-direction:column}
  .yq-btns a{justify-content:center;width:100%;box-sizing:border-box}
  .yq-cta-btns{flex-direction:column!important;align-items:stretch!important}
  .yq-cta-btns a{justify-content:center}
  .hw{font-size:clamp(2.4rem,11vw,4.5rem)!important;word-break:break-word}
  .arena-grid{grid-template-columns:1fr}
}
@media(max-width:400px){.hw{font-size:clamp(2rem,10vw,3rem)!important}}
`;

/* ─────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".yq-reveal, .yq-reveal-left, .yq-reveal-scale");
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); } }),
      { threshold: 0.12 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────── */
function AnimCounter({ target }: { target: string }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const num = parseInt(target.replace(/\D/g, ""), 10);
    const suffix = target.replace(/[0-9]/g, "");
    if (!num) { setDisplay(target); return; }
    let start = 0;
    const duration = 1400;
    const step = (timestamp: number, startTime: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(ease * num) + suffix);
      if (progress < 1) requestAnimationFrame(ts => step(ts, startTime));
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { requestAnimationFrame(ts => step(ts, ts)); io.disconnect(); }
    }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [target]);
  return <span ref={ref}>{display}</span>;
}

/* ─────────────────────────────────────────
   LOGO CIRCLE
───────────────────────────────────────── */
const LogoCircle = ({ size }: { size: number }) => (
  <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div className="yq-ring-c" style={{ width: size * 2.1, height: size * 2.1 }} />
    <div className="yq-ring-b" style={{ width: size * 1.65, height: size * 1.65 }} />
    <div className="yq-ring-a" style={{ width: size * 1.32, height: size * 1.32 }} />
    {/* orbit dots */}
    <div style={{ position: "absolute", width: size * 1.32, height: size * 1.32, animation: "yq-spin-slow 12s linear infinite", display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
      <div className="yq-orbit-dot" style={{ marginTop: "-4px" }} />
    </div>
    <div style={{ position: "absolute", width: size * 1.65, height: size * 1.65, animation: "yq-spin-rev 20s linear infinite", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div className="yq-orbit-dot" style={{ marginBottom: "-4px", width: 5, height: 5 }} />
    </div>
    <div style={{ position: "absolute", width: size * 1.65, height: size * 1.65, animation: "yq-spin-slow 18s linear infinite 6s", display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
      <div className="yq-orbit-dot" style={{ marginLeft: "-4px", width: 4, height: 4, opacity: 0.5 }} />
    </div>
    {/* logo */}
    <div style={{ position: "relative", zIndex: 2, width: size, height: size, borderRadius: "50%", border: "2px solid rgba(16,185,129,0.45)", backgroundColor: "#f0ede6", backgroundImage: `url(${logoImg})`, backgroundSize: "82%", backgroundPosition: "center", backgroundRepeat: "no-repeat", boxShadow: "0 0 0 8px rgba(16,185,129,0.04), 0 0 0 16px rgba(16,185,129,0.02)" }} />
  </div>
);

/* ─────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────── */
export const HomePage = () => {
  const { t } = useLang();
  const [introVisible, setIntroVisible] = useState(true);
  const [introOut, setIntroOut] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useReveal();

  /* inject CSS */
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    const t1 = setTimeout(() => setIntroOut(true), 2200);
    const t2 = setTimeout(() => setIntroVisible(false), 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); document.head.removeChild(el); };
  }, []);

  /* mouse parallax */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* particle canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    type Dot = { x: number; y: number; vx: number; vy: number; r: number; opacity: number };
    const dots: Dot[] = Array.from({ length: 75 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.6 + 0.6,
      opacity: Math.random() * 0.4 + 0.2,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x * canvas.width;
      const my = mouseRef.current.y * canvas.height;
      for (const d of dots) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
      }
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(16,185,129,${0.15 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
        /* mouse attraction line */
        const mdx = dots[i].x - mx, mdy = dots[i].y - my;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 180) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(16,185,129,${0.25 * (1 - mdist / 180)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(mx, my);
          ctx.stroke();
        }
      }
      for (const d of dots) {
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16,185,129,${d.opacity})`; ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  const stats = [
    { value: t.stat0val ?? "250+", label: t.stat0lbl ?? "DELEGATES" },
    { value: t.stat1val ?? "15+", label: t.stat1lbl ?? "COUNTRIES" },
    { value: t.stat2val ?? "4", label: t.stat2lbl ?? "COMMITTEES" },
    { value: t.stat3val ?? "1", label: t.stat3lbl ?? "DAY" },
  ];

  const tickerItems = [
    "Public Speaking", "Diplomacy", "Critical Thinking", "International Experience",
    "Expert Guidance", "250+ Delegates", "15+ Countries", "4 Committees", "Networking", "Leadership Skills",
  ];

  return (
    <>
      {/* ── INTRO ── */}
      {introVisible && (
        <div className={`yq-intro${introOut ? " out" : ""}`} aria-hidden="true">
          <div className="yq-intro-logo" style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", width: 160, height: 160, borderRadius: "50%", border: "1.5px solid rgba(16,185,129,.5)", animation: "yq-spin-slow 8s linear infinite" }} />
            <div style={{ position: "absolute", width: 190, height: 190, borderRadius: "50%", border: "1px dashed rgba(16,185,129,.25)", animation: "yq-spin-rev 13s linear infinite" }} />
            <div style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", border: "1px solid rgba(16,185,129,.08)", animation: "yq-ringPulse 3s ease-in-out infinite" }} />
            <div style={{
              width: 120, height: 120, borderRadius: "50%",
              border: "2.5px solid rgba(16,185,129,0.6)",
              boxShadow: "0 0 40px rgba(16,185,129,.8), 0 0 80px rgba(16,185,129,.3), inset 0 0 20px rgba(16,185,129,.05)",
              backgroundColor: "#f0ede6",
              backgroundImage: `url(${logoImg})`,
              backgroundSize: "82%", backgroundPosition: "center", backgroundRepeat: "no-repeat",
            }} />
          </div>
          <div className="yq-intro-label" style={{ textAlign: "center", marginTop: "8rem", padding: "0 1.25rem" }}>
            <div style={{ fontFamily: "'Anton',sans-serif", fontSize: "clamp(1.6rem,5.5vw,3rem)", color: "#fff", letterSpacing: ".08em", textTransform: "uppercase", lineHeight: 1 }}>
              Yashil Qo'llar
            </div>
            <div style={{ fontFamily: "'Anton',sans-serif", fontSize: "clamp(1.6rem,5.5vw,3rem)", background: "linear-gradient(135deg,#10b981,#34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: ".08em", textTransform: "uppercase", lineHeight: 1, marginTop: "4px" }}>
              MUN 2026
            </div>
          </div>
          <div className="yq-intro-bar" />
        </div>
      )}

      <main style={{ background: "#050505", minHeight: "100vh" }}>

        {/* ── HERO ── */}
        <section style={{ position: "relative", overflow: "hidden", paddingTop: "clamp(5rem,12vw,9rem)", paddingBottom: "4rem", minHeight: "95vh", display: "flex", alignItems: "center" }}>
          {/* Canvas */}
          <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }} />

          {/* Background orbs */}
          <div style={{ position: "absolute", top: "15%", left: "10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(16,185,129,.07) 0%,transparent 70%)", pointerEvents: "none", zIndex: 2, animation: "yq-orb1 18s ease-in-out infinite" }} />
          <div style={{ position: "absolute", top: "40%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(16,185,129,.05) 0%,transparent 70%)", pointerEvents: "none", zIndex: 2, animation: "yq-orb2 22s ease-in-out infinite" }} />

          {/* Grid */}
          <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", backgroundImage: `linear-gradient(rgba(16,185,129,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,.025) 1px,transparent 1px)`, backgroundSize: "72px 72px" }} />
          {/* Vignette */}
          <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "radial-gradient(ellipse 80% 70% at 50% 50%,transparent 40%,rgba(5,5,5,.8) 100%)" }} />

          <div className="yq-hero-grid" style={{ position: "relative", zIndex: 3 }}>
            {/* TEXT */}
            <div>
              <div className="yq-sub" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.75rem" }}>
                <span className="yq-dot" style={{ display: "inline-block", width: 9, height: 9, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 12px #10b981" }} />
                <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,.45)" }}>
                  {t.dateTag ?? "Tashkent · May 31, 2026"}
                </span>
              </div>

              <h1 style={{ margin: 0, padding: 0 }}>
                <span className="hw" style={{ fontSize: "clamp(2.8rem,7.5vw,7.5rem)" }}>
                  {t.heroLine1 ?? "WHERE"} {t.heroLine2 ?? "FUTURE"}
                </span>
                <span className="hw" style={{ fontSize: "clamp(2.8rem,7.5vw,7.5rem)", marginTop: "4px" }}>
                  {t.heroLine3 ?? "LEADERS"} {t.heroLine4 ?? "ARE"}
                </span>
                <span className="hw hw-em" style={{ fontSize: "clamp(2.8rem,7.5vw,7.5rem)", marginTop: "4px" }}>
                  {t.heroLine5 ?? "BORN."}
                </span>
              </h1>

              <div className="yq-sub" style={{ marginTop: "1.75rem" }}>
                <p style={{ fontFamily: "'Inter',sans-serif", color: "rgba(255,255,255,.42)", fontSize: "clamp(.9rem,1.4vw,1.05rem)", lineHeight: 1.8, maxWidth: "500px", margin: 0 }}>
                  {t.heroSub ?? "A premier youth-led Model United Nations conference — where future diplomats are shaped."}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "9px", marginTop: "16px" }}>
                  <span className="yq-dot" style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#10b981" }} />
                  <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "10px", fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "#10b981" }}>
                    {t.heroBadge ?? "Registration Open"}
                  </span>
                </div>
              </div>

              <div className="yq-btns" style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "2rem" }}>
                <Link to="/registration" className="yq-btn-primary">
                  {t.btnRegister ?? "Register Now"}
                  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
                <Link to="/committees" className="yq-btn-ghost">
                  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {t.btnCommittees ?? "View Committees"}
                </Link>
              </div>

              {/* Stats */}
              <div className="yq-stats" style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "2rem" }}>
                {stats.map((s, i) => (
                  <div key={i} className="yq-stat-pill">
                    <span style={{ fontFamily: "'Anton',sans-serif", fontSize: "24px", color: "#fff", lineHeight: 1 }}>
                      <AnimCounter target={s.value} />
                    </span>
                    <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "8px", fontWeight: 800, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(16,185,129,.7)", marginTop: "5px" }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* LOGO */}
            <div className="yq-logo-anim yq-logo-col" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LogoCircle size={280} />
            </div>
          </div>

          {/* Scroll hint */}
          <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 4, animation: "yq-pulse 2.5s ease-in-out infinite" }}>
            <span style={{ fontSize: 9, fontFamily: "'Montserrat',sans-serif", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,.2)" }}>scroll</span>
            <svg width="20" height="20" fill="none" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </section>

        {/* ── TICKER 1 ── */}
        <div className="yq-ticker-wrapper">
          <div className="yq-ticker-track">
            {[...tickerItems, ...tickerItems].map((text, idx) => (
              <div key={idx} className="yq-ticker-item">
                <div className="yq-ticker-dot" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* ── COMMITTEES ── */}
        <section style={{ padding: "7rem clamp(1.25rem,5vw,4rem)", background: "#050505", position: "relative", overflow: "hidden" }}>
          {/* bg orb */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(16,185,129,.04) 0%,transparent 70%)", pointerEvents: "none" }} />

          <div style={{ maxWidth: "74rem", margin: "0 auto", position: "relative" }}>
            {/* Heading */}
            <div className="yq-reveal" style={{ textAlign: "center", marginBottom: "4.5rem" }}>
              <div style={{ color: "#10b981", fontSize: "10px", fontWeight: 800, letterSpacing: "4px", textTransform: "uppercase", marginBottom: "1rem", fontFamily: "'Montserrat',sans-serif" }}>
                02 — {t.councilsLabel ?? "Conference Councils"}
              </div>
              <h2 style={{ fontFamily: "'Anton',sans-serif", fontSize: "clamp(2.2rem,5.5vw,4.5rem)", color: "#fff", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 12px" }}>
                CHOOSE YOUR <span style={{ background: "linear-gradient(135deg,#10b981,#34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ARENA</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,.38)", fontSize: "1rem", fontFamily: "'Inter',sans-serif", maxWidth: 480, margin: "0 auto" }}>
                4 committees spanning diplomacy, security, health and economics
              </p>
            </div>

            {/* Grid */}
            <div className="arena-grid">
              {t.committees && t.committees.slice(0, 4).map((c: any, i: number) => (
                <div key={i} className={`committee-card yq-reveal`} style={{ transitionDelay: `${i * 0.1}s` }}>
                  {/* Ghost code watermark */}
                  <div style={{ position: "absolute", right: "-8px", bottom: "8px", fontSize: "130px", fontWeight: 900, color: "rgba(255,255,255,.018)", pointerEvents: "none", zIndex: 0, fontFamily: "'Anton',sans-serif", lineHeight: 1 }}>
                    {c.code}
                  </div>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
                      <span style={{ color: "#10b981", fontFamily: "'Anton',sans-serif", fontSize: "2rem" }}>{c.code}</span>
                      <div style={{ display: "flex", gap: 6 }}>
                        <span className={`badge badge-${c.level?.toLowerCase() ?? "beginner"}`}>{c.level ?? "Beginner"}</span>
                        <span className="badge" style={{ color: "rgba(255,255,255,.4)", borderColor: "rgba(255,255,255,.1)", background: "rgba(255,255,255,.04)" }}>SOLO</span>
                      </div>
                    </div>
                    <h3 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#fff", textTransform: "uppercase", marginBottom: "12px", fontFamily: "'Montserrat',sans-serif", lineHeight: 1.2 }}>
                      {c.name}
                    </h3>
                    <div style={{ width: 32, height: 2, background: "linear-gradient(90deg,#10b981,transparent)", borderRadius: 2, marginBottom: "14px" }} />
                    <p style={{ color: "rgba(255,255,255,.42)", fontSize: ".9rem", lineHeight: "1.65", fontFamily: "'Inter',sans-serif" }}>
                      {c.topic ?? "Discussion will focus on international security measures."}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* View all */}
            <div className="yq-reveal" style={{ textAlign: "center", marginTop: "4.5rem" }}>
              <Link to="/committees" className="yq-btn-emerald">
                VIEW ALL COMMITTEES
                <span style={{ marginLeft: 8 }}>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── TICKER 2 ── */}
        <div className="yq-ticker-wrapper">
          <div className="yq-ticker-track" style={{ animationDirection: "reverse" }}>
            {[...tickerItems, ...tickerItems].map((text, idx) => (
              <div key={idx} className="yq-ticker-item">
                <div className="yq-ticker-dot" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <section style={{ padding: "8rem clamp(1.25rem,5vw,5rem)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 50% 50%,rgba(16,185,129,.07) 0%,transparent 70%)", pointerEvents: "none" }} />
          {/* Animated rings behind logo */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", border: "1px solid rgba(16,185,129,.06)", animation: "yq-spin-slow 30s linear infinite", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 400, height: 400, borderRadius: "50%", border: "1px dashed rgba(16,185,129,.05)", animation: "yq-spin-rev 22s linear infinite", pointerEvents: "none" }} />

          <div className="yq-reveal" style={{ position: "relative", zIndex: 10, maxWidth: "54rem", margin: "0 auto", textAlign: "center" }}>
            <div style={{ marginBottom: "28px", display: "flex", justifyContent: "center" }}>
              <div className="yq-logo-anim"><LogoCircle size={80} /></div>
            </div>
            <h2 style={{ fontFamily: "'Anton',sans-serif", fontSize: "clamp(2.2rem,7vw,5.5rem)", color: "#fff", textTransform: "uppercase", lineHeight: .9, margin: "0 0 28px" }}>
              {t.ctaTitle1 ?? "READY TO"}{" "}
              <span style={{ background: "linear-gradient(135deg,#10b981,#34d399,#6ee7b7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200%", animation: "yq-gradShift 4s ease infinite" }}>
                {t.ctaTitle2 ?? "LEAD?"}
              </span>
            </h2>
            <p style={{ fontFamily: "'Inter',sans-serif", color: "rgba(255,255,255,.42)", fontSize: "clamp(.9rem,1.5vw,1.05rem)", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 480, margin: "0 auto 2.5rem" }}>
              {t.ctaSub ?? "Join 250+ delegates from 15+ countries for one day of diplomacy, debate, and discovery."}
            </p>
            <div className="yq-cta-btns" style={{ display: "flex", flexWrap: "wrap", gap: "14px", justifyContent: "center" }}>
              <Link to="/registration" className="yq-btn-primary" style={{ padding: "17px 44px", fontSize: "12px" }}>
                {t.btnRegister ?? "Register Now"}
              </Link>
              <Link to="/contact" className="yq-btn-ghost" style={{ padding: "17px 44px", fontSize: "12px" }}>
                {t.btnContact ?? "Contact Us"}
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
};
