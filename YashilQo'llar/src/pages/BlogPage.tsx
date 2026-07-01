import { useState, useEffect, useRef } from "react";

const GREEN = "#22C55E";
const DARK = "#060606";

type Lang = "EN" | "UZ" | "RU";

// ─── Mock posts ────────────────────────────────────────────────────────────────
const MOCK_POSTS = [
    {
        id: 1,
        title: "31,000 trees and counting: our Aral Sea project year in review",
        excerpt: "The Aral Sea basin was once described as the world's worst environmental disaster. Here's what we've done about it — and what the data actually shows after year three.",
        content: "The Aral Sea basin restoration is one of the most ambitious reforestation challenges in Central Asia. Over the past three years, our teams have planted over 31,000 saxaul trees across the former seabed. The survival rate stands at 74% — well above the regional average of 52%. We've learned that community involvement from day one is the single biggest predictor of long-term success. Villages that participated in the initial planting take ownership of the trees. They water them during dry spells. They report damage. They care.\n\nThe data tells a clear story: remote, centrally-managed plantings fail. Local, community-embedded ones thrive. This year we're doubling down on the community-first model across all six active regions.",
        category: "Field Report",
        author: "Aziz Karimov",
        authorRole: "Founder",
        date: "2026-05-28",
        readTime: "8 min",
        featured: true,
        image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=80",
        likes: 142,
        tags: ["Aral Sea", "Restoration", "Data"],
    },
    {
        id: 2,
        title: "Why we stopped counting trees and started counting survival rates",
        excerpt: "Tree-planting events look great on social media. But a tree planted is not a tree alive. We explain the metric shift that changed everything about how we work.",
        content: "In 2022 we planted 8,000 trees in a single weekend event. By 2023, fewer than 3,000 were still alive. That 37% survival rate was a wake-up call. The problem wasn't the species or the soil — it was that we had no post-planting infrastructure. No community caretakers. No water access plan. No monitoring.\n\nWe now measure success at 6 months, 12 months, and 24 months post-planting. Every tree is GPS-tagged. Every site has a named community caretaker. Our target is 70%+ survival at 24 months. We're currently at 74% across all active sites.",
        category: "Our Approach",
        author: "Malika Yusupova",
        authorRole: "Head of Reforestation",
        date: "2026-05-10",
        readTime: "5 min",
        featured: false,
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&q=80",
        likes: 98,
        tags: ["Metrics", "Methodology"],
    },
    {
        id: 3,
        title: "Saxaul: the unglamorous tree saving Central Asia",
        excerpt: "It won't win any beauty contests. But the saxaul tree is doing more to fight desertification in Uzbekistan than any other species.",
        content: "The saxaul (Haloxylon ammodendron) looks like something between a bush and a ghost. Its branches are pale and leafless for most of the year. It grows slowly. It's not impressive to photograph. But it is extraordinary at surviving — and at holding sand in place.\n\nA single mature saxaul can stabilise up to 5 square metres of loose desert soil. Its roots go 15 metres deep to find water. It can survive -40°C winters and +50°C summers. In the Aral Sea basin, where winds carry salt dust across hundreds of kilometres, saxaul is the only realistic large-scale answer.",
        category: "Science",
        author: "Nilufar Ergasheva",
        authorRole: "Research & Development",
        date: "2026-04-22",
        readTime: "6 min",
        featured: false,
        image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&q=80",
        likes: 211,
        tags: ["Saxaul", "Botany", "Desertification"],
    },
    {
        id: 4,
        title: "Community first: lessons from Namangan's green belt project",
        excerpt: "We almost failed in Namangan. The soil was right, the species were right, but we hadn't listened properly.",
        content: "We arrived in Namangan with a plan. We had species selected, sites mapped, a planting schedule. What we didn't have was buy-in from the families who actually lived next to those sites.\n\nFor the first three months, the project stalled. Locals were suspicious. Why were outsiders planting trees on land they'd grazed for generations? It took six months of genuine listening — not community consultations, but actual conversations over tea — before trust developed. Once it did, everything changed. Locals identified better planting sites than we had. They suggested species we hadn't considered. The project became theirs.",
        category: "Community",
        author: "Jasur Toshmatov",
        authorRole: "Community Lead",
        date: "2026-04-05",
        readTime: "7 min",
        featured: false,
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80",
        likes: 76,
        tags: ["Community", "Namangan", "Lessons"],
    },
    {
        id: 5,
        title: "Q1 2026 transparency report: where every tenge went",
        excerpt: "Full breakdown of Q1 spending across all six active regions. Including the projects that went over budget and one that we had to pause.",
        content: "Total Q1 spend: 847,000,000 UZS (~$66,000 USD). Of that, 61% went directly to planting materials and labour. 18% to monitoring and community programs. 12% to transport and logistics. 9% to administration and communications.\n\nOne project — the Sirdaryo river buffer planting — went 23% over budget due to unexpected soil conditions requiring additional soil amendment. We paused the Andijon exploratory phase after initial surveys showed the proposed site had higher salt content than our species can tolerate. We'll revisit in Q3 with adapted species selection.",
        category: "Transparency",
        author: "Aziz Karimov",
        authorRole: "Founder",
        date: "2026-03-31",
        readTime: "4 min",
        featured: false,
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80",
        likes: 54,
        tags: ["Finance", "Transparency", "Q1 2026"],
    },
    {
        id: 6,
        title: "Farg'ona school gardens: 480 children, 28 schools, one year later",
        excerpt: "When we started the school garden program in Farg'ona, we expected to plant trees. We didn't expect to get letters.",
        content: "A year into the Farg'ona school garden program, something unexpected happened: children started writing to us. Not email — actual handwritten letters. Drawings of the trees they'd planted. Questions about why leaves change colour. Updates on which plants were growing fastest.\n\nThe program planted 850 fruit and shade trees across 28 schools. But the real outcome is 480 children who now understand that they can shape their environment. Several schools have started composting programs independently. Two have planted vegetable gardens using the same techniques. The ripple effects of environmental education are genuinely hard to measure.",
        category: "Community",
        author: "Jasur Toshmatov",
        authorRole: "Community Lead",
        date: "2026-03-14",
        readTime: "6 min",
        featured: false,
        image: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=900&q=80",
        likes: 189,
        tags: ["Education", "Farg'ona", "Schools"],
    },
];

