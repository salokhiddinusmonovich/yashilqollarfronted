import { useLang } from "@/contexts/LanguageContext";

export const FooterBottom = () => {
    const { t } = useLang();

    return (
        <div className="relative z-[1] mx-auto mt-10 flex max-w-[1200px] flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] px-6 pt-5 md:px-10">
            <span className="text-xs text-white/30">© 2026 {t.footer.copyright}</span>
            <div className="flex gap-2.5">
                <a
                    href="https://t.me/yashilqollar"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Telegram"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/50 no-underline transition-colors hover:border-[#22c55e] hover:text-[#22c55e]"
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M21.05 3.64L2.98 10.6c-1.23.49-1.22 1.17-.22 1.48l4.63 1.45 1.79 5.44c.22.6.11.85.75.85.5 0 .72-.23 1-.5l2.4-2.33 4.68 3.46c.86.48 1.48.23 1.7-.8l3.07-14.5c.32-1.27-.48-1.84-1.73-1.31z"
                            fill="currentColor"
                        />
                        <path
                            d="M9.5 14.5l9-8.4-11 7.3.35 4.6z"
                            fill="rgba(0,0,0,0.35)"
                        />
                    </svg>
                </a>
                <a
                    href="https://instagram.com/yashilqollar"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/50 no-underline transition-colors hover:border-[#22c55e] hover:text-[#22c55e]"
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.8" />
                        <circle cx="12" cy="12" r="4.3" stroke="currentColor" strokeWidth="1.8" />
                        <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" />
                    </svg>
                </a>
            </div>
        </div>
    );
};