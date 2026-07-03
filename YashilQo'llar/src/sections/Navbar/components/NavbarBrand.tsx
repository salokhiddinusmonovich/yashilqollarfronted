import { Link } from "react-router-dom";
import logoImg from "../../../pages/photo_2025-10-08_22-18-51.jpg";

export const NavbarBrand = () => {
    return (
        <Link
            to="/"
            className="items-center box-border caret-transparent gap-x-2 flex shrink min-w-0 flex-1 text-[16.8px] font-black tracking-[0.672px] leading-[26.88px] outline-[3px] gap-y-2 no-underline uppercase font-montserrat md:flex-none md:gap-x-[10.4px] md:text-xl md:tracking-[0.8px] md:leading-8"
        >
            <div style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                overflow: "hidden",
                border: "1.5px solid rgba(16,185,129,0.55)",
                flexShrink: 0,
                boxShadow: "0 0 10px rgba(16,185,129,0.25)",
            }}>
                <img
                    src={logoImg}
                    alt="Yashil Qo'llar MUN"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
            </div>
            <span
                className="box-border caret-transparent block tracking-[0.672px] leading-[26.88px] min-w-0 outline-[3px] no-underline truncate md:text-xl md:tracking-[0.8px] md:leading-8"
                style={{ fontSize: "clamp(11px, 3.4vw, 16.8px)" }}
            >
                Yashil Qo'llar MUN
            </span>
        </Link>
    );
};