const CATEGORIES = ["All", "Field Report", "Our Approach", "Science", "Community", "Transparency"];

const CAT_COLOR: Record<string, string> = {
    "Field Report": "#22C55E",
    "Our Approach": "#34D399",
    "Science": "#38BDF8",
    "Community": "#FACC15",
    "Transparency": "#F97316",
};

const UI: Record<Lang, Record<string, string>> = {
    EN: {
        eyebrow: "Yashil Qo'llar Journal",
        title: "From the",
        titleGreen: "field.",
        subtitle: "Reports, research, and honest stories from our work across Uzbekistan — the wins, the failures, and everything in between.",
        search: "Search posts…",
        featured: "Featured",
        noResults: "No posts found",
        likes: "likes",
        comments: "comments",
        reply: "Reply",
        addComment: "Add a comment…",
        post: "Post",
        cancel: "Cancel",
        readFull: "Read full article",
        close: "Close",
        share: "Share",
        copied: "Link copied!",
        tags: "Tags",
        backendHint: "Connect GET /api/posts to load real articles.",
    },
    UZ: {
        eyebrow: "Yashil Qo'llar Jurnali",
        title: "Maydondan",
        titleGreen: "hisobotlar.",
        subtitle: "O'zbekiston bo'ylab ishimiz haqida hisobotlar, tadqiqotlar va halol hikoyalar.",
        search: "Maqola qidirish…",
        featured: "Tanlangan",
        noResults: "Maqola topilmadi",
        likes: "yoqdi",
        comments: "izohlar",
        reply: "Javob",
        addComment: "Izoh qo'shish…",
        post: "Yuborish",
        cancel: "Bekor qilish",
        readFull: "To'liq o'qish",
        close: "Yopish",
        share: "Ulashish",
        copied: "Havola nusxalandi!",
        tags: "Teglar",
        backendHint: "Haqiqiy maqolalarni yuklash uchun GET /api/posts ga ulaning.",
    },
    RU: {
        eyebrow: "Журнал Yashil Qo'llar",
        title: "С",
        titleGreen: "полей.",
        subtitle: "Отчёты, исследования и честные истории о нашей работе по всему Узбекистану.",
        search: "Поиск статей…",
        featured: "Избранное",
        noResults: "Статьи не найдены",
        likes: "лайков",
        comments: "комментариев",
        reply: "Ответить",
        addComment: "Добавить комментарий…",
        post: "Отправить",
        cancel: "Отмена",
        readFull: "Читать полностью",
        close: "Закрыть",
        share: "Поделиться",
        copied: "Ссылка скопирована!",
        tags: "Теги",
        backendHint: "Подключите GET /api/posts для загрузки реальных статей.",
    },
};

