import { Link } from "react-router-dom";
import { useLang } from "@/contexts/LanguageContext";
import logoImg from "../../../pages/photo_2025-10-08_22-18-51.jpg";

export const FooterContent = () => {
    const { t } = useLang();
    const f = t.footer;

    const links = [
        { label: f.links1[0], to: "/team" },
        { label: f.links1[1], to: "/sponsors" },
        { label: f.links1[2], to: "/blog" },
        { label: f.links1[3], to: "/contact" },
    ];

    return (
        <div className="relative z-[1] mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-6 md:grid-cols-[1.6fr_1fr] md:px-10">
            <div>
                <div className="mb-3 flex items-center gap-2">
                    <div
                        className="h-8 w-8 shrink-0 overflow-hidden rounded-full"
                        style={{ border: "1.5px solid rgba(34,197,94,0.55)" }}
                    >
                        <img src={logoImg} alt="Yashil Qo'llar" className="h-full w-full object-cover" />
                    </div>
                    <span className="font-montserrat text-sm font-black uppercase tracking-wide text-white">
                        Yashil Qo'llar
                    </span>
                </div>
                <p className="max-w-[260px] text-[13px] leading-relaxed text-white/40">{f.desc}</p>
            </div>

            <div>
                <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.08em] text-white/35">{f.col1Title}</div>
                <div className="flex flex-col gap-3">
                    {links.map((item, i) => (
                        <Link key={i} to={item.to} className="text-[13px] text-white/60 no-underline transition-colors hover:text-white">
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};