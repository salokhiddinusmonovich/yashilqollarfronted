interface FooterBackgroundProps {
    backgroundVariant?: "glow" | "wordmark" | "hidden";
}

export const FooterBackground = ({ backgroundVariant = "glow" }: FooterBackgroundProps) => {
    if (backgroundVariant === "hidden") return null;

    if (backgroundVariant === "wordmark") {
        return null;
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