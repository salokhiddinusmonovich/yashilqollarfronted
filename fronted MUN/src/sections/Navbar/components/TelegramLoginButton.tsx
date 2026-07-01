import { useEffect, useRef } from "react";
import { useAuth, TelegramAuthData } from "../contexts/AuthContext";

interface Props {
  onSuccess?: () => void;
  onError?: (msg: string) => void;
  size?: "large" | "medium" | "small";
  cornerRadius?: number;
  requestAccess?: boolean;
}

// Your bot username from @BotFather (without @)
const BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "YashilQollarBot";

export function TelegramLoginButton({
  onSuccess,
  onError,
  size = "large",
  cornerRadius = 10,
  requestAccess = true,
}: Props) {
  const { loginWithTelegram } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Telegram widget calls this global function when user logs in
    (window as any).onTelegramAuth = async (tgData: TelegramAuthData) => {
      const result = await loginWithTelegram(tgData);
      if (result.ok) {
        onSuccess?.();
      } else {
        onError?.(result.error || "Login failed");
      }
    };

    // Inject the Telegram widget script
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", BOT_USERNAME);
    script.setAttribute("data-size", size);
    script.setAttribute("data-radius", String(cornerRadius));
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", requestAccess ? "write" : "");
    script.async = true;

    containerRef.current.innerHTML = ""; // clear old widget
    containerRef.current.appendChild(script);

    return () => {
      delete (window as any).onTelegramAuth;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 48,
      }}
    />
  );
}