import type { Locale } from "@/lib/types";

export function Flag({ locale }: { locale: Locale }) {
  if (locale === "ru") {
    return (
      <svg viewBox="0 0 24 16" aria-hidden="true" className="flag-icon">
        <rect width="24" height="16" rx="2" fill="#fff" />
        <rect y="5.33" width="24" height="5.34" fill="#1C57A7" />
        <rect y="10.67" width="24" height="5.33" rx="0 0 2 2" fill="#D52B1E" />
      </svg>
    );
  }

  if (locale === "ky") {
    return (
      <svg viewBox="0 0 24 16" aria-hidden="true" className="flag-icon">
        <rect width="24" height="16" rx="2" fill="#E8112D" />
        <circle cx="12" cy="8" r="3.6" fill="#F4D34A" />
        <path d="M12 3.1v1.5M12 11.4v1.5M7.1 8h1.5M15.4 8h1.5M8.5 4.5l1.1 1.1M14.4 10.4l1.1 1.1M15.5 4.5l-1.1 1.1M9.6 10.4l-1.1 1.1" stroke="#F4D34A" strokeWidth=".8" />
        <path d="M9.7 8h4.6M10.2 6.8h3.6M10.2 9.2h3.6" stroke="#E8112D" strokeWidth=".6" />
      </svg>
    );
  }

  if (locale === "tr") {
    return (
      <svg viewBox="0 0 24 16" aria-hidden="true" className="flag-icon">
        <rect width="24" height="16" rx="2" fill="#E30A17" />
        <circle cx="10" cy="8" r="4" fill="#fff" />
        <circle cx="11.2" cy="8" r="3.2" fill="#E30A17" />
        <path d="m14.2 8 2.6-.84-1.6 2.18V6.66l1.6 2.18z" fill="#fff" />
      </svg>
    );
  }

  if (locale === "zh") {
    return (
      <svg viewBox="0 0 24 16" aria-hidden="true" className="flag-icon">
        <rect width="24" height="16" rx="2" fill="#DE2910" />
        <path d="m5 2.3.7 2.1h2.2L6.1 5.7l.7 2.1L5 6.5 3.2 7.8l.7-2.1-1.8-1.3h2.2z" fill="#FFDE00" />
        <circle cx="9.6" cy="2.7" r=".65" fill="#FFDE00" />
        <circle cx="11" cy="4.2" r=".65" fill="#FFDE00" />
        <circle cx="11" cy="6.2" r=".65" fill="#FFDE00" />
        <circle cx="9.6" cy="7.6" r=".65" fill="#FFDE00" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 16" aria-hidden="true" className="flag-icon">
      <rect width="24" height="16" rx="2" fill="#fff" />
      <path d="M0 0h10v6H0z" fill="#1B4B8B" />
      <path d="M0 7h10v2H0zM4 0h2v6H4z" fill="#fff" />
      <path d="M0 7.7h10M5 0v6" stroke="#D8292F" strokeWidth="1" />
      <path d="M10 0h14v16H0V9h10z" fill="#B22234" />
      <path d="M10 2h14M10 4h14M10 6h14M0 10h24M0 12h24M0 14h24" stroke="#fff" strokeWidth="1.1" />
      <path d="M0 0h10v7.6H0z" fill="#3C3B6E" />
      <g fill="#fff">
        <circle cx="2" cy="2" r=".35" /><circle cx="5" cy="2" r=".35" /><circle cx="8" cy="2" r=".35" />
        <circle cx="3.5" cy="4" r=".35" /><circle cx="6.5" cy="4" r=".35" />
        <circle cx="2" cy="6" r=".35" /><circle cx="5" cy="6" r=".35" /><circle cx="8" cy="6" r=".35" />
      </g>
    </svg>
  );
}
