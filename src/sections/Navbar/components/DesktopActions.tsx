import { ProfileDropdown } from "./ProfileDropdown";
import { LangSwitcher } from "./LangSwitcher";

export function DesktopActions() {
    return (
        <div className="hidden lg:flex" style={{ alignItems: "center", gap: 12 }}>
            <LangSwitcher />
            <ProfileDropdown />
        </div>
    );
}