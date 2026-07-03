import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const GREEN = "#22C55E";

export function ProjectsPage() {
    const { user, isLoggedIn, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isLoggedIn) navigate("/login");
    }, [loading, isLoggedIn]);

    if (loading || !user) {
        return (
            <div style={{ minHeight: "100vh", background: "#060606", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: "'Inter',sans-serif" }}>Loading…</span>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#060606", fontFamily: "'Inter',sans-serif", color: "#fff", padding: "clamp(88px,12vw,110px) clamp(16px,5vw,60px) 80px" }}>
            <div style={{ maxWidth: 640, margin: "0 auto" }}>
                <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 800 }}>My Projects</h1>
                <p style={{ margin: "0 0 32px", fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
                    Ты участвовал в <strong style={{ color: GREEN }}>{user.projects_count}</strong> проектах.
                </p>

                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "48px 32px", textAlign: "center" }}>
                    <div style={{ fontSize: 32, marginBottom: 14 }}>🌿</div>
                    <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>
                        Список конкретных проектов появится здесь, когда на бэкенде будет готов эндпоинт
                        <code style={{ color: "rgba(255,255,255,0.5)" }}> /projects/</code> с твоими заявками (модель <code style={{ color: "rgba(255,255,255,0.5)" }}>ProjectParticipation</code> уже есть в базе, не хватает только API).
                    </p>
                </div>
            </div>
        </div>
    );
}
