import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ENDPOINTS, baseHeaders } from "../config/api";

/* ─────────────────────────────────────────
   ТИПЫ — соответствуют ProfileSerializer
───────────────────────────────────────── */
export interface User {
  tg_id: number;
  fullname: string;
  username: string | null;
  photo: string | null;
  region: string | null;
  balance: number;
  rank: string;
  projects_count: number;
  age: number | null;
  email: string;
  phone: string;
  education_place: string | null;
  experience: string | null;
  role: string;
}

export interface TelegramWidgetData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isDevMode: boolean;
  loading: boolean;
  loginWithTelegram: (data: TelegramWidgetData) => Promise<{ ok: boolean; error?: string }>;
  loginDev: () => void;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<User>) => Promise<{ ok: boolean; error?: string }>;
  refetchProfile: () => Promise<void>;
}

const ACCESS_KEY = "yq_access_token";
const REFRESH_KEY = "yq_refresh_token";
const DEV_MODE_KEY = "yq_dev_mode";

const DEV_MOCK_USER: User = {
  tg_id: 999999999,
  fullname: "Dev Tester",
  username: "dev_tester",
  photo: null,
  region: "tashkent_s",
  balance: 120,
  rank: "🌱 Nihol (Росток)",
  projects_count: 2,
  age: 20,
  email: "dev@example.com",
  phone: "+998900000000",
  education_place: "TDTU",
  experience: "Dev mode test account",
  role: "volunteer",
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isDevMode: false,
  loading: true,
  loginWithTelegram: async () => ({ ok: false }),
  loginDev: () => {},
  logout: async () => {},
  updateProfile: async () => ({ ok: false }),
  refetchProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isDevMode, setIsDevMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // ─── Восстановление сессии при загрузке страницы ───
  useEffect(() => {
    const dev = localStorage.getItem(DEV_MODE_KEY);
    if (dev === "1") {
      setUser(DEV_MOCK_USER);
      setIsDevMode(true);
      setLoading(false);
      return;
    }

    const access = localStorage.getItem(ACCESS_KEY);
    if (!access) {
      setLoading(false);
      return;
    }

    fetchProfile().finally(() => setLoading(false));
  }, []);

  // ─── GET /me/ с автообновлением токена при 401 ───
  async function fetchProfile(retried = false): Promise<void> {
    const access = localStorage.getItem(ACCESS_KEY);
    if (!access) return;

    const res = await fetch(ENDPOINTS.me, {
      headers: baseHeaders("en", { Authorization: `Bearer ${access}` }),
    });

    if (res.status === 401 && !retried) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        return fetchProfile(true);
      }
      logoutLocal();
      return;
    }

    if (!res.ok) {
      logoutLocal();
      return;
    }

    const data: User = await res.json();
    setUser(data);
  }

  async function tryRefreshToken(): Promise<boolean> {
    const refresh = localStorage.getItem(REFRESH_KEY);
    if (!refresh) return false;

    try {
      const res = await fetch(ENDPOINTS.tokenRefresh, {
        method: "POST",
        headers: baseHeaders("en", { "Content-Type": "application/json" }),
        body: JSON.stringify({ refresh }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (!data.access) return false;
      localStorage.setItem(ACCESS_KEY, data.access);
      return true;
    } catch {
      return false;
    }
  }

  function logoutLocal() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(DEV_MODE_KEY);
    setUser(null);
    setIsDevMode(false);
  }

  // ─── Вход через настоящий Telegram Login Widget ───
  const loginWithTelegram = async (data: TelegramWidgetData) => {
    try {
      const res = await fetch(ENDPOINTS.login, {
        method: "POST",
        headers: baseHeaders("en", { "Content-Type": "application/json" }),
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { ok: false, error: err.error || "Telegram login failed." };
      }

      const result = await res.json();
      localStorage.setItem(ACCESS_KEY, result.access);
      localStorage.setItem(REFRESH_KEY, result.refresh);
      localStorage.removeItem(DEV_MODE_KEY);
      setIsDevMode(false);
      setUser(result.user);
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error. Check your connection." };
    }
  };

  // ─── Dev-режим — временный вход без реального бэкенда ───
  const loginDev = () => {
    localStorage.setItem(DEV_MODE_KEY, "1");
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    setIsDevMode(true);
    setUser(DEV_MOCK_USER);
  };

  const logout = async () => {
    if (!isDevMode) {
      const refresh = localStorage.getItem(REFRESH_KEY);
      if (refresh) {
        try {
          await fetch(ENDPOINTS.logout, {
            method: "POST",
            headers: baseHeaders("en", { "Content-Type": "application/json" }),
            body: JSON.stringify({ refresh }),
          });
        } catch {
          /* даже если запрос не прошёл — всё равно чистим локально */
        }
      }
    }
    logoutLocal();
  };

  const updateProfile = async (patch: Partial<User>) => {
    if (isDevMode) {
      setUser(prev => (prev ? { ...prev, ...patch } : prev));
      return { ok: true };
    }

    const access = localStorage.getItem(ACCESS_KEY);
    if (!access) return { ok: false, error: "Not authenticated." };

    try {
      const res = await fetch(ENDPOINTS.me, {
        method: "PATCH",
        headers: baseHeaders("en", {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(patch),
      });

      if (res.status === 401) {
        const refreshed = await tryRefreshToken();
        if (refreshed) return updateProfile(patch);
        logoutLocal();
        return { ok: false, error: "Session expired, please log in again." };
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { ok: false, error: err.detail || "Failed to update profile." };
      }

      const data: User = await res.json();
      setUser(data);
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error." };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isDevMode,
        loading,
        loginWithTelegram,
        loginDev,
        logout,
        updateProfile,
        refetchProfile: () => fetchProfile(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
