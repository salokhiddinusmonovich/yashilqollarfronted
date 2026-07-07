import { FooterBackground } from "@/sections/Footer/components/FooterBackground";
import { FooterContent } from "@/sections/Footer/components/FooterContent";
import { FooterBottom } from "@/sections/Footer/components/FooterBottom";
import { FooterCredit } from "@/sections/Footer/components/FooterCredit";

export const Footer = () => {
    return (
        <footer className="bg-neutral-900 box-border caret-transparent outline-[3px] relative no-underline z-[1] overflow-hidden mt-12 pt-10 pb-8">
            <FooterBackground backgroundVariant="glow" />
            <FooterContent />
            <FooterBottom />
            <FooterCredit />
            <FooterBackground backgroundVariant="wordmark" />
        </footer>
    );
};