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
    const photoUrl = isLoggedIn && user ? fixMediaUrl(user.photo) : null;
    const initials = isLoggedIn && user
        ? user.fullname.split(" ").filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase()
        : "";

    return (
        <div className="items-center box-border caret-transparent flex shrink-0 min-h-[auto] min-w-[auto] outline-[3px] no-underline md:hidden">
            {/* ОДНА кнопка: и профиль, и навигация открываются отсюда */}
            <button
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={onToggle}
                className="items-center bg-white/5 caret-transparent flex justify-center leading-[normal] min-h-[auto] min-w-[auto] outline-[3px] text-center no-underline border p-0 rounded-[10px] border-white/10 transition-colors hover:bg-white/10"
                style={{ width: 38, height: 38, gap: 8, paddingLeft: isLoggedIn ? 4 : 0, paddingRight: isLoggedIn ? 4 : 0 }}
            >
                {isLoggedIn && user && (
                    <div style={{
                        width: 26, height: 26, borderRadius: "50%", flexShrink: 0, overflow: "hidden",
                        background: GREEN, border: `1px solid ${GREEN}80`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: 800, color: "#04140a",
                    }}>
                        {photoUrl ? <img src={photoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
                    </div>
                )}
                <div className="box-border caret-transparent gap-x-[5px] flex flex-col min-h-[auto] min-w-[auto] outline-[3px] gap-y-[5px] no-underline w-4">
                    {open ? (
                        <>
                            <span className="bg-white/80 block h-0.5 w-full rounded-sm rotate-45 translate-y-[6px] transition-transform"></span>
                            <span className="bg-white/80 block h-0.5 w-full rounded-sm opacity-0 transition-opacity"></span>
                            <span className="bg-white/80 block h-0.5 w-full rounded-sm -rotate-45 -translate-y-[6px] transition-transform"></span>
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