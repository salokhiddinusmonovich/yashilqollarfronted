import { Link } from "react-router-dom";
import { ProfileDropdown } from "./ProfileDropdown";
import { useLang } from "../../../contexts/LanguageContext";

const GREEN = "#22C55E";

export function DesktopActions() {
    const { lang, setLang } = useLang();

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Language switcher */}
            <button
                onClick={() => setLang(lang === "en" ? "uz" : "en")}
                style={{
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.55)",
                    padding: "6px 12px", borderRadius: 7,
                    fontSize: 11, fontWeight: 700,
                    cursor: "pointer", letterSpacing: ".08em",
                    fontFamily: "'Montserrat',sans-serif",
                    transition: "all .2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(34,197,94,0.4)"; (e.currentTarget as HTMLElement).style.color = GREEN; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}
            >
                {lang === "en" ? "UZ" : "EN"}
            </button>

            {/* Profile dropdown handles both logged-in and logged-out states */}
            <ProfileDropdown />
        </div>
    );
}