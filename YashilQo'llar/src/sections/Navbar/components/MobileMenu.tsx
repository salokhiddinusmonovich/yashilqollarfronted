import { NavLink, Link } from "react-router-dom";

const navItems = [
    { to: "/", label: "Home", end: true },
    { to: "/about", label: "About" },
    { to: "/blog", label: "Blog" },
    { to: "/team", label: "Team" },
    { to: "/sponsors", label: "Sponsors" },
    { to: "/contact", label: "Contact" },
];

export const MobileMenu = ({ onClose }: { onClose: () => void }) => {
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
                <div className="mt-3 pt-3 border-t border-white/10">

                </div>
            </nav>
        </div>
    );
};