// src/config/api.ts
//
// Единая точка правды для адреса бэкенда.
// На Vercel задаётся через переменную окружения VITE_API_BASE
// (Project Settings → Environment Variables).
// Локально можно положить .env файл рядом с package.json:
//
//   VITE_API_BASE=https://chug-subpar-graves.ngrok-free.dev
//
// Если переменная не задана — используется текущий ngrok-адрес как fallback.

export const API_BASE =
    import.meta.env.VITE_API_BASE?.replace(/\/$/, "") ||
    "https://chug-subpar-graves.ngrok-free.dev";

/* ─────────────────────────────────────────
   СХЕМА ПУТЕЙ БЭКЕНДА (без /api/, без /auth/)
   Подтверждено curl на localhost:8000:

     POST  /login/
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
} as const;

/**
 * Заголовки, обязательные почти для каждого запроса:
 * - Accept-Language: чтобы бэкенд вернул текст на нужном языке
 * - ngrok-skip-browser-warning: чтобы бесплатный ngrok не подсовывал
 *   HTML-заглушку вместо JSON (актуально, пока бэкенд за ngrok;
 *   после переезда на настоящий домен этот заголовок можно убрать,
 *   он просто будет игнорироваться сервером — не критично оставлять).
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
 * 2. Форсирует https — если бэкенд (через ngrok) вернул http://,
 *    браузер на HTTPS-странице (Vercel) тихо блокирует такую картинку
 *    как Mixed Content, без явной ошибки в консоли.
 * 3. Добавляет query-параметр ngrok-skip-browser-warning — тег <img>
 *    не может отправлять кастомные заголовки (в отличие от fetch),
 *    поэтому это единственный способ обойти HTML-заглушку ngrok "Visit Site".
 *
 * Используй эту функцию для ЛЮБОГО <img src> с бэкенда, а не только в TeamPage.
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