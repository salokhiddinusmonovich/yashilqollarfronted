import { ProfileDropdown } from "./ProfileDropdown";
import { LangSwitcher } from "./LangSwitcher";

export function DesktopActions() {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <LangSwitcher />
            <ProfileDropdown />
        </div>
    );
}
