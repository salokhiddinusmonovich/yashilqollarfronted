interface FooterBackgroundProps {
    backgroundVariant?: "glow" | "wordmark" | "hidden";
}

export const FooterBackground = ({ backgroundVariant = "glow" }: FooterBackgroundProps) => {
    if (backgroundVariant === "hidden") return null;

    if (backgroundVariant === "wordmark") {
        return (
            <div
                aria-hidden="true"
                className="pointer-events-none relative z-0 mt-6 flex justify-center items-start overflow-hidden select-none"
                style={{ height: "clamp(50px, 9vw, 110px)" }}
            >
                <span
                    className="font-montserrat font-black uppercase whitespace-nowrap"
                    style={{
                        fontSize: "clamp(2.2rem, 9vw, 7rem)",
                        lineHeight: 1,
                        color: "rgba(255,255,255,0.05)",
                    }}
                >
                    Yashil Qo'llar
                </span>
            </div>
        );
    }

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{
                background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(34,197,94,0.06) 0%, transparent 70%)",
            }}
        />
    );
};