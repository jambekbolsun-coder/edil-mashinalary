import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { loginAction } from "@/app/admin/actions";
import { LoginSubmit } from "@/components/admin/login-submit";
import { LoginFields } from "@/components/admin/login-fields";

type Props = { searchParams: Promise<{ error?: string }> };

export const metadata: Metadata = { title: "Вход в панель управления", robots: { index: false, follow: false } };

const errors: Record<string, string> = {
  "not-configured": "Подключение к базе данных ещё не настроено.", forbidden: "У аккаунта нет прав администратора.",
  credentials: "Неверный email или пароль.", missing: "Введите email и пароль.",
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error } = await searchParams;
  return <main className="admin-login"><Link href="/" className="admin-back"><ArrowLeft aria-hidden="true" />Вернуться на сайт</Link><section className="admin-login-frame"><div className="admin-login-visual"><Image src="/images/hero-service.png" alt="Спецтехника в сервисной зоне Edil Mashinalary" fill preload quality={92} sizes="(max-width: 900px) 100vw, 52vw" /><div className="admin-login-message"><span>EDIL CONTROL</span><h2>Маркетинговая часть сайта — под вашим управлением.</h2><p>Обновляйте каталог и материалы, принимайте заявки и смотрите реальный интерес к технике.</p><ul><li>Каталог и сервис</li><li>Заявки клиентов</li><li>Контент и аналитика</li></ul></div></div><div className="admin-login-panel"><form action={loginAction}><div className="admin-login-icon"><LockKeyhole aria-hidden="true" /></div><span className="eyebrow">ЗАЩИЩЁННЫЙ ДОСТУП</span><h1>Вход</h1><p>Для администратора Edil Mashinalary</p>{error && <div className="admin-alert" role="alert">{errors[error] ?? "Не удалось выполнить вход."}</div>}<LoginFields /><LoginSubmit /><small className="admin-login-note">Регистрация закрыта. Доступ выдаётся только владельцем.</small></form></div></section></main>;
}
