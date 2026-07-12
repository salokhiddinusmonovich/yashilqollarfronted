// src/config/api.ts
//
// Единая точка правды для адреса бэкенда.
// На Vercel задаётся через переменную окружения VITE_API_BASE
// (Project Settings → Environments → [Production/Preview/Development] → Environment Variables).
// Локально можно положить .env файл рядом с package.json:
//
//   VITE_API_BASE=http://173.249.19.32:8000
//
// (или на https://api.yashilqollar.uz, если уже настроен на этом IP)
//
// Если переменная не задана — используется реальный прод-бэкенд как fallback.

export const API_BASE =
    import.meta.env.VITE_API_BASE?.replace(/\/$/, "") ||
    "https://api.yashilqollar.uz";

/* ─────────────────────────────────────────
   СХЕМА ПУТЕЙ БЭКЕНДА (без /api/, без /auth/ —
   /api/docs/ это ТОЛЬКО путь для Swagger-документации,
   сами эндпоинты ниже префикса не имеют)

     POST  /login/                 (Telegram widget)
     POST  /register/              (email + password)          НОВОЕ
     POST  /login/password/        (email + password)          НОВОЕ
     POST  /login/google/          (Google id_token)            НОВОЕ
     POST  /logout/
     POST  /token/refresh/
     GET   /me/            (PATCH тоже)
     GET   /team/
     GET   /blog/
     GET   /blog/<slug>/
     POST  /blog/<slug>/comment/
     POST  /blog/<slug>/like/
     POST  /comment/<id>/like/
───────────────────────────────────────── */
export const ENDPOINTS = {
    login: `${API_BASE}/login/`,
    register: `${API_BASE}/register/`,
    loginPassword: `${API_BASE}/login/password/`,
    loginGoogle: `${API_BASE}/login/google/`,
    logout: `${API_BASE}/logout/`,
    tokenRefresh: `${API_BASE}/token/refresh/`,
    me: `${API_BASE}/me/`,
    team: `${API_BASE}/team/`,
    blog: `${API_BASE}/blog/`,
    blogDetail: (slug: string) => `${API_BASE}/blog/${slug}/`,
    blogComment: (slug: string) => `${API_BASE}/blog/${slug}/comment/`,
    blogLike: (slug: string) => `${API_BASE}/blog/${slug}/like/`,
    commentLike: (id: number | string) => `${API_BASE}/comment/${id}/like/`,
    loginToken: `${API_BASE}/login/token/`,
    loginTokenStatus: (token: string) => `${API_BASE}/login/token/${token}/`,
    projects: `${API_BASE}/projects/`,
    projectDetail: (id: number | string) => `${API_BASE}/projects/${id}/`,
    projectJoin: (id: number | string) => `${API_BASE}/projects/${id}/join/`,
    projectLike: (id: number | string) => `${API_BASE}/projects/${id}/like/`,
    projectComment: (id: number | string) => `${API_BASE}/projects/${id}/comment/`,
    projectCommentLike: (id: number | string) => `${API_BASE}/project-comment/${id}/like/`,
    teamByRegion: (region: string) => `${API_BASE}/team/region/${region}/`,
    userProfile: (id: number | string) => `${API_BASE}/users/${id}/profile/`,
} as const;

/**
 * Заголовки, обязательные почти для каждого запроса:
 * - Accept-Language: чтобы бэкенд вернул текст на нужном языке
 * - ngrok-skip-browser-warning: раньше требовался для бесплатного ngrok-туннеля.
 *   Теперь бэкенд на реальном домене — заголовок безвреден (сервер его просто
 *   игнорирует), но если хочешь окончательно убрать зависимость от ngrok-эпохи,
 *   можешь удалить эту строку.
 */
export function baseHeaders(lang: string, extra?: Record<string, string>) {
    return {
        "Accept-Language": lang,
        "ngrok-skip-browser-warning": "true",
        ...extra,
    };
}

/** Абсолютный URL для media-файлов (фото и т.п.), если бэкенд вдруг
 * вернёт относительный путь вместо готового абсолютного. */
export function absMediaUrl(path: string | null): string | null {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * Приводит ссылку на медиа-файл в "рабочее" состояние:
 * 1. Строит абсолютный URL, если бэкенд отдал относительный путь.
 * 2. Форсирует https — если бэкенд вернул http:// (например, всё ещё отдаёт
 *    ссылки на IP без SSL), браузер на HTTPS-странице (Vercel) тихо
 *    блокирует такую картинку как Mixed Content, без явной ошибки в консоли.
 *    ⚠️ Если бэкенд реально доступен только по http://173.249.19.32:8000
 *    (ещё без SSL-сертификата на домене), эта принудительная замена на
 *    https сломает картинки — тогда временно закомментируй строку ниже,
 *    пока не будет настроен SSL на api.yashilqollar.uz (например, через
 *    Let's Encrypt/Certbot или прокси типа Nginx/Caddy).
 * 3. Добавляет query-параметр ngrok-skip-browser-warning — безвреден на
 *    реальном домене, оставлен для обратной совместимости.
 */
export function fixMediaUrl(path: string | null): string | null {
    let url = absMediaUrl(path);
    if (!url) return url;

    url = url.replace(/^http:\/\//, "https://");

    if (url.includes("ngrok-free.")) {
        url += (url.includes("?") ? "&" : "?") + "ngrok-skip-browser-warning=true";
    }

    return url;
}