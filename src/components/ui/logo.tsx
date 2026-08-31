import Image from "next/image";
import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="Edil Mashinalary — на главную">
      <Image src="/images/logo.png" alt="Логотип Edil Mashinalary" width={52} height={52} priority />
      <span className="brand-copy">
        <strong>EDIL MASHINALARY</strong>
        {!compact && <small>Спецтехника · Кыргызстан</small>}
      </span>
    </Link>
  );
}
