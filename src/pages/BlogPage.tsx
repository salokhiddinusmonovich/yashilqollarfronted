import { useState, useEffect, useRef } from "react";
import { ENDPOINTS, baseHeaders, fixMediaUrl } from "../config/api";
import { useAuth } from "../contexts/AuthContext";

const GREEN = "#22C55E";
const DARK = "#060606";

/* ─────────────────────────────────────────
   ТИПЫ — соответствуют ArticleListSerializer / ArticleDetailSerializer
───────────────────────────────────────── */
interface Tag { id: number; name: string; slug: string; }
interface CommentNode {
  id: number; user_name: string; text: string; likes_count: number; created_at: string; replies: CommentNode[];
}
interface ArticleListItem {
  id: number; title: string; slug: string; cover_image: string | null; tags: Tag[];
  read_time_minutes: number; likes_count: number; comments_count: number; created_at: string; is_featured: boolean;
  author_name: string; author_role: string | null; author_photo: string | null; has_video: boolean;
}
interface GalleryImage { id: number; image: string; }
interface ArticleDetail {
  id: number; title: string; slug: string; cover_image: string | null; content: string;
  author_name: string; author_role: string | null; author_photo: string | null; tags: Tag[]; read_time_minutes: number;
  likes_count: number; created_at: string; comments: CommentNode[];
  video: string | null; video_url: string | null; gallery_images: GalleryImage[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function getAccessToken() { return localStorage.getItem("yq_access_token"); }
function authHeaders() {
  const token = getAccessToken();
  return token ? baseHeaders("en", { Authorization: `Bearer ${token}` }) : baseHeaders("en");
}

/** Достаёт YouTube video ID из обычной ссылки для embed */
function youtubeEmbedUrl(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

/* ─────────────────────────────────────────
   ФОНОВЫЙ CANVAS
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
      for (let i = 0; i < 80; i++) nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45, r: Math.random() * 2 + .5, a: Math.random() * .65 + .2, pulse: Math.random() * Math.PI * 2, ps: Math.random() * .028 + .01 });
      for (let i = 0; i < 22; i++) leaves.push({ x: Math.random() * w, y: Math.random() * h + h, vx: (Math.random() - .5) * .65, vy: -(Math.random() * .85 + .28), size: Math.random() * 11 + 5, rot: Math.random() * Math.PI * 2, vrot: (Math.random() - .5) * .022, a: Math.random() * .36 + .12, wobble: Math.random() * Math.PI * 2, ws: Math.random() * .022 + .008, hue: Math.random() * 30 });
    };
    const drawLeaf = (x: number, y: number, size: number, rot: number, alpha: number, hue: number) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha; ctx.beginPath(); ctx.moveTo(0, -size); ctx.bezierCurveTo(size * .7, -size * .6, size * .7, size * .5, 0, size * .35); ctx.bezierCurveTo(-size * .7, size * .5, -size * .7, -size * .6, 0, -size); const g = ctx.createLinearGradient(0, -size, 0, size * .35); g.addColorStop(0, `hsl(${142 + hue},80%,52%)`); g.addColorStop(1, `hsl(${155 + hue},72%,38%)`); ctx.fillStyle = g; ctx.fill(); ctx.beginPath(); ctx.moveTo(0, -size * .85); ctx.quadraticCurveTo(size * .08, 0, 0, size * .3); ctx.strokeStyle = "rgba(255,255,255,0.22)"; ctx.lineWidth = .85; ctx.stroke(); ctx.restore(); ctx.globalAlpha = 1; };
    let frame = 0;
    const tick = () => { frame++; ctx.clearRect(0, 0, w, h); for (let i = 0; i < nodes.length; i++)for (let j = i + 1; j < nodes.length; j++) { const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, d = Math.sqrt(dx * dx + dy * dy); if (d < 155) { ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.strokeStyle = `rgba(34,197,94,${.17 * (1 - d / 155)})`; ctx.lineWidth = .78; ctx.stroke(); } } for (const n of nodes) { n.pulse += n.ps; n.x += n.vx; n.y += n.vy; if (n.x < 0) n.x = w; if (n.x > w) n.x = 0; if (n.y < 0) n.y = h; if (n.y > h) n.y = 0; const pa = n.a * (.65 + .35 * Math.sin(n.pulse)); const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5); grd.addColorStop(0, `rgba(34,197,94,${pa * .55})`); grd.addColorStop(1, "transparent"); ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill(); ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(34,197,94,${pa})`; ctx.fill(); } for (const l of leaves) { l.wobble += l.ws; l.x += l.vx + Math.sin(l.wobble) * .5; l.y += l.vy; l.rot += l.vrot; if (l.y < -30) { l.y = h + 30; l.x = Math.random() * w; } drawLeaf(l.x, l.y, l.size, l.rot, l.a, l.hue); } id = requestAnimationFrame(tick); };
    init(); tick(); window.addEventListener("resize", init);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", init); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null); const [vis, setVis] = useState(false);
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.06 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, []);
  return <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(22px)", transition: `opacity .75s cubic-bezier(.16,1,.3,1) ${delay}ms,transform .75s cubic-bezier(.16,1,.3,1) ${delay}ms` }}>{children}</div>;
}

function Avatar({ initials, size = 32, photo }: { initials: string; size?: number; photo?: string | null }) {
  const photoUrl = fixMediaUrl(photo || null);
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * .32, fontWeight: 700, color: GREEN, flexShrink: 0, overflow: "hidden" }}>
      {photoUrl ? <img src={photoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
    </div>
  );
}

function CatBadge({ cat }: { cat: string }) {
  return <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 5, background: `${GREEN}14`, color: GREEN, border: `1px solid ${GREEN}28` }}>{cat}</span>;
}

function CoverOrPlaceholder({ cover, hasVideo, hov, title }: { cover: string | null; hasVideo: boolean; hov: boolean; title: string }) {
  if (cover) {
    return (
      <div style={{ width: "100%", height: 180, overflow: "hidden", flexShrink: 0, position: "relative" }}>
        <img src={fixMediaUrl(cover) || ""} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: hov ? "scale(1.04)" : "scale(1)", transition: "transform .4s ease" }} />
        {hasVideo && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.25)" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>▶️</div>
          </div>
        )}
      </div>
    );
  }
  if (hasVideo) {
    return (
      <div style={{ width: "100%", height: 180, flexShrink: 0, background: "linear-gradient(135deg, rgba(34,197,94,0.18), rgba(6,6,6,1))", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(34,197,94,0.15)", border: `1.5px solid ${GREEN}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>▶️</div>
      </div>
    );
  }
  return null;
}

function AuthorRow({ name, role, photo }: { name: string; role: string | null; photo?: string | null }) {
  if (!name) return null;
  const initials = name.split(" ").filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Avatar initials={initials} size={22} photo={photo} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: "rgba(255,255,255,0.6)", lineHeight: 1.2 }}>{name}</div>
        {role && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.32)" }}>{role}</div>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ГАЛЕРЕЯ ФОТО — карусель с точками и стрелками
───────────────────────────────────────── */
function PhotoGallery({ images }: { images: GalleryImage[] }) {
  const [idx, setIdx] = useState(0);
  if (images.length === 0) return null;

  const go = (dir: number) => setIdx(i => (i + dir + images.length) % images.length);

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/10", borderRadius: 14, overflow: "hidden", background: "#111" }}>
        <img src={fixMediaUrl(images[idx].image) || ""} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        {images.length > 1 && (
          <>
            <button onClick={() => go(-1)} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 34, height: 34, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", cursor: "pointer", backdropFilter: "blur(6px)" }}>‹</button>
            <button onClick={() => go(1)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 34, height: 34, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", cursor: "pointer", backdropFilter: "blur(6px)" }}>›</button>
            <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
              {images.map((_, i) => (
                <span key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 18 : 6, height: 6, borderRadius: 4, background: i === idx ? GREEN : "rgba(255,255,255,0.4)", cursor: "pointer", transition: "all .2s" }} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ВИДЕО — файл или YouTube-embed
───────────────────────────────────────── */
function ArticleVideo({ video, videoUrl }: { video: string | null; videoUrl: string | null }) {
  if (video) {
    const src = fixMediaUrl(video);
    return (
      <div style={{ marginBottom: 24, borderRadius: 14, overflow: "hidden", background: "#000" }}>
        <video src={src || ""} controls style={{ width: "100%", display: "block", maxHeight: 420 }} />
      </div>
    );
  }
  if (videoUrl) {
    const embed = youtubeEmbedUrl(videoUrl);
    if (embed) {
      return (
        <div style={{ marginBottom: 24, borderRadius: 14, overflow: "hidden", aspectRatio: "16/9" }}>
          <iframe src={embed} title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width: "100%", height: "100%", border: "none" }} />
        </div>
      );
    }
    return (
      <a href={videoUrl} target="_blank" rel="noreferrer" style={{ display: "block", marginBottom: 24, padding: "14px 18px", borderRadius: 12, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", color: GREEN, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
        ▶️ Watch video
      </a>
    );
  }
  return null;
}

/* ─────────────────────────────────────────
   КОММЕНТАРИИ — рекурсивное дерево
───────────────────────────────────────── */
function CommentItem({ comment, onLike, onReply, depth = 0 }: { comment: CommentNode; onLike: (id: number) => void; onReply: (parentId: number, text: string) => void; depth?: number }) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const submitReply = () => { if (!replyText.trim()) return; onReply(comment.id, replyText); setReplyText(""); setShowReply(false); };

  return (
    <div style={{ marginLeft: depth > 0 ? 20 : 0, borderLeft: depth > 0 ? "1px solid rgba(34,197,94,0.15)" : "none", paddingLeft: depth > 0 ? 14 : 0 }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
        <Avatar initials={comment.user_name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()} size={28} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>{comment.user_name}</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{formatDate(comment.created_at)}</span>
          </div>
          <p style={{ margin: "0 0 8px", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>{comment.text}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => onLike(comment.id)} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 600, padding: 0 }}>
              🤍 {comment.likes_count}
            </button>
            {depth < 2 && <button onClick={() => setShowReply(s => !s)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 600, padding: 0 }}>Reply</button>}
          </div>
          {showReply && (
            <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "flex-start" }}>
              <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Add a comment…" rows={2}
                style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 8, color: "#fff", fontSize: 12, padding: "8px 10px", fontFamily: "'Inter',sans-serif", outline: "none", resize: "vertical" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <button onClick={submitReply} style={{ background: GREEN, border: "none", color: "#000", padding: "6px 12px", borderRadius: 7, fontSize: 11, fontWeight: 800, cursor: "pointer" }}>Post</button>
                <button onClick={() => setShowReply(false)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", padding: "6px 12px", borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
      {comment.replies.map(r => <CommentItem key={r.id} comment={r} onLike={onLike} onReply={onReply} depth={depth + 1} />)}
    </div>
  );
}

function ReadingProgress({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [containerRef]);
  return (
    <div style={{ position: "sticky", top: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.06)", zIndex: 5 }}>
      <div style={{ height: "100%", width: `${progress}%`, background: GREEN, boxShadow: `0 0 8px ${GREEN}`, transition: "width .1s linear" }} />
    </div>
  );
}

/* ─────────────────────────────────────────
   МОДАЛКА СТАТЬИ
───────────────────────────────────────── */
function ArticleModal({ slug, onClose }: { slug: string; onClose: () => void }) {
  const { isLoggedIn } = useAuth();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [error, setError] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(ENDPOINTS.blogDetail(slug), { headers: baseHeaders("en") })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then((data: ArticleDetail) => { setArticle(data); setLikeCount(data.likes_count); })
      .catch(() => setError(true));
  }, [slug]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [onClose]);

  const handleLike = async () => {
    if (!isLoggedIn) { alert("Войди через Telegram, чтобы лайкать статьи."); return; }
    if (liked) return;
    setLiked(true); setLikeCount(c => c + 1);
    try {
      await fetch(ENDPOINTS.blogLike(slug), { method: "POST", headers: authHeaders() });
    } catch { setLiked(false); setLikeCount(c => c - 1); }
  };

  const handleLikeComment = async (id: number) => {
    if (!isLoggedIn) { alert("Войди через Telegram, чтобы лайкать комментарии."); return; }
    try { await fetch(ENDPOINTS.commentLike(id), { method: "POST", headers: authHeaders() }); } catch { }
  };

  const submitComment = async (text: string, parent: number | null = null) => {
    if (!isLoggedIn) { alert("Войди через Telegram, чтобы комментировать."); return; }
    try {
      const res = await fetch(ENDPOINTS.blogComment(slug), {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ text, parent }),
      });
      if (res.ok) {
        const refreshed = await fetch(ENDPOINTS.blogDetail(slug), { headers: baseHeaders("en") });
        if (refreshed.ok) setArticle(await refreshed.json());
        setCommentText("");
      }
    } catch { }
  };

  if (error) {
    return (
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>Не удалось загрузить статью.</p>
      </div>
    );
  }
  if (!article) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", border: "3px solid rgba(34,197,94,0.15)", borderTopColor: GREEN, animation: "yq-spin .8s linear infinite" }} />
      </div>
    );
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div ref={scrollRef} onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 760, maxHeight: "92vh", overflowY: "auto", background: "#0f0f0f", borderRadius: "20px 20px 0 0", border: "1px solid rgba(34,197,94,0.2)", borderBottom: "none", animation: "slideUp .3s cubic-bezier(.16,1,.3,1)" }}>
        <style>{`@keyframes slideUp{from{transform:translateY(60px);opacity:0}to{transform:translateY(0);opacity:1}} @keyframes yq-spin{to{transform:rotate(360deg)}}`}</style>
        <ReadingProgress containerRef={scrollRef} />

        {article.cover_image && !article.video && !article.video_url && (
          <div style={{ width: "100%", height: 260, overflow: "hidden", position: "relative", flexShrink: 0 }}>
            <img src={fixMediaUrl(article.cover_image) || ""} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(15,15,15,1) 0%,rgba(15,15,15,0.3) 50%,transparent 100%)" }} />
            <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", borderRadius: 8, width: 34, height: 34, cursor: "pointer", fontSize: 16 }}>✕</button>
          </div>
        )}

        <div style={{ padding: "28px 28px 48px", position: "relative" }}>
          {(!article.cover_image || article.video || article.video_url) && (
            <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 15 }}>✕</button>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <CatBadge cat={article.tags[0]?.name || "Article"} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{article.read_time_minutes} min read</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{formatDate(article.created_at)}</span>
          </div>

          <h1 style={{ margin: "0 0 16px", fontSize: "clamp(20px,4vw,30px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15, color: "#fff" }}>{article.title}</h1>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <Avatar initials={(article.author_name || "?").split(" ").map(w => w[0]).slice(0, 2).join("")} photo={article.author_photo} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{article.author_name || "Yashil Qo'llar"}</div>
              {article.author_role && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{article.author_role}</div>}
            </div>
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 24 }} />

          <ArticleVideo video={article.video} videoUrl={article.video_url} />
          <PhotoGallery images={article.gallery_images} />

          <div style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.85, marginBottom: 28 }}>
            {article.content.split("\n\n").map((para, i) => <p key={i} style={{ marginBottom: 18 }}>{para}</p>)}
          </div>

          {article.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
              {article.tags.map(tag => <span key={tag.id} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)" }}>#{tag.name}</span>)}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <button onClick={handleLike} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 9, background: liked ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${liked ? GREEN + "40" : "rgba(255,255,255,0.09)"}`, color: liked ? GREEN : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              {liked ? "❤️" : "🤍"} {likeCount} likes
            </button>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 20 }}>
              {article.comments.length} comments
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 24, alignItems: "flex-start" }}>
              <Avatar initials="ME" size={30} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                <textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder={isLoggedIn ? "Add a comment…" : "Войди через Telegram, чтобы комментировать"} rows={3}
                  style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "#fff", fontSize: 13, padding: "10px 12px", fontFamily: "'Inter',sans-serif", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
                <button onClick={() => submitComment(commentText)} style={{ alignSelf: "flex-end", background: GREEN, border: "none", color: "#000", padding: "8px 20px", borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: "pointer" }}>Post →</button>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {article.comments.map(c => <CommentItem key={c.id} comment={c} onLike={handleLikeComment} onReply={(pid, text) => submitComment(text, pid)} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   КАРТОЧКА ПОСТА
───────────────────────────────────────── */
function PostCard({ post, onClick, delay = 0 }: { post: ArticleListItem; onClick: () => void; delay?: number }) {
  const [hov, setHov] = useState(false);
  return (
    <FadeIn delay={delay}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onClick}
        style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${hov ? GREEN + "35" : "rgba(255,255,255,0.07)"}`, borderRadius: 18, overflow: "hidden", cursor: "pointer", transform: hov ? "translateY(-4px)" : "none", transition: "all .25s ease", backdropFilter: "blur(8px)", display: "flex", flexDirection: "column" }}>
        <CoverOrPlaceholder cover={post.cover_image} hasVideo={post.has_video} hov={hov} title={post.title} />
        <div style={{ padding: "18px 18px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <CatBadge cat={post.tags[0]?.name || "Post"} />
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{post.read_time_minutes} min</span>
          </div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, lineHeight: 1.3, color: "#fff" }}>{post.title}</h3>
          <AuthorRow name={post.author_name} role={post.author_role} photo={post.author_photo} />
        </div>
        <div style={{ padding: "10px 18px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>❤️ {post.likes_count}</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>💬 {post.comments_count}</span>
        </div>
      </div>
    </FadeIn>
  );
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
export function BlogPage() {
  const [posts, setPosts] = useState<ArticleListItem[] | null>(null);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    fetch(ENDPOINTS.blog, { headers: baseHeaders("en") })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(setPosts)
      .catch(() => setError(true));
  }, []);

  const allTags = Array.from(new Map((posts || []).flatMap(p => p.tags).map(t => [t.slug, t])).values());
  const filtered = (posts || [])
    .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()))
    .filter(p => !activeTag || p.tags.some(t => t.slug === activeTag));
  const featured = (posts || []).find(p => p.is_featured);
  const rest = filtered.filter(p => p.id !== featured?.id);

  return (
    <div style={{ minHeight: "100vh", background: DARK, color: "#fff", fontFamily: "'Inter','Helvetica Neue',sans-serif", position: "relative", overflowX: "hidden" }}>
      <ForestCanvas />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 75% 55% at 10% 15%, rgba(34,197,94,0.09) 0%, transparent 58%)" }} />

      <main style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "clamp(100px,12vw,130px) clamp(16px,5vw,60px) 100px" }}>
        <FadeIn>
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ width: 28, height: 1.5, background: GREEN, borderRadius: 2, display: "inline-block" }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".28em", textTransform: "uppercase", color: GREEN }}>Yashil Qo'llar Journal</span>
            </div>
            <h1 style={{ margin: "0 0 12px", fontSize: "clamp(36px,6vw,64px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1 }}>
              From the <span style={{ color: GREEN, textShadow: "0 0 60px rgba(34,197,94,0.4)" }}>field.</span>
            </h1>
            <p style={{ margin: "0 0 24px", fontSize: 15, color: "rgba(255,255,255,0.38)", maxWidth: 520, lineHeight: 1.75 }}>Reports, research, and honest stories from our work across Uzbekistan.</p>
            <input type="text" placeholder="Search posts…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", maxWidth: 320, padding: "9px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "#fff", fontSize: 13, outline: "none" }} />

            {allTags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                <button onClick={() => setActiveTag(null)} style={{
                  padding: "6px 14px", borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: ".05em",
                  cursor: "pointer", background: !activeTag ? GREEN : "rgba(255,255,255,0.04)",
                  color: !activeTag ? "#000" : "rgba(255,255,255,0.5)",
                  border: `1px solid ${!activeTag ? GREEN : "rgba(255,255,255,0.09)"}`,
                }}>All</button>
                {allTags.map(t => (
                  <button key={t.slug} onClick={() => setActiveTag(t.slug === activeTag ? null : t.slug)} style={{
                    padding: "6px 14px", borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: ".05em",
                    cursor: "pointer", background: activeTag === t.slug ? GREEN : "rgba(255,255,255,0.04)",
                    color: activeTag === t.slug ? "#000" : "rgba(255,255,255,0.5)",
                    border: `1px solid ${activeTag === t.slug ? GREEN : "rgba(255,255,255,0.09)"}`,
                  }}>{t.name}</button>
                ))}
              </div>
            )}
          </div>
        </FadeIn>

        {error && <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "60px 0" }}>Не удалось загрузить статьи.</p>}
        {!error && !posts && (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", border: "3px solid rgba(34,197,94,0.15)", borderTopColor: GREEN, animation: "yq-spin .8s linear infinite" }} />
          </div>
        )}
        {!error && posts && posts.length === 0 && <p style={{ color: "rgba(255,255,255,0.35)", textAlign: "center", padding: "60px 0" }}>Пока нет статей. Скоро появятся!</p>}

        {featured && !search && (
          <FadeIn>
            <div onClick={() => setActiveSlug(featured.slug)} style={{
              position: "relative", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(34,197,94,0.18)",
              borderRadius: 22, overflow: "hidden", cursor: "pointer", marginBottom: 28,
              display: "grid", gridTemplateColumns: featured.cover_image ? "1.1fr 1fr" : "1fr", minHeight: 320,
              transition: "border-color .25s, transform .25s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = GREEN + "50"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(34,197,94,0.18)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              {featured.cover_image ? (
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img src={fixMediaUrl(featured.cover_image) || ""} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 55%, rgba(15,15,15,0.85) 100%)" }} />
                  {featured.has_video && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.2)" }}>
                      <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, backdropFilter: "blur(4px)" }}>▶️</div>
                    </div>
                  )}
                </div>
              ) : featured.has_video && (
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 40%, rgba(34,197,94,0.12), transparent 60%)", pointerEvents: "none" }} />
              )}
              <div style={{ padding: "36px 32px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 4, position: "relative" }}>
                <span style={{
                  position: "absolute", top: 20, right: 20, fontSize: 9, fontWeight: 800, letterSpacing: ".18em",
                  color: GREEN, textTransform: "uppercase", opacity: .7,
                }}>Featured</span>

                <div style={{ marginBottom: 12 }}><CatBadge cat={featured.tags[0]?.name || "Featured"} /></div>

                <h2 style={{ margin: "0 0 14px", fontSize: "clamp(20px,2.8vw,30px)", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.15, color: "#fff" }}>{featured.title}</h2>

                <AuthorRow name={featured.author_name} role={featured.author_role} photo={featured.author_photo} />

                <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "18px 0" }} />

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ display: "flex", gap: 16 }}>
                    <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: 5 }}>❤️ {featured.likes_count}</span>
                    <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: 5 }}>💬 {featured.comments_count}</span>
                    <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.3)" }}>{featured.read_time_minutes} min</span>
                  </div>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800,
                    color: GREEN, letterSpacing: ".03em",
                  }}>
                    Read article →
                  </span>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 18 }}>
          {rest.map((post, i) => <PostCard key={post.id} post={post} onClick={() => setActiveSlug(post.slug)} delay={i * 55} />)}
        </div>
      </main>

      {activeSlug && <ArticleModal slug={activeSlug} onClose={() => setActiveSlug(null)} />}
    </div>
  );
}