// ─── Mock comments per post ────────────────────────────────────────────────────
type Comment = { id: number; author: string; avatar: string; text: string; time: string; likes: number; liked: boolean; replies: Comment[] };
const INITIAL_COMMENTS: Record<number, Comment[]> = {
    1: [
        {
            id: 1, author: "Jasur T.", avatar: "JT", text: "Incredible work. The 74% survival rate is genuinely impressive — most large-scale efforts don't get above 50%.", time: "2h ago", likes: 12, liked: false, replies: [
                { id: 11, author: "Aziz K.", avatar: "AK", text: "Thank you! The community caretaker model is the key difference.", time: "1h ago", likes: 4, liked: false, replies: [] },
            ]
        },
        { id: 2, author: "Nilufar E.", avatar: "NE", text: "The salt dust data from the basin is alarming. More people need to know about this.", time: "5h ago", likes: 8, liked: false, replies: [] },
    ],
    2: [
        { id: 3, author: "Malika Y.", avatar: "MY", text: "Counting survival rates rather than plantings changed our entire programme design.", time: "1d ago", likes: 22, liked: false, replies: [] },
    ],
    3: [],
    4: [],
    5: [],
    6: [
        { id: 4, author: "Kamila H.", avatar: "KH", text: "The letters from children are the most powerful outcome. This is how culture shifts.", time: "3d ago", likes: 31, liked: false, replies: [] },
    ],
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

// ─── Forest canvas ─────────────────────────────────────────────────────────────
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
            for (let i = 0; i < 80; i++) nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45, r: Math.random() * 2 + .5, a: Math.random() * .65 + .2, pulse: Math.random() * Math.PI * 2, ps: Math.random() * .028 + .01 });
            for (let i = 0; i < 22; i++) leaves.push({ x: Math.random() * w, y: Math.random() * h + h, vx: (Math.random() - .5) * .65, vy: -(Math.random() * .85 + .28), size: Math.random() * 11 + 5, rot: Math.random() * Math.PI * 2, vrot: (Math.random() - .5) * .022, a: Math.random() * .36 + .12, wobble: Math.random() * Math.PI * 2, ws: Math.random() * .022 + .008, hue: Math.random() * 30 });
            for (let i = 0; i < 5; i++) pulses.push({ x: Math.random() * w, y: Math.random() * h, r: 0, maxR: Math.random() * 180 + 80, speed: Math.random() * .8 + .4, delay: i * 40 });
        };
        const drawLeaf = (x: number, y: number, size: number, rot: number, alpha: number, hue: number) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha; ctx.beginPath(); ctx.moveTo(0, -size); ctx.bezierCurveTo(size * .7, -size * .6, size * .7, size * .5, 0, size * .35); ctx.bezierCurveTo(-size * .7, size * .5, -size * .7, -size * .6, 0, -size); const g = ctx.createLinearGradient(0, -size, 0, size * .35); g.addColorStop(0, `hsl(${142 + hue},80%,52%)`); g.addColorStop(1, `hsl(${155 + hue},72%,38%)`); ctx.fillStyle = g; ctx.fill(); ctx.beginPath(); ctx.moveTo(0, -size * .85); ctx.quadraticCurveTo(size * .08, 0, 0, size * .3); ctx.strokeStyle = "rgba(255,255,255,0.22)"; ctx.lineWidth = .85; ctx.stroke(); ctx.restore(); ctx.globalAlpha = 1; };
        let frame = 0;
        const tick = () => { frame++; ctx.clearRect(0, 0, w, h); for (const p of pulses) { if (frame < p.delay) continue; p.r += p.speed; if (p.r > p.maxR) { p.r = 0; p.x = Math.random() * w; p.y = Math.random() * h; p.maxR = Math.random() * 180 + 80; } const fade = 1 - p.r / p.maxR; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.strokeStyle = `rgba(34,197,94,${.18 * fade})`; ctx.lineWidth = 1.5; ctx.stroke(); } for (let i = 0; i < nodes.length; i++)for (let j = i + 1; j < nodes.length; j++) { const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, d = Math.sqrt(dx * dx + dy * dy); if (d < 155) { ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.strokeStyle = `rgba(34,197,94,${.17 * (1 - d / 155)})`; ctx.lineWidth = .78; ctx.stroke(); } } for (const n of nodes) { n.pulse += n.ps; n.x += n.vx; n.y += n.vy; if (n.x < 0) n.x = w; if (n.x > w) n.x = 0; if (n.y < 0) n.y = h; if (n.y > h) n.y = 0; const pa = n.a * (.65 + .35 * Math.sin(n.pulse)); const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5); grd.addColorStop(0, `rgba(34,197,94,${pa * .55})`); grd.addColorStop(1, "transparent"); ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill(); ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(34,197,94,${pa})`; ctx.fill(); } for (const l of leaves) { l.wobble += l.ws; l.x += l.vx + Math.sin(l.wobble) * .5; l.y += l.vy; l.rot += l.vrot; if (l.y < -30) { l.y = h + 30; l.x = Math.random() * w; } drawLeaf(l.x, l.y, l.size, l.rot, l.a, l.hue); } id = requestAnimationFrame(tick); };
        init(); tick(); window.addEventListener("resize", init);
        return () => { cancelAnimationFrame(id); window.removeEventListener("resize", init); };
    }, []);
    return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

// ─── FadeIn ────────────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [vis, setVis] = useState(false);
    useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.06 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, []);
    return <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(22px)", transition: `opacity .75s cubic-bezier(.16,1,.3,1) ${delay}ms,transform .75s cubic-bezier(.16,1,.3,1) ${delay}ms` }}>{children}</div>;
}

// ─── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ initials, size = 32 }: { initials: string; size?: number }) {
    return <div style={{ width: size, height: size, borderRadius: "50%", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * .32, fontWeight: 700, color: GREEN, flexShrink: 0 }}>{initials}</div>;
}

// ─── Category badge ────────────────────────────────────────────────────────────
function CatBadge({ cat }: { cat: string }) {
    const c = CAT_COLOR[cat] || GREEN;
    return <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 5, background: `${c}14`, color: c, border: `1px solid ${c}28` }}>{cat}</span>;
}

// ─── Comment tree ──────────────────────────────────────────────────────────────
function CommentItem({ comment, onLike, onReply, depth = 0, t }: { comment: Comment; onLike: (id: number, parentId?: number) => void; onReply: (parentId: number, text: string) => void; depth?: number; t: Record<string, string> }) {
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState("");

    const submitReply = () => {
        if (!replyText.trim()) return;
        onReply(comment.id, replyText);
        setReplyText(""); setShowReply(false);
    };

    return (
        <div style={{ marginLeft: depth > 0 ? 20 : 0, borderLeft: depth > 0 ? "1px solid rgba(34,197,94,0.15)" : "none", paddingLeft: depth > 0 ? 14 : 0 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                <Avatar initials={comment.avatar} size={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>{comment.author}</span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{comment.time}</span>
                    </div>
                    <p style={{ margin: "0 0 8px", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>{comment.text}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <button onClick={() => onLike(comment.id)} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: comment.liked ? GREEN : "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 600, padding: 0, transition: "color .18s" }}>
                            <span style={{ fontSize: 13 }}>{comment.liked ? "❤️" : "🤍"}</span>{comment.likes}
                        </button>
                        {depth < 2 && <button onClick={() => setShowReply(s => !s)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 600, padding: 0, transition: "color .18s" }}>{t.reply}</button>}
                    </div>
                    {showReply && (
                        <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "flex-start" }}>
                            <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder={t.addComment} rows={2}
                                style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 8, color: "#fff", fontSize: 12, padding: "8px 10px", fontFamily: "'Inter',sans-serif", outline: "none", resize: "vertical" }}
                                onFocus={e => { e.target.style.borderColor = GREEN + "55" }} onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.09)" }}
                            />
                            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                                <button onClick={submitReply} style={{ background: GREEN, border: "none", color: "#000", padding: "6px 12px", borderRadius: 7, fontSize: 11, fontWeight: 800, cursor: "pointer" }}>{t.post}</button>
                                <button onClick={() => setShowReply(false)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", padding: "6px 12px", borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{t.cancel}</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {comment.replies.map(r => (
                <CommentItem key={r.id} comment={r} onLike={onLike} onReply={onReply} depth={depth + 1} t={t} />
            ))}
        </div>
    );
}

// ─── Full article modal ────────────────────────────────────────────────────────
function ArticleModal({ post, onClose, comments, onLike, onAddComment, onLikeComment, onReplyComment, liked, t }: { post: typeof MOCK_POSTS[0]; onClose: () => void; comments: Comment[]; onLike: () => void; onAddComment: (text: string) => void; onLikeComment: (id: number) => void; onReplyComment: (parentId: number, text: string) => void; liked: boolean; t: Record<string, string> }) {
    const [commentText, setCommentText] = useState("");
    const [copied, setCopied] = useState(false);
    const catColor = CAT_COLOR[post.category] || GREEN;

    useEffect(() => {
        const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", esc);
        document.body.style.overflow = "hidden";
        return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
    }, [onClose]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    };

    const submitComment = () => {
        if (!commentText.trim()) return;
        onAddComment(commentText);
        setCommentText("");
    };

    return (
        <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 760, maxHeight: "92vh", overflowY: "auto", background: "#0f0f0f", borderRadius: "20px 20px 0 0", border: "1px solid rgba(34,197,94,0.2)", borderBottom: "none", animation: "slideUp .3s cubic-bezier(.16,1,.3,1)" }}>
                <style>{`@keyframes slideUp{from{transform:translateY(60px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

                {/* Hero image */}
                {post.image && <div style={{ width: "100%", height: 260, overflow: "hidden", position: "relative", flexShrink: 0 }}>
                    <img src={post.image} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(15,15,15,1) 0%,rgba(15,15,15,0.3) 50%,transparent 100%)" }} />
                    <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", borderRadius: 8, width: 34, height: 34, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>✕</button>
                </div>}

                <div style={{ padding: "28px 28px 48px" }}>
                    {!post.image && <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>}

                    {/* Meta */}
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 16 }}>
                        <CatBadge cat={post.category} />
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{post.readTime} read</span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{formatDate(post.date)}</span>
                    </div>

                    <h1 style={{ margin: "0 0 16px", fontSize: "clamp(20px,4vw,30px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15, color: "#fff" }}>{post.title}</h1>

                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                        <Avatar initials={post.author.split(" ").map(w => w[0]).slice(0, 2).join("")} />
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{post.author}</div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{post.authorRole}</div>
                        </div>
                    </div>

                    <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 24 }} />

                    {/* Body */}
                    <div style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.85, marginBottom: 28 }}>
                        {post.content.split("\n\n").map((para, i) => (
                            <p key={i} style={{ marginBottom: i < post.content.split("\n\n").length - 1 ? 18 : 0 }}>{para}</p>
                        ))}
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".12em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginRight: 4 }}>{t.tags}:</span>
                            {post.tags.map(tag => (
                                <span key={tag} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)" }}>#{tag}</span>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
                        <button onClick={onLike} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 9, background: liked ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${liked ? GREEN + "40" : "rgba(255,255,255,0.09)"}`, color: liked ? GREEN : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all .2s" }}>
                            <span>{liked ? "❤️" : "🤍"}</span>{post.likes + (liked ? 1 : 0)} {t.likes}
                        </button>
                        <button onClick={handleShare} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 9, background: copied ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: copied ? GREEN : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all .2s" }}>
                            <span>🔗</span>{copied ? t.copied : t.share}
                        </button>
                    </div>

                    {/* Comments */}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 24 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 20 }}>
                            {comments.length} {t.comments}
                        </div>

                        {/* Add comment */}
                        <div style={{ display: "flex", gap: 10, marginBottom: 24, alignItems: "flex-start" }}>
                            <Avatar initials="ME" size={30} />
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                                <textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder={t.addComment} rows={3}
                                    style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "#fff", fontSize: 13, padding: "10px 12px", fontFamily: "'Inter',sans-serif", outline: "none", resize: "vertical", boxSizing: "border-box" }}
                                    onFocus={e => { e.target.style.borderColor = GREEN + "55" }} onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.09)" }}
                                />
                                <button onClick={submitComment} style={{ alignSelf: "flex-end", background: GREEN, border: "none", color: "#000", padding: "8px 20px", borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: "pointer", letterSpacing: ".08em" }}>
                                    {t.post} →
                                </button>
                            </div>
                        </div>

                        {/* Comment list */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                            {comments.map(c => (
                                <CommentItem key={c.id} comment={c} onLike={onLikeComment} onReply={onReplyComment} t={t} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Post card ─────────────────────────────────────────────────────────────────
function PostCard({ post, onClick, liked, onLike, commentCount, delay = 0, t }: { post: typeof MOCK_POSTS[0]; onClick: () => void; liked: boolean; onLike: (e: React.MouseEvent) => void; commentCount: number; delay?: number; t: Record<string, string> }) {
    const [hov, setHov] = useState(false);
    const catColor = CAT_COLOR[post.category] || GREEN;

    return (
        <FadeIn delay={delay}>
            <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
                style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${hov ? GREEN + "35" : "rgba(255,255,255,0.07)"}`, borderRadius: 18, overflow: "hidden", cursor: "pointer", transform: hov ? "translateY(-4px)" : "none", transition: "all .25s ease", backdropFilter: "blur(8px)", display: "flex", flexDirection: "column", position: "relative" }}
            >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: hov ? `linear-gradient(90deg,transparent,${GREEN}70,transparent)` : "transparent", transition: "background .28s" }} />

                {/* Image */}
                {post.image && (
                    <div onClick={onClick} style={{ width: "100%", height: 180, overflow: "hidden", flexShrink: 0 }}>
                        <img src={post.image} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .4s ease", transform: hov ? "scale(1.04)" : "scale(1)" }} />
                    </div>
                )}

                <div onClick={onClick} style={{ padding: "18px 18px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                        <CatBadge cat={post.category} />
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{post.readTime}</span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, lineHeight: 1.3, color: "#fff" }}>{post.title}</h3>
                    <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.65, flex: 1 }}>{post.excerpt}</p>
                </div>

                <div style={{ padding: "10px 18px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Avatar initials={post.author.split(" ").map(w => w[0]).slice(0, 2).join("")} size={24} />
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{post.author.split(" ")[0]}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <button onClick={onLike} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: liked ? GREEN : "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 600, padding: 0, transition: "color .18s" }}>
                            <span style={{ fontSize: 13 }}>{liked ? "❤️" : "🤍"}</span>{post.likes + (liked ? 1 : 0)}
                        </button>
                        <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 600, padding: 0 }}>
                            <span style={{ fontSize: 13 }}>💬</span>{commentCount}
                        </button>
                    </div>
                </div>
            </div>
        </FadeIn>
    );
}

