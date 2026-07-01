import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "volunteer" | "admin";

export interface User {
  id: number;
  tg_id: number;
  fullname: string;
  username: string | null;
  photo: string | null;
  region: string | null;
  balance: number;
  rank: string;
  role: UserRole;
  experience: string | null;
  education_place: string | null;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  loginWithTelegram: (tgData: TelegramAuthData) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

// Shape Telegram sends to your widget callback
export interface TelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  accessToken: null,
  isLoggedIn: false,
  loading: true,
  loginWithTelegram: async () => ({ ok: false }),
  logout: async () => {},
});

const API_BASE =  "http://localhost:8000";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("access_token")
  );
  const [loading, setLoading] = useState(true);

  // On mount: restore session using saved access token
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) { setLoading(false); return; }
      try {
        const res = await fetch(`${API_BASE}/api/auth/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setAccessToken(token);
        } else {
          // Try refresh
          await tryRefresh();
        }
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const tryRefresh = async () => {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) { clearAuth(); return; }
    try {
      const res = await fetch(`${API_BASE}/api/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("access_token", data.access);
        setAccessToken(data.access);
        // Now fetch user
        const meRes = await fetch(`${API_BASE}/api/auth/me/`, {
          headers: { Authorization: `Bearer ${data.access}` },
        });
        if (meRes.ok) setUser(await meRes.json());
      } else {
        clearAuth();
      }
    } catch {
      clearAuth();
    }
  };

  const clearAuth = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setAccessToken(null);
  };

  // Called by TelegramLoginButton after Telegram widget returns data
  const loginWithTelegram = async (tgData: TelegramAuthData) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tgData),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.error || "Login failed" };

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      setAccessToken(data.access);
      setUser(data.user);
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error" };
    }
  };

  const logout = async () => {
    const refresh = localStorage.getItem("refresh_token");
    try {
      await fetch(`${API_BASE}/api/auth/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refresh }),
      });
    } catch {}
    clearAuth();
  };

  return (
    <AuthContext.Provider value={{
      user, accessToken, isLoggedIn: !!user,
      loading, loginWithTelegram, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);