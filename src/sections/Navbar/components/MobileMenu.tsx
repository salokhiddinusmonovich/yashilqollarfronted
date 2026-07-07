import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { LangSwitcher } from "./LangSwitcher";
import { ProfileDropdown } from "./ProfileDropdown";

const GREEN = "#22C55E";

const navItems = [
    { to: "/", label: "Home", end: true },
    { to: "/blog", label: "Blog" },
    { to: "/team", label: "Team" },
    { to: "/sponsors", label: "Sponsors" },
    { to: "/contact", label: "Contact" },
];

export const MobileMenu = ({ onClose }: { onClose: () => void }) => {
    const { isLoggedIn } = useAuth();

    return (
        <div className="absolute top-14 left-0 w-full bg-zinc-950/98 backdrop-blur-xl border-b border-white/10 md:hidden z-50">
            <nav className="flex flex-col px-5 py-4 gap-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `text-[12px] font-semibold tracking-[1.2px] uppercase py-3 px-4 rounded-lg font-montserrat transition-colors ${isActive ? "text-emerald-500 bg-emerald-500/10" : "text-white/50 hover:text-white hover:bg-white/5"}`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}

                <div className="mt-3 pt-4 border-t border-white/10 flex items-center justify-between gap-3 px-1 pb-1">
                    <LangSwitcher />
                    {isLoggedIn ? (
                        <ProfileDropdown />
                    ) : (
                        <Link
                            to="/login"
                            onClick={onClose}
                            style={{
                                background: GREEN, color: "#04140a", border: "none",
                                padding: "8px 18px", borderRadius: 8,
                                fontSize: 11, fontWeight: 800, letterSpacing: ".08em",
                                textDecoration: "none", fontFamily: "'Montserrat',sans-serif",
                            }}
                        >
                            LOGIN →
                        </Link>
                    )}
                </div>
            </nav>
        </div>
    );
};