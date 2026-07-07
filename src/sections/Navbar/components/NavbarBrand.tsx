import { Link } from "react-router-dom";
import { useRef } from "react";
import logoImg from "../../../pages/photo_2025-10-08_22-18-51.jpg";

export const NavbarBrand = () => {
    const innerRef = useRef<HTMLDivElement>(null);

    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        if (innerRef.current) {
            innerRef.current.style.transform = `rotateY(${px * 22}deg) rotateX(${-py * 22}deg) scale(1.06)`;
        }
    };
    const handleLeave = () => {
        if (innerRef.current) innerRef.current.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
    };

    return (
        <Link
            to="/"
            className="flex items-center box-border caret-transparent gap-x-2 shrink min-w-0 flex-1 text-[16.8px] font-black tracking-[0.672px] leading-[26.88px] outline-[3px] gap-y-2 no-underline uppercase font-montserrat md:flex-none md:gap-x-[10.4px] md:text-xl md:tracking-[0.8px] md:leading-8"
        >
            <style>{`
                @keyframes yq-brand-drift {
                    0%, 100% { transform: translateY(0) rotateY(-5deg); }
                    50% { transform: translateY(-2px) rotateY(5deg); }
                }
                @keyframes yq-brand-glow {
                    0%, 100% { opacity: .35; }
                    50% { opacity: .75; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .yq-brand-drift, .yq-brand-glow { animation: none !important; }
                }
            `}</style>

            <div
                onMouseMove={handleMove}
                onMouseLeave={handleLeave}
                style={{
                    position: "relative",
                    width: 34,
                    height: 34,
                    flexShrink: 0,
                    perspective: 500,
                }}
            >
                {/* ambient glow behind the mark */}
                <div
                    className="yq-brand-glow"
                    style={{
                        position: "absolute",
                        inset: -6,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(16,185,129,0.55), transparent 70%)",
                        animation: "yq-brand-glow 3.2s ease-in-out infinite",
                        pointerEvents: "none",
                    }}
                />

                {/* continuous slow 3D drift */}
                <div className="yq-brand-drift" style={{ animation: "yq-brand-drift 6s ease-in-out infinite", transformStyle: "preserve-3d" }}>
                    {/* cursor-follow tilt, layered on top of the drift */}
                    <div
                        ref={innerRef}
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "1.5px solid rgba(16,185,129,0.55)",
                            boxShadow: "0 0 10px rgba(16,185,129,0.25)",
                            transition: "transform .18s ease-out",
                            transformStyle: "preserve-3d",
                        }}
                    >
                        <img
                            src={logoImg}
                            alt="Yashil Qo'llar"
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                    </div>
                </div>
            </div>

            <span
                className="block box-border caret-transparent tracking-[0.672px] leading-[26.88px] min-w-0 outline-[3px] no-underline truncate md:text-xl md:tracking-[0.8px] md:leading-8"
                style={{ fontSize: "clamp(12px, 3.4vw, 16.8px)", color: "#ffffff" }}
            >
                Yashil Qo'llar
            </span>
        </Link>
    );
};