// ─── Featured card ─────────────────────────────────────────────────────────────
function FeaturedCard({ post, onClick, liked, onLike, commentCount, t }: { post: typeof MOCK_POSTS[0]; onClick: () => void; liked: boolean; onLike: (e: React.MouseEvent) => void; commentCount: number; t: Record<string, string> }) {
    const [hov, setHov] = useState(false);
    return (
        <FadeIn>
            <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
                style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${hov ? GREEN + "40" : "rgba(255,255,255,0.08)"}`, borderRadius: 20, overflow: "hidden", cursor: "pointer", transform: hov ? "translateY(-3px)" : "none", transition: "all .25s", backdropFilter: "blur(10px)", position: "relative", marginBottom: 28 }}
            >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: hov ? `linear-gradient(90deg,transparent,${GREEN},transparent)` : "transparent", transition: "background .3s" }} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 300 }}>
                    {/* Image side */}
                    {post.image && (
                        <div onClick={onClick} style={{ overflow: "hidden", position: "relative" }}>
                            <img src={post.image} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .4s", transform: hov ? "scale(1.04)" : "scale(1)" }} />
                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right,transparent 60%,rgba(10,10,10,0.8) 100%)" }} />
                        </div>
                    )}

                    {/* Content side */}
                    <div style={{ padding: "32px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div onClick={onClick}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                                <CatBadge cat={post.category} />
                                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", color: GREEN, opacity: .7 }}>{t.featured.toUpperCase()}</span>
                            </div>
                            <h2 style={{ margin: "0 0 14px", fontSize: "clamp(18px,2.5vw,26px)", fontWeight: 800, lineHeight: 1.2, color: "#fff", letterSpacing: "-0.02em" }}>{post.title}</h2>
                            <p style={{ margin: "0 0 20px", fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{post.excerpt}</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 20 }}>
                                {post.tags.map(tag => (
                                    <span key={tag} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.35)" }}>#{tag}</span>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <Avatar initials={post.author.split(" ").map(w => w[0]).slice(0, 2).join("")} size={28} />
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{post.author}</div>
                                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{formatDate(post.date)}</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 10 }}>
                                <button onClick={onLike} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: liked ? GREEN : "rgba(255,255,255,0.35)", fontSize: 12, fontWeight: 600, padding: 0, transition: "color .18s" }}>
                                    <span>{liked ? "❤️" : "🤍"}</span>{post.likes + (liked ? 1 : 0)}
                                </button>
                                <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", fontSize: 12, fontWeight: 600, padding: 0 }}>
                                    <span>💬</span>{commentCount}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FadeIn>
    );
}

// ─── Main BlogPage ─────────────────────────────────────────────────────────────
export function BlogPage() {
    const [lang, setLang] = useState<Lang>("EN");
    const [category, setCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [activePost, setActivePost] = useState<typeof MOCK_POSTS[0] | null>(null);
    const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
    const [comments, setComments] = useState<Record<number, Comment[]>>(INITIAL_COMMENTS);

    const t = UI[lang];
    const LANGS: Lang[] = ["EN", "UZ", "RU"];

    // post-level like toggle
    const toggleLike = (id: number) => {
        setLikedPosts(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    // comment like
    const likeComment = (commentId: number, postId: number) => {
        setComments(prev => {
            const clone = JSON.parse(JSON.stringify(prev));
            const toggleInList = (list: Comment[]) => {
                for (const c of list) {
                    if (c.id === commentId) { c.liked = !c.liked; c.likes += c.liked ? 1 : -1; return; }
                    toggleInList(c.replies);
                }
            };
            toggleInList(clone[postId] || []);
            return clone;
        });
    };

    // add top-level comment
    const addComment = (postId: number, text: string) => {
        const nc: Comment = { id: Date.now(), author: "You", avatar: "ME", text, time: "just now", likes: 0, liked: false, replies: [] };
        setComments(prev => ({ ...prev, [postId]: [nc, ...(prev[postId] || [])] }));
    };

    // add reply
    const addReply = (postId: number, parentId: number, text: string) => {
        setComments(prev => {
            const clone = JSON.parse(JSON.stringify(prev));
            const addInList = (list: Comment[]) => {
                for (const c of list) {
                    if (c.id === parentId) { c.replies.push({ id: Date.now(), author: "You", avatar: "ME", text, time: "just now", likes: 0, liked: false, replies: [] }); return; }
                    addInList(c.replies);
                }
            };
            addInList(clone[postId] || []);
            return clone;
        });
    };

    const featured = MOCK_POSTS.find(p => p.featured);
    const rest = MOCK_POSTS.filter(p => !p.featured)
        .filter(p => category === "All" || p.category === category)
        .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase()));

    const getCommentCount = (postId: number): number => {
        const countAll = (list: Comment[]): number => list.reduce((acc, c) => acc + 1 + countAll(c.replies), 0);
        return countAll(comments[postId] || []);
    };

    return (
        <div style={{ minHeight: "100vh", background: DARK, color: "#fff", fontFamily: "'Inter','Helvetica Neue',sans-serif", position: "relative", overflowX: "hidden" }}>
            <ForestCanvas />
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 75% 55% at 10% 15%, rgba(34,197,94,0.09) 0%, transparent 58%), radial-gradient(ellipse 55% 45% at 90% 85%, rgba(34,197,94,0.05) 0%, transparent 55%)" }} />

            <main style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "clamp(100px,12vw,130px) clamp(16px,5vw,60px) 100px" }}>

                {/* ── Header ── */}
                <FadeIn>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 48 }}>
                        <div style={{ flex: 1, minWidth: 260 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                                <span style={{ width: 28, height: 1.5, background: GREEN, borderRadius: 2, display: "inline-block" }} />
                                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".28em", textTransform: "uppercase", color: GREEN }}>{t.eyebrow}</span>
                            </div>
                            <h1 style={{ margin: "0 0 12px", fontSize: "clamp(36px,6vw,64px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1 }}>
                                <span style={{ color: "#fff" }}>{t.title} </span>
                                <span style={{ color: GREEN, textShadow: "0 0 60px rgba(34,197,94,0.4)" }}>{t.titleGreen}</span>
                            </h1>
                            <p style={{ margin: 0, fontSize: 15, color: "rgba(255,255,255,0.38)", maxWidth: 520, lineHeight: 1.75 }}>{t.subtitle}</p>
                        </div>
                        <div style={{ display: "flex", gap: 6, flexShrink: 0, alignSelf: "flex-start", marginTop: 8 }}>
                            {LANGS.map(l => (
                                <button key={l} onClick={() => setLang(l)} style={{ padding: "7px 14px", borderRadius: 8, cursor: "pointer", background: lang === l ? `${GREEN}18` : "rgba(255,255,255,0.04)", border: `1px solid ${lang === l ? GREEN + "45" : "rgba(255,255,255,0.09)"}`, color: lang === l ? GREEN : "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 800, letterSpacing: ".1em", transition: "all .18s", fontFamily: "'Inter',sans-serif" }}>{l}</button>
                            ))}
                        </div>
                    </div>
                </FadeIn>

                {/* ── Search + filters ── */}
                <FadeIn delay={70}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 40 }}>
                        <div style={{ position: "relative", flex: "1", minWidth: 200, maxWidth: 320 }}>
                            <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "rgba(255,255,255,0.2)", pointerEvents: "none" }}>🔍</span>
                            <input type="text" placeholder={t.search} value={search} onChange={e => setSearch(e.target.value)}
                                style={{ width: "100%", padding: "9px 14px 9px 38px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "#fff", fontSize: 13, fontFamily: "'Inter',sans-serif", outline: "none", boxSizing: "border-box", transition: "border-color .2s" }}
                                onFocus={e => { e.target.style.borderColor = GREEN + "55" }} onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.09)" }}
                            />
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {CATEGORIES.map(cat => {
                                const active = category === cat;
                                const c = cat === "All" ? GREEN : (CAT_COLOR[cat] || GREEN);
                                return (
                                    <button key={cat} onClick={() => setCategory(cat)} style={{ background: active ? `${c}18` : "rgba(255,255,255,0.04)", border: `1px solid ${active ? c + "45" : "rgba(255,255,255,0.08)"}`, color: active ? c : "rgba(255,255,255,0.45)", padding: "7px 14px", borderRadius: 999, fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", cursor: "pointer", transition: "all .15s" }}>
                                        {cat !== "All" && <span style={{ width: 5, height: 5, borderRadius: "50%", background: c, display: "inline-block", marginRight: 6, verticalAlign: "middle" }} />}{cat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </FadeIn>

                {/* ── Featured ── */}
                {featured && category === "All" && !search && (
                    <FeaturedCard post={featured} onClick={() => setActivePost(featured)} liked={likedPosts.has(featured.id)} onLike={e => { e.stopPropagation(); toggleLike(featured.id); }} commentCount={getCommentCount(featured.id)} t={t} />
                )}

                {/* ── Grid ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 18 }}>
                    {rest.length === 0 ? (
                        <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.25)", fontSize: 14 }}>{t.noResults}{search ? ` for "${search}"` : ""}.</div>
                    ) : (
                        rest.map((post, i) => (
                            <PostCard key={post.id} post={post} onClick={() => setActivePost(post)} liked={likedPosts.has(post.id)} onLike={e => { e.stopPropagation(); toggleLike(post.id); }} commentCount={getCommentCount(post.id)} delay={i * 55} t={t} />
                        ))
                    )}
                </div>
            </main>

            {/* ── Article modal ── */}
            {activePost && (
                <ArticleModal
                    post={activePost}
                    onClose={() => setActivePost(null)}
                    comments={comments[activePost.id] || []}
                    onLike={() => toggleLike(activePost.id)}
                    onAddComment={text => addComment(activePost.id, text)}
                    onLikeComment={id => likeComment(id, activePost.id)}
                    onReplyComment={(parentId, text) => addReply(activePost.id, parentId, text)}
                    liked={likedPosts.has(activePost.id)}
                    t={t}
                />
            )}

            <style>{`input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.2)} input,textarea{color-scheme:dark}`}</style>
        </div>
    );
}