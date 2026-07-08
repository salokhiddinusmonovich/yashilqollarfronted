import { useState, useEffect, useRef } from "react";
import { ENDPOINTS, baseHeaders, fixMediaUrl } from "../config/api";
import { useAuth } from "../contexts/AuthContext";
import { useLang } from "../contexts/LanguageContext";
import logoImg from "./photo_2025-10-08_22-18-51.jpg";

const GREEN = "#22C55E";
const DARK = "#060606";

/* ─────────────────────────────────────────
   ТИПЫ — соответствуют ArticleListSerializer / ArticleDetailSerializer
───────────────────────────────────────── */
interface Tag { id: number; name: string; slug: string; }
interface CommentNode {
  id: number; user_id: number; user_name: string; user_photo: string | null; text: string;
  likes_count: number; is_liked_by_me: boolean; created_at: string; replies: CommentNode[];
}
interface ArticleListItem {
  id: number; title: string; slug: string; cover_image: string | null; tags: Tag[];
  read_time_minutes: number; likes_count: number; is_liked_by_me: boolean; comments_count: number; created_at: string; is_featured: boolean;
  author_name: string; author_role: string | null; author_photo: string | null; has_video: boolean;
}
interface GalleryImage { id: number; image: string; }
interface ArticleDetail {
  id: number; title: string; slug: string; cover_image: string | null; content: string | null;
  author_name: string; author_role: string | null; author_photo: string | null; tags: Tag[]; read_time_minutes: number;
  likes_count: number; is_liked_by_me: boolean; created_at: string; comments: CommentNode[];
  video: string | null; video_url: string | null; gallery_images: GalleryImage[];
}
interface EcoProjectItem {
  id: number; title: string; description: string | null; date: string; location_name: string;
  photo: string | null; gallery_images: GalleryImage[]; is_active: boolean; max_participants: number;
  participants_count: number; region: string; region_display: string; is_joined: boolean; chat_link: string | null;
  likes_count: number; is_liked_by_me: boolean; comments_count: number; comments: CommentNode[];
}
type FeedItem = { kind: "post"; data: ArticleListItem } | { kind: "project"; data: EcoProjectItem };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return formatDate(iso);
}

function getAccessToken() { return localStorage.getItem("yq_access_token"); }
function authHeaders(lang: string = "en") {
  const token = getAccessToken();
  const extra: Record<string, string> = { "Content-Type": "application/json" };
  if (token) extra.Authorization = `Bearer ${token}`;
  return baseHeaders(lang, extra);
}

/** Достаёт YouTube video ID из обычной ссылки для embed */
function youtubeEmbedUrl(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

/* ─────────────────────────────────────────
   TOAST — заменяет alert(), не блокирует, вписан в дизайн
───────────────────────────────────────── */
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2600); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 500,
      background: "#161616", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 12,
      padding: "12px 20px", color: "#fff", fontSize: 13, fontWeight: 600,
      boxShadow: "0 12px 32px rgba(0,0,0,0.5)", animation: "yq-toastIn .25s cubic-bezier(.16,1,.3,1)",
      maxWidth: "calc(100vw - 32px)", textAlign: "center",
    }}>
      {message}
    </div>
  );
}

