"use client";

import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { useEffect, useState } from "react";

type Choice = "analytics" | "necessary";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setVisible(!localStorage.getItem("edil_cookie_choice")));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function choose(choice: Choice) {
    localStorage.setItem("edil_cookie_choice", choice);
    document.cookie = `edil_cookie_consent=${choice}; Max-Age=31536000; Path=/; SameSite=Lax; Secure`;
    setVisible(false);
    window.dispatchEvent(new Event("edil-consent-changed"));
  }

  if (!visible) return null;
  return (
    <aside className="cookie-banner" aria-label="Настройки cookie">
      <button className="cookie-close" type="button" onClick={() => choose("necessary")} aria-label="Закрыть и оставить только необходимые cookie"><X aria-hidden="true" /></button>
      <div className="cookie-mark" aria-hidden="true"><Cookie /></div>
      <div className="cookie-copy">
        <strong>Ваш выбор — под контролем</strong>
        <p>Необходимые cookie обеспечивают вход и работу сайта. Обезличенную внутреннюю аналитику включим только с вашего согласия.</p>
        <Link href="/cookies">Как используются cookie</Link>
      </div>
      <div className="cookie-actions">
        <button className="button button-outline" type="button" onClick={() => choose("necessary")}>Только необходимые</button>
        <button className="button" type="button" onClick={() => choose("analytics")}>Разрешить аналитику</button>
      </div>
    </aside>
  );
}
