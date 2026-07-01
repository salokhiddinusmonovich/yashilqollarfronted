export const API_BASE =
    import.meta.env.VITE_API_BASE?.replace(/\/$/, "") ||
    "https://chug-subpar-graves.ngrok-free.dev";

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
} as const;

export function baseHeaders(lang: string, extra?: Record<string, string>) {
    return {
        "Accept-Language": lang,
        "ngrok-skip-browser-warning": "true",
        ...extra,
    };
}

export function absMediaUrl(path: string | null): string | null {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}