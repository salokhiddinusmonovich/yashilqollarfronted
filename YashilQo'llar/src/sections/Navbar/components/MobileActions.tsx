import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { fixMediaUrl } from "../../../config/api";

const GREEN = "#22C55E";

export const MobileActions = ({
    open,
    onToggle,
}: {
    open: boolean;
    onToggle: () => void;
}) => {
    const { user, isLoggedIn } = useAuth();

    return (
        <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 min-h-[auto] min-w-[auto] outline-[3px] gap-y-2 no-underline md:hidden">
            {isLoggedIn && user ? (
                <Link to="/profile" aria-label="Profile" style={{
                    width: 34, height: 34, borderRadius: "50%", flexShrink: 0, overflow: "hidden",
                    background: GREEN, border: `1.5px solid ${GREEN}80`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 800, color: "#04140a", textDecoration: "none",
                }}>
                    {fixMediaUrl(user.photo) ? (
                        <img src={fixMediaUrl(user.photo)!} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        user.fullname.split(" ").filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase()
                    )}
                </Link>
            ) : (
                <Link to="/login" style={{
                    background: GREEN, color: "#000", border: "none",
                    padding: "7px 14px", borderRadius: 8,
                    fontSize: 10.5, fontWeight: 800, letterSpacing: ".06em",
                    textDecoration: "none", fontFamily: "'Montserrat',sans-serif",
                    whiteSpace: "nowrap",
                }}>
                    LOGIN
                </Link>
            )}

            <button
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={onToggle}
                className="items-center bg-white/5 caret-transparent flex text-[13.3333px] h-[42px] justify-center leading-[normal] min-h-[auto] min-w-[auto] outline-[3px] text-center no-underline w-[42px] border p-0 rounded-[10px] border-white/10 transition-colors hover:bg-white/10"
            >
                <div className="box-border caret-transparent gap-x-[5px] flex flex-col min-h-[auto] min-w-[auto] outline-[3px] gap-y-[5px] no-underline w-5">
                    {open ? (
                        <>
                            <span className="bg-white/80 block h-0.5 w-full rounded-sm rotate-45 translate-y-[7px] transition-transform"></span>
                            <span className="bg-white/80 block h-0.5 w-full rounded-sm opacity-0 transition-opacity"></span>
                            <span className="bg-white/80 block h-0.5 w-full rounded-sm -rotate-45 -translate-y-[7px] transition-transform"></span>
                        </>
                    ) : (
                        <>
                            <span className="bg-white/80 block h-0.5 w-full rounded-sm transition-transform"></span>
                            <span className="bg-white/80 block h-0.5 w-full rounded-sm transition-opacity"></span>
                            <span className="bg-white/80 block h-0.5 w-full rounded-sm transition-transform"></span>
                        </>
                    )}
                </div>
            </button>
        </div>
    );
};