/* ─────────────────────────────────────────
   ФОНОВЫЙ CANVAS
───────────────────────────────────────── */
function ForestCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!; const ctx = canvas.getContext("2d")!;
    let id: number, w: number, h: number;
    const nodes: any[] = [];
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    const init = () => {
      resize(); nodes.length = 0;
      for (let i = 0; i < 55; i++) nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.8 + .5, a: Math.random() * .5 + .15 });
    };
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0) n.x = w; if (n.x > w) n.x = 0;
        if (n.y < 0) n.y = h; if (n.y > h) n.y = 0;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,197,94,${n.a})`; ctx.fill();
      }
      id = requestAnimationFrame(tick);
    };
    init(); tick(); window.addEventListener("resize", init);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", init); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: 0.5 }} />;
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null); const [vis, setVis] = useState(false);
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.06 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, []);
  return <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(18px)", transition: `opacity .6s cubic-bezier(.16,1,.3,1) ${delay}ms,transform .6s cubic-bezier(.16,1,.3,1) ${delay}ms` }}>{children}</div>;
}

function Avatar({ initials, size = 32, photo, onClick }: { initials: string; size?: number; photo?: string | null; onClick?: () => void }) {
  const photoUrl = fixMediaUrl(photo || null);
  return (
    <div onClick={onClick} style={{ width: size, height: size, borderRadius: "50%", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * .32, fontWeight: 700, color: GREEN, flexShrink: 0, overflow: "hidden", cursor: onClick ? "pointer" : "default" }}>
      {photoUrl ? <img src={photoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
    </div>
  );
}

/* ─────────────────────────────────────────
   МИНИ-ПРОФИЛЬ АВТОРА — то, что реально доступно с бэкенда
   (name/role/photo). Полноценная страница профиля для произвольного
   юзера потребует отдельного публичного эндпоинта — сейчас на бэке
   есть только /me/ (для себя) и /team/ (для команды). Для авторов
   статей (все — is_admin=True) это обычно те же люди, что в /team/.
───────────────────────────────────────── */
function AuthorPopover({ name, role, photo, onClose }: { name: string; role: string | null; photo?: string | null; onClose: () => void }) {
  const initials = (name || "?").split(" ").filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#0f0f0f", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 18, padding: 28, width: "100%", maxWidth: 300, textAlign: "center" }}>
        <Avatar initials={initials} photo={photo} size={72} />
        <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginTop: 14 }}>{name || "Yashil Qo'llar"}</div>
        {role && <div style={{ fontSize: 12.5, color: GREEN, fontWeight: 600, marginTop: 4 }}>{role}</div>}
        <button onClick={onClose} style={{ marginTop: 20, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "8px 20px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Close</button>
      </div>
    </div>
  );
}

function CatBadge({ cat }: { cat: string }) {
  return <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 5, background: `${GREEN}14`, color: GREEN, border: `1px solid ${GREEN}28` }}>{cat}</span>;
}

/* Большое сердце, всплывающее по центру медиа при двойном тапе — как в Instagram */
function LikeBurst({ show }: { show: number }) {
  if (!show) return null;
  return (
    <div key={show} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      <svg width="86" height="86" viewBox="0 0 24 24" style={{ animation: "yq-heartPop .7s ease forwards" }}>
        <path d="M12 21s-7.5-4.6-10-9.1C.5 8.6 2 5 5.6 5c2 0 3.4 1.1 4.4 2.6C11 6.1 12.4 5 14.4 5 18 5 19.5 8.6 22 11.9 19.5 16.4 12 21 12 21z" fill="#fff" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────
   МЕДИА ПОСТА — фото/видео с двойным тапом для лайка
───────────────────────────────────────── */
function PostMedia({ cover, hasVideo, title, onDoubleTap, burstKey }: { cover: string | null; hasVideo: boolean; title: string; onDoubleTap: () => void; burstKey: number }) {
  const lastTap = useRef(0);
  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 320) onDoubleTap();
    lastTap.current = now;
  };

  if (!cover && !hasVideo) return null;

  return (
    <div onClick={handleTap} style={{ width: "100%", aspectRatio: "4/5", position: "relative", background: "#111", cursor: "pointer", userSelect: "none" }}>
      {cover ? (
        <img src={fixMediaUrl(cover) || ""} alt={title} draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : (
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(34,197,94,0.18), rgba(6,6,6,1))" }} />
      )}
      {hasVideo && (
        <div style={{ position: "absolute", top: 12, right: 12, width: 30, height: 30, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>▶</div>
      )}
      <LikeBurst show={burstKey} />
    </div>
  );
}

/* ─────────────────────────────────────────
   ГАЛЕРЕЯ ФОТО — карусель с точками и стрелками (внутри модалки)
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
            <button onClick={() => go(-1)} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 34, height: 34, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", cursor: "pointer" }}>‹</button>
            <button onClick={() => go(1)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 34, height: 34, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", cursor: "pointer" }}>›</button>
            <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
              {images.map((_, i) => <span key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 18 : 6, height: 6, borderRadius: 4, background: i === idx ? GREEN : "rgba(255,255,255,0.4)", cursor: "pointer" }} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ArticleVideo({ video, videoUrl }: { video: string | null; videoUrl: string | null }) {
  if (video) return <div style={{ marginBottom: 24, borderRadius: 14, overflow: "hidden", background: "#000" }}><video src={fixMediaUrl(video) || ""} controls style={{ width: "100%", display: "block", maxHeight: 420 }} /></div>;
  if (videoUrl) {
    const embed = youtubeEmbedUrl(videoUrl);
    if (embed) return <div style={{ marginBottom: 24, borderRadius: 14, overflow: "hidden", aspectRatio: "16/9" }}><iframe src={embed} title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width: "100%", height: "100%", border: "none" }} /></div>;
    return <a href={videoUrl} target="_blank" rel="noreferrer" style={{ display: "block", marginBottom: 24, padding: "14px 18px", borderRadius: 12, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", color: GREEN, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>▶ Watch video</a>;
  }
  return null;
}

/* ─────────────────────────────────────────
   КОММЕНТАРИИ — рекурсивное дерево
───────────────────────────────────────── */
function CommentItem({ comment, onReply, onAuthorClick, onNotice, kind = "post", depth = 0 }: {
  comment: CommentNode; onReply: (parentId: number, text: string) => void;
  onAuthorClick: (name: string) => void; onNotice: (msg: string) => void; kind?: "post" | "project"; depth?: number;
}) {
  const { isLoggedIn } = useAuth();
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [liked, setLiked] = useState(comment.is_liked_by_me);
  const [likeCount, setLikeCount] = useState(comment.likes_count);
  const submitReply = () => { if (!replyText.trim()) return; onReply(comment.id, replyText); setReplyText(""); setShowReply(false); };

  const toggleLike = () => {
    if (!isLoggedIn) { onNotice("Sign in to like comments."); return; }
    fetch(kind === "project" ? ENDPOINTS.projectCommentLike(comment.id) : ENDPOINTS.commentLike(comment.id), { method: "POST", headers: authHeaders() })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then((data: { likes_count: number; liked: boolean }) => { setLiked(data.liked); setLikeCount(data.likes_count); })
      .catch(() => onNotice("Couldn't update your like. Try again."));
  };

  return (
    <div style={{ marginLeft: depth > 0 ? 20 : 0, borderLeft: depth > 0 ? "1px solid rgba(34,197,94,0.15)" : "none", paddingLeft: depth > 0 ? 14 : 0 }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
        <Avatar initials={comment.user_name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()} photo={comment.user_photo} size={28} onClick={() => onAuthorClick(comment.user_name)} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <span onClick={() => onAuthorClick(comment.user_name)} style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.8)", cursor: "pointer" }}>{comment.user_name}</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{timeAgo(comment.created_at)}</span>
          </div>
          <p style={{ margin: "0 0 8px", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>{comment.text}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={toggleLike} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: liked ? GREEN : "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 600, padding: 0 }}>{liked ? "♥" : "♡"} {likeCount}</button>
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
      {comment.replies.map(r => <CommentItem key={r.id} comment={r} onReply={onReply} onAuthorClick={onAuthorClick} onNotice={onNotice} kind={kind} depth={depth + 1} />)}
    </div>
  );
}

function ReadingProgress({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    const onScroll = () => { const max = el.scrollHeight - el.clientHeight; setProgress(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0); };
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
   МОДАЛКА СТАТЬИ (полный вид с комментариями)
───────────────────────────────────────── */
function ArticleModal({ slug, onClose, onNotice, onAuthorClick }: {
  slug: string; onClose: () => void; onNotice: (msg: string) => void; onAuthorClick: (name: string, role: string | null, photo?: string | null) => void;
}) {
  const { isLoggedIn } = useAuth();
  const { lang } = useLang();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [error, setError] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [burst, setBurst] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(ENDPOINTS.blogDetail(slug), { headers: baseHeaders(lang) })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then((data: ArticleDetail) => { setArticle(data); setLikeCount(data.likes_count); setLiked(data.is_liked_by_me); })
      .catch(() => setError(true));
  }, [slug, lang]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [onClose]);

  const doLike = () => {
    if (!isLoggedIn) { onNotice("Sign in to like posts."); return; }
    if (!liked) setBurst(k => k + 1);
    fetch(ENDPOINTS.blogLike(slug), { method: "POST", headers: authHeaders(lang) })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then((data: { likes_count: number; liked: boolean }) => { setLiked(data.liked); setLikeCount(data.likes_count); })
      .catch(() => onNotice("Couldn't update your like. Try again."));
  };

  const submitComment = async (text: string, parent: number | null = null) => {
    if (!isLoggedIn) { onNotice("Sign in to comment."); return; }
    if (!text.trim()) return;
    try {
      const res = await fetch(ENDPOINTS.blogComment(slug), { method: "POST", headers: authHeaders(lang), body: JSON.stringify({ text, parent }) });
      if (res.ok) {
        const refreshed = await fetch(ENDPOINTS.blogDetail(slug), { headers: baseHeaders(lang) });
        if (refreshed.ok) setArticle(await refreshed.json());
        setCommentText("");
      } else {
        onNotice("Couldn't post your comment. Try again.");
      }
    } catch { onNotice("Network error. Check your connection."); }
  };

  if (error) {
    return (
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>Couldn't load this post.</p>
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
      <div ref={scrollRef} onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 600, maxHeight: "92vh", overflowY: "auto", background: "#0f0f0f", borderRadius: "20px 20px 0 0", border: "1px solid rgba(34,197,94,0.2)", borderBottom: "none", animation: "slideUp .3s cubic-bezier(.16,1,.3,1)" }}>
        <ReadingProgress containerRef={scrollRef} />

        {/* IG-style header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Avatar initials={(article.author_name || "?").split(" ").map(w => w[0]).slice(0, 2).join("")} photo={article.author_photo} onClick={() => onAuthorClick(article.author_name, article.author_role, article.author_photo)} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div onClick={() => onAuthorClick(article.author_name, article.author_role, article.author_photo)} style={{ fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>{article.author_name || "Yashil Qo'llar"}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{timeAgo(article.created_at)} · {article.read_time_minutes} min read</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 14 }}>✕</button>
        </div>

        {article.cover_image && !article.video && !article.video_url && (
          <PostMedia cover={article.cover_image} hasVideo={false} title={article.title} onDoubleTap={doLike} burstKey={burst} />
        )}

        <div style={{ padding: "20px 18px 48px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <CatBadge cat={article.tags[0]?.name || "Article"} />
          </div>

          <h1 style={{ margin: "0 0 16px", fontSize: "clamp(19px,3.6vw,26px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2, color: "#fff" }}>{article.title}</h1>

          <ArticleVideo video={article.video} videoUrl={article.video_url} />
          <PhotoGallery images={article.gallery_images} />

          {article.content && (
            <div style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.85, marginBottom: 24 }}>
              {article.content.split("\n\n").map((para, i) => <p key={i} style={{ marginBottom: 18 }}>{para}</p>)}
            </div>
          )}

          {article.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
              {article.tags.map(tag => <span key={tag.id} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)" }}>#{tag.name}</span>)}
            </div>
          )}

          {/* action row */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "8px 0 18px", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 4 }}>
            <button onClick={doLike} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: liked ? GREEN : "rgba(255,255,255,0.6)", fontSize: 22, padding: 0 }}>
              {liked ? "♥" : "♡"}
            </button>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{likeCount} likes</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{article.comments.length} comments</span>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 20 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 24, alignItems: "flex-start" }}>
              <Avatar initials="ME" size={30} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                <textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder={isLoggedIn ? "Add a comment…" : "Sign in to comment"} rows={3}
                  style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "#fff", fontSize: 13, padding: "10px 12px", fontFamily: "'Inter',sans-serif", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
                <button onClick={() => submitComment(commentText)} style={{ alignSelf: "flex-end", background: GREEN, border: "none", color: "#000", padding: "8px 20px", borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: "pointer" }}>Post →</button>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {article.comments.map(c => (
                <CommentItem key={c.id} comment={c} onReply={(pid, text) => submitComment(text, pid)}
                  onAuthorClick={(name) => onAuthorClick(name, null, null)} onNotice={onNotice} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ЭКО-ПРОЕКТ КАК ПОЛНОЦЕННЫЙ ПОСТ — с галереей (2-3 фото), лайком,
   комментариями и кнопкой Join прямо в ленте, наравне со статьями.
───────────────────────────────────────── */
function projectPhotos(p: EcoProjectItem): string[] {
  const arr = p.gallery_images.map(g => g.image);
  if (p.photo && !arr.includes(p.photo)) arr.unshift(p.photo);
  return arr.slice(0, 3); // максимум 3, как в плоггинге
}

function ProjectFeedPost({ project, onOpen, onNotice, delay = 0 }: {
  project: EcoProjectItem; onOpen: () => void; onNotice: (msg: string) => void; delay?: number;
}) {
  const { isLoggedIn } = useAuth();
  const [liked, setLiked] = useState(project.is_liked_by_me);
  const [likeCount, setLikeCount] = useState(project.likes_count);
  const [burst, setBurst] = useState(0);
  const [photoIdx, setPhotoIdx] = useState(0);
  const photos = projectPhotos(project);

  const doLike = () => {
    if (!isLoggedIn) { onNotice("Sign in to like posts."); return; }
    if (!liked) setBurst(k => k + 1);
    fetch(ENDPOINTS.projectLike(project.id), { method: "POST", headers: authHeaders() })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then((data: { likes_count: number; liked: boolean }) => { setLiked(data.liked); setLikeCount(data.likes_count); })
      .catch(() => onNotice("Couldn't update your like. Try again."));
  };

  const lastTap = useRef(0);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleMediaClick = () => {
    const now = Date.now();
    const delta = now - lastTap.current;
    lastTap.current = now;
    if (delta < 320) {
      // second tap arrived in time — it's a double-tap: like, and cancel the pending "open" from the first tap
      if (openTimer.current) clearTimeout(openTimer.current);
      doLike();
    } else {
      // first tap — wait a beat to see if a second one follows before opening
      openTimer.current = setTimeout(onOpen, 320);
    }
  };

  return (
    <FadeIn delay={delay}>
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(34,197,94,0.14)", borderRadius: 16, overflow: "hidden", marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px" }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", border: "1px solid rgba(34,197,94,0.35)", flexShrink: 0 }}>
            <img src={logoImg} alt="Yashil Qo'llar" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff" }}>Yashil Qo'llar · {project.region_display}</div>
            <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.35)" }}>{timeAgo(project.date)} · {formatDate(project.date)}</div>
          </div>
          <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".1em", color: GREEN, textTransform: "uppercase" }}>Eco-project</span>
        </div>

        {photos.length > 0 && (
          <div onClick={handleMediaClick} style={{ position: "relative", width: "100%", aspectRatio: "4/5", background: "#111", cursor: "pointer" }}>
            <img src={fixMediaUrl(photos[photoIdx]) || ""} alt={project.title} draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            {photos.length > 1 && (
              <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 4 }}>
                {photos.map((_, i) => (
                  <span key={i} onClick={e => { e.stopPropagation(); setPhotoIdx(i); }} style={{ width: 6, height: 6, borderRadius: "50%", background: i === photoIdx ? "#fff" : "rgba(255,255,255,0.4)" }} />
                ))}
              </div>
            )}
            <LikeBurst show={burst} />
          </div>
        )}

        <div style={{ padding: "12px 14px 6px", display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={doLike} style={{ background: "none", border: "none", cursor: "pointer", color: liked ? GREEN : "rgba(255,255,255,0.65)", fontSize: 22, padding: 0, lineHeight: 1 }}>{liked ? "♥" : "♡"}</button>
          <button onClick={onOpen} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.65)", fontSize: 20, padding: 0, lineHeight: 1 }}>💬</button>
        </div>

        <div style={{ padding: "0 14px 14px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{likeCount} likes</div>
          <div onClick={onOpen} style={{ fontSize: 13.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.5, marginBottom: 6, cursor: "pointer" }}>
            <span style={{ fontWeight: 700, color: "#fff", marginRight: 6 }}>Yashil Qo'llar</span>
            {project.title}
          </div>
          {project.description && (
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.5, marginBottom: 6 }}>{project.description}</div>
          )}
          {project.comments_count > 0 && (
            <div onClick={onOpen} style={{ fontSize: 12.5, color: "rgba(255,255,255,0.35)", cursor: "pointer" }}>View all {project.comments_count} comments</div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}

/* Модалка эко-проекта — тот же UX, что у статьи: галерея, лайк, комменты, плюс Join */
function ProjectModal({ project, onClose, onNotice }: { project: EcoProjectItem; onClose: () => void; onNotice: (msg: string) => void }) {
  const { isLoggedIn } = useAuth();
  const { lang } = useLang();
  const [liked, setLiked] = useState(project.is_liked_by_me);
  const [likeCount, setLikeCount] = useState(project.likes_count);
  const [comments, setComments] = useState(project.comments);
  const [commentText, setCommentText] = useState("");
  const [burst, setBurst] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const photos = projectPhotos(project);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [onClose]);

  const doLike = () => {
    if (!isLoggedIn) { onNotice("Sign in to like posts."); return; }
    if (!liked) setBurst(k => k + 1);
    fetch(ENDPOINTS.projectLike(project.id), { method: "POST", headers: authHeaders(lang) })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then((data: { likes_count: number; liked: boolean }) => { setLiked(data.liked); setLikeCount(data.likes_count); })
      .catch(() => onNotice("Couldn't update your like. Try again."));
  };

  const submitComment = async (text: string, parent: number | null = null) => {
    if (!isLoggedIn) { onNotice("Sign in to comment."); return; }
    if (!text.trim()) return;
    try {
      const res = await fetch(ENDPOINTS.projectComment(project.id), { method: "POST", headers: authHeaders(lang), body: JSON.stringify({ text, parent }) });
      if (res.ok) {
        const refreshed = await fetch(ENDPOINTS.projectDetail(project.id), { headers: authHeaders(lang) });
        if (refreshed.ok) { const data = await refreshed.json(); setComments(data.comments); }
        setCommentText("");
      } else onNotice("Couldn't post your comment. Try again.");
    } catch { onNotice("Network error. Check your connection."); }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div ref={scrollRef} onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 600, maxHeight: "92vh", overflowY: "auto", background: "#0f0f0f", borderRadius: "20px 20px 0 0", border: "1px solid rgba(34,197,94,0.2)", borderBottom: "none", animation: "slideUp .3s cubic-bezier(.16,1,.3,1)" }}>
        <ReadingProgress containerRef={scrollRef} />

        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", border: "1px solid rgba(34,197,94,0.35)", flexShrink: 0 }}>
            <img src={logoImg} alt="Yashil Qo'llar" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Yashil Qo'llar · {project.region_display}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{formatDate(project.date)} · {project.location_name}</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 14 }}>✕</button>
        </div>

        {photos.length > 0 && <PhotoGallery images={photos.map((img, i) => ({ id: i, image: img }))} />}

        <div style={{ padding: "20px 18px 48px" }}>
          <h1 style={{ margin: "0 0 14px", fontSize: "clamp(19px,3.6vw,26px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2, color: "#fff" }}>{project.title}</h1>
          {project.description && <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, marginBottom: 22 }}>{project.description}</p>}

          <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "8px 0 18px", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 4 }}>
            <button onClick={doLike} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: liked ? GREEN : "rgba(255,255,255,0.6)", fontSize: 22, padding: 0 }}>{liked ? "♥" : "♡"}</button>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{likeCount} likes</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{comments.length} comments</span>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 20 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 24, alignItems: "flex-start" }}>
              <Avatar initials="ME" size={30} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                <textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder={isLoggedIn ? "Add a comment…" : "Sign in to comment"} rows={3}
                  style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "#fff", fontSize: 13, padding: "10px 12px", fontFamily: "'Inter',sans-serif", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
                <button onClick={() => submitComment(commentText)} style={{ alignSelf: "flex-end", background: GREEN, border: "none", color: "#000", padding: "8px 20px", borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: "pointer" }}>Post →</button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {comments.map(c => (
                <CommentItem key={c.id} comment={c} onReply={(pid, text) => submitComment(text, pid)} onAuthorClick={() => { }} onNotice={onNotice} kind="project" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function FeedPost({ post, onOpen, onNotice, onAuthorClick, delay = 0 }: {
  post: ArticleListItem; onOpen: () => void; onNotice: (msg: string) => void;
  onAuthorClick: (name: string, role: string | null, photo?: string | null) => void; delay?: number;
}) {
  const { isLoggedIn } = useAuth();
  const [liked, setLiked] = useState(post.is_liked_by_me);
  const [likeCount, setLikeCount] = useState(post.likes_count);
  const [burst, setBurst] = useState(0);

  const doLike = () => {
    if (!isLoggedIn) { onNotice("Sign in to like posts."); return; }
    if (!liked) setBurst(k => k + 1); // only pop the heart animation when actually liking, not unliking
    fetch(ENDPOINTS.blogLike(post.slug), { method: "POST", headers: authHeaders() })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then((data: { likes_count: number; liked: boolean }) => { setLiked(data.liked); setLikeCount(data.likes_count); })
      .catch(() => onNotice("Couldn't update your like. Try again."));
  };

  return (
    <FadeIn delay={delay}>
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden", marginBottom: 22 }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px" }}>
          <Avatar initials={(post.author_name || "?").split(" ").map(w => w[0]).slice(0, 2).join("")} photo={post.author_photo} onClick={() => onAuthorClick(post.author_name, post.author_role, post.author_photo)} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div onClick={() => onAuthorClick(post.author_name, post.author_role, post.author_photo)} style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", cursor: "pointer" }}>{post.author_name || "Yashil Qo'llar"}</div>
            <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.35)" }}>{timeAgo(post.created_at)}</div>
          </div>
          {post.is_featured && <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".12em", color: GREEN, textTransform: "uppercase" }}>Featured</span>}
        </div>

        {/* media */}
        <div onClick={onOpen} style={{ cursor: "pointer" }}>
          <PostMedia cover={post.cover_image} hasVideo={post.has_video} title={post.title} onDoubleTap={doLike} burstKey={burst} />
        </div>

        {/* actions */}
        <div style={{ padding: "12px 14px 6px", display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={doLike} style={{ background: "none", border: "none", cursor: "pointer", color: liked ? GREEN : "rgba(255,255,255,0.65)", fontSize: 22, padding: 0, lineHeight: 1 }}>{liked ? "♥" : "♡"}</button>
          <button onClick={onOpen} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.65)", fontSize: 20, padding: 0, lineHeight: 1 }}>💬</button>
        </div>

        <div style={{ padding: "0 14px 14px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{likeCount} likes</div>
          <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.5, marginBottom: 6 }}>
            <span style={{ fontWeight: 700, color: "#fff", marginRight: 6 }}>{post.author_name}</span>
            {post.title}
          </div>
          {post.comments_count > 0 && (
            <div onClick={onOpen} style={{ fontSize: 12.5, color: "rgba(255,255,255,0.35)", cursor: "pointer" }}>View all {post.comments_count} comments</div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
export function BlogPage() {
  const { lang } = useLang();
  const [posts, setPosts] = useState<ArticleListItem[] | null>(null);
  const [projects, setProjects] = useState<EcoProjectItem[] | null>(null);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<EcoProjectItem | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [authorPopover, setAuthorPopover] = useState<{ name: string; role: string | null; photo?: string | null } | null>(null);

  useEffect(() => {
    fetch(ENDPOINTS.blog, { headers: baseHeaders(lang) })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(setPosts)
      .catch(() => setError(true));
    fetch(ENDPOINTS.projects, { headers: authHeaders(lang) })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(setProjects)
      .catch(() => setProjects([]));
  }, [lang]);

  const allTags = Array.from(new Map((posts || []).flatMap(p => p.tags).map(t => [t.slug, t])).values());
  const filteredPosts = (posts || [])
    .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()))
    .filter(p => !activeTag || p.tags.some(t => t.slug === activeTag));
  const filteredProjects = (projects || [])
    .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()));

  // Единая лента: посты + эко-проекты вместе, отсортированы по дате — как в Instagram,
  // а не отдельными блоками.
  const feed: FeedItem[] = [
    ...filteredPosts.map((p): FeedItem => ({ kind: "post", data: p })),
    ...filteredProjects.map((p): FeedItem => ({ kind: "project", data: p })),
  ].sort((a, b) => {
    const da = new Date(a.kind === "post" ? a.data.created_at : a.data.date).getTime();
    const db = new Date(b.kind === "post" ? b.data.created_at : b.data.date).getTime();
    return db - da;
  });

  const showAuthor = (name: string, role: string | null, photo?: string | null) => setAuthorPopover({ name, role, photo });

  return (
    <div style={{ minHeight: "100vh", background: DARK, color: "#fff", fontFamily: "'Inter','Helvetica Neue',sans-serif", position: "relative", overflowX: "hidden" }}>
      <style>{`
        @keyframes slideUp{from{transform:translateY(60px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes yq-spin{to{transform:rotate(360deg)}}
        @keyframes yq-heartPop{0%{transform:scale(0);opacity:0}25%{transform:scale(1.15);opacity:1}45%{transform:scale(0.95)}100%{transform:scale(1);opacity:0}}
        @keyframes yq-toastIn{from{opacity:0;transform:translate(-50%,10px)}to{opacity:1;transform:translate(-50%,0)}}
      `}</style>
      <ForestCanvas />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 75% 55% at 10% 15%, rgba(34,197,94,0.09) 0%, transparent 58%)" }} />

      <main style={{ position: "relative", zIndex: 1, maxWidth: 560, margin: "0 auto", padding: "clamp(90px,10vw,120px) 16px 100px" }}>
        <FadeIn>
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ width: 28, height: 1.5, background: GREEN, borderRadius: 2, display: "inline-block" }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".28em", textTransform: "uppercase", color: GREEN }}>Yashil Qo'llar Journal</span>
            </div>
            <h1 style={{ margin: "0 0 10px", fontSize: "clamp(28px,7vw,40px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1 }}>
              From the <span style={{ color: GREEN }}>field.</span>
            </h1>
            <input type="text" placeholder="Search posts…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            {allTags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                <button onClick={() => setActiveTag(null)} style={{ padding: "6px 14px", borderRadius: 999, fontSize: 11, fontWeight: 700, cursor: "pointer", background: !activeTag ? GREEN : "rgba(255,255,255,0.04)", color: !activeTag ? "#000" : "rgba(255,255,255,0.5)", border: `1px solid ${!activeTag ? GREEN : "rgba(255,255,255,0.09)"}` }}>All</button>
                {allTags.map(t => (
                  <button key={t.slug} onClick={() => setActiveTag(t.slug === activeTag ? null : t.slug)} style={{ padding: "6px 14px", borderRadius: 999, fontSize: 11, fontWeight: 700, cursor: "pointer", background: activeTag === t.slug ? GREEN : "rgba(255,255,255,0.04)", color: activeTag === t.slug ? "#000" : "rgba(255,255,255,0.5)", border: `1px solid ${activeTag === t.slug ? GREEN : "rgba(255,255,255,0.09)"}` }}>{t.name}</button>
                ))}
              </div>
            )}
          </div>
        </FadeIn>

        {error && <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "60px 0" }}>Couldn't load posts.</p>}
        {!error && !posts && !projects && (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", border: "3px solid rgba(34,197,94,0.15)", borderTopColor: GREEN, animation: "yq-spin .8s linear infinite" }} />
          </div>
        )}
        {!error && posts && projects && feed.length === 0 && <p style={{ color: "rgba(255,255,255,0.35)", textAlign: "center", padding: "60px 0" }}>Nothing here yet — check back soon!</p>}

        {feed.map((item, i) => item.kind === "post" ? (
          <FeedPost key={`post-${item.data.id}`} post={item.data} delay={i * 45}
            onOpen={() => setActiveSlug(item.data.slug)}
            onNotice={setNotice}
            onAuthorClick={showAuthor}
          />
        ) : (
          <ProjectFeedPost key={`project-${item.data.id}`} project={item.data} delay={i * 45}
            onOpen={() => setActiveProject(item.data)}
            onNotice={setNotice}
          />
        ))}
      </main>

      {activeSlug && <ArticleModal slug={activeSlug} onClose={() => setActiveSlug(null)} onNotice={setNotice} onAuthorClick={showAuthor} />}
      {activeProject && <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} onNotice={setNotice} />}
      {authorPopover && <AuthorPopover name={authorPopover.name} role={authorPopover.role} photo={authorPopover.photo} onClose={() => setAuthorPopover(null)} />}
      {notice && <Toast message={notice} onDone={() => setNotice(null)} />}
    </div>
  );
}