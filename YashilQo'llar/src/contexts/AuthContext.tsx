import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "Volunteer" | "Organizer" | "Researcher" | "Admin";

export interface User {
    id: string;
    name: string;
    username: string;
    avatar: string;
    role: UserRole;
    region: string;
    treesPlanted: number;
    projectsJoined: number;
    points: number;
    joinedDate: string;
    bio: string;
    badges: string[];
}

interface RegisterData {
    name: string;
    username: string;
    email: string;
    password: string;
    region: string;
    role: UserRole;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
    register: (data: RegisterData) => Promise<{ ok: boolean; error?: string }>;
    logout: () => void;
    isLoggedIn: boolean;
}

const MOCK_USERS: (User & { email: string; password: string })[] = [
    {
        id: "u1", name: "Aziz Karimov", username: "aziz_k",
        email: "aziz@yashilqollar.uz", password: "demo123",
        avatar: "AK", role: "Organizer", region: "Toshkent",
        treesPlanted: 3400, projectsJoined: 14, points: 8820,
        joinedDate: "2022-03-15",
        bio: "Founder of Yashil Qo'llar.",
        badges: ["🌳 Pioneer", "🏆 Top Organizer", "🌍 5-Region"],
    },
    {
        id: "u2", name: "Malika Yusupova", username: "malika_y",
        email: "malika@yashilqollar.uz", password: "demo123",
        avatar: "MY", role: "Researcher", region: "Samarqand",
        treesPlanted: 1200, projectsJoined: 8, points: 4400,
        joinedDate: "2023-01-10",
        bio: "Reforestation scientist.",
        badges: ["🔬 Researcher", "🌱 1000 Trees"],
    },
    {
        id: "u3", name: "Jasur Toshmatov", username: "jasur_t",
        email: "jasur@yashilqollar.uz", password: "demo123",
        avatar: "JT", role: "Volunteer", region: "Namangan",
        treesPlanted: 780, projectsJoined: 6, points: 2960,
        joinedDate: "2023-06-22",
        bio: "Community organizer from Namangan.",
        badges: ["🤝 Community Lead", "🌱 500 Trees"],
    },
];

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => ({ ok: false }),
    register: async () => ({ ok: false }),
    logout: () => { },
    isLoggedIn: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password: string) => {
        // TODO: replace with → fetch("/api/auth/login", { method:"POST", body: JSON.stringify({email,password}) })
        await new Promise(r => setTimeout(r, 600));
        const found = MOCK_USERS.find(u => u.email === email && u.password === password);
        if (!found) return { ok: false, error: "Invalid email or password." };
        const { password: _p, email: _e, ...clean } = found;
        setUser(clean);
        return { ok: true };
    };

    const register = async (data: RegisterData) => {
        // TODO: replace with → fetch("/api/auth/register", { method:"POST", body: JSON.stringify(data) })
        await new Promise(r => setTimeout(r, 800));
        const exists = MOCK_USERS.find(u => u.email === data.email || u.username === data.username);
        if (exists) return { ok: false, error: "Email or username already taken." };
        const newUser: User = {
            id: `u${Date.now()}`,
            name: data.name,
            username: data.username,
            avatar: data.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase(),
            role: data.role,
            region: data.region,
            treesPlanted: 0,
            projectsJoined: 0,
            points: 0,
            joinedDate: new Date().toISOString().split("T")[0],
            bio: "",
            badges: ["🌱 New Member"],
        };
        setUser(newUser);
        return { ok: true };
    };

    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoggedIn: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
