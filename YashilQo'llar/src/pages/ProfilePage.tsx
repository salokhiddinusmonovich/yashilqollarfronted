import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const GREEN = "#22C55E";

const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 10, color: "#fff", fontSize: 13,
    fontFamily: "'Inter',sans-serif", outline: "none",
    boxSizing: "border-box", transition: "border-color .2s, background .2s",
};
const labelStyle: React.CSSProperties = {
    fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)",
    letterSpacing: ".14em", textTransform: "uppercase",
    display: "block", marginBottom: 7,
};
const focus = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = GREEN + "55"; e.target.style.background = "rgba(34,197,94,0.05)"; };
const blur = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; e.target.style.background = "rgba(255,255,255,0.04)"; };

export function ProfilePage() {
    const { user, isLoggedIn, loading: authLoading, updateProfile } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", phone: "", age: "", education_place: "", experience: "" });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!authLoading && !isLoggedIn) navigate("/login");
    }, [authLoading, isLoggedIn]);

    useEffect(() => {
        if (user) {
            setForm({
                email: user.email || "",
                phone: user.phone || "",
                age: user.age?.toString() || "",
                education_place: user.education_place || "",
                experience: user.experience || "",
            });
        }
    }, [user]);

    if (authLoading || !user) {
        return (
            <div style={{ minHeight: "100vh", background: "#060606", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: "'Inter',sans-serif" }}>Loading…</span>
            </div>
        );
    }

    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); setSaved(false); setSaving(true);
        const res = await updateProfile({
            email: form.email,
            phone: form.phone,
            age: form.age ? Number(form.age) : null,
            education_place: form.education_place,
            experience: form.experience,
        } as any);
        setSaving(false);
        if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
        else setError(res.error || "Failed to save.");
    };

    return (
        <div style={{ minHeight: "100vh", background: "#060606", fontFamily: "'Inter',sans-serif", color: "#fff", padding: "clamp(88px,12vw,110px) clamp(16px,5vw,60px) 80px" }}>
            <div style={{ maxWidth: 640, margin: "0 auto" }}>

                {/* Header card */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: "50%", background: GREEN,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 22, fontWeight: 800, color: "#04140a", flexShrink: 0, overflow: "hidden",
                    }}>
                        {user.fullname.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}
                    </div>
                    <div>
                        <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800 }}>{user.fullname}</h1>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 5, background: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}30` }}>{user.role}</span>
                            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{user.rank}</span>
                        </div>
                    </div>
                </div>

                {/* Stats strip */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 1, background: `${GREEN}10`, borderRadius: 14, overflow: "hidden", border: `1px solid ${GREEN}18`, marginBottom: 32 }}>
                    <div style={{ padding: "18px", background: "rgba(6,6,6,0.9)", textAlign: "center" }}>
                        <div style={{ fontSize: 26, fontWeight: 800, color: GREEN }}>{user.balance}</div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 4, letterSpacing: ".08em", textTransform: "uppercase" }}>Points</div>
                    </div>
                    <div style={{ padding: "18px", background: "rgba(6,6,6,0.9)", textAlign: "center" }}>
                        <div style={{ fontSize: 26, fontWeight: 800, color: GREEN }}>{user.projects_count}</div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 4, letterSpacing: ".08em", textTransform: "uppercase" }}>Projects</div>
                    </div>
                </div>

                {/* Edit form */}
                <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(34,197,94,0.18)", borderRadius: 18, padding: "28px 24px" }}>
                    <p style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.25)", letterSpacing: ".2em", textTransform: "uppercase", margin: "0 0 20px" }}>
                        Дозаполнить профиль
                    </p>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div>
                                <label style={labelStyle}>Email</label>
                                <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" style={inputStyle} onFocus={focus} onBlur={blur} />
                            </div>
                            <div>
                                <label style={labelStyle}>Phone</label>
                                <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+998901234567" style={inputStyle} onFocus={focus} onBlur={blur} />
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle}>Age</label>
                            <input type="number" value={form.age} onChange={e => set("age", e.target.value)} placeholder="20" style={inputStyle} onFocus={focus} onBlur={blur} />
                        </div>
                        <div>
                            <label style={labelStyle}>Education place</label>
                            <input type="text" value={form.education_place} onChange={e => set("education_place", e.target.value)} placeholder="TDTU" style={inputStyle} onFocus={focus} onBlur={blur} />
                        </div>
                        <div>
                            <label style={labelStyle}>Experience</label>
                            <input type="text" value={form.experience} onChange={e => set("experience", e.target.value)} placeholder="Tell about yourself" style={inputStyle} onFocus={focus} onBlur={blur} />
                        </div>

                        {error && (
                            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 9, padding: "10px 14px", fontSize: 13, color: "#f87171" }}>{error}</div>
                        )}
                        {saved && (
                            <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 9, padding: "10px 14px", fontSize: 13, color: GREEN }}>✓ Saved</div>
                        )}

                        <button type="submit" disabled={saving} style={{
                            padding: "13px", background: saving ? "rgba(34,197,94,0.4)" : GREEN,
                            border: "none", color: saving ? GREEN : "#000", borderRadius: 10,
                            fontSize: 12, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase",
                            cursor: saving ? "wait" : "pointer", fontFamily: "'Montserrat',sans-serif",
                        }}>
                            {saving ? "Saving…" : "Save changes"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
