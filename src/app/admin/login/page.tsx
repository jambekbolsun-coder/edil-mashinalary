import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { loginAction } from "@/app/admin/actions";

type Props = { searchParams: Promise<{ error?: string }> };

const errors: Record<string, string> = {
  "not-configured": "Подключение к базе данных ещё не настроено.", forbidden: "У аккаунта нет прав администратора.",
  credentials: "Неверный email или пароль.", missing: "Введите email и пароль.",
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error } = await searchParams;
  return <main className="admin-login"><div className="admin-login-visual"><Image src="/images/hero-service.png" alt="" fill priority sizes="60vw" /><div><span>EDIL</span><strong>Управляйте каталогом.<br />Не трогая код.</strong><p>Техника, заявки, контент и ответы клиентам — в одном защищённом рабочем пространстве.</p></div></div><div className="admin-login-panel"><Link href="/" className="admin-back"><ArrowLeft aria-hidden="true" />На сайт</Link><form action={loginAction}><div className="admin-login-icon"><LockKeyhole aria-hidden="true" /></div><span className="eyebrow">ЗАКРЫТЫЙ ДОСТУП</span><h1>Вход в панель</h1><p>Используйте аккаунт администратора компании.</p>{error && <div className="admin-alert" role="alert">{errors[error] ?? "Не удалось выполнить вход."}</div>}<label>Email<input type="email" name="email" autoComplete="username" required /></label><label>Пароль<input type="password" name="password" autoComplete="current-password" required /></label><button className="button" type="submit">Войти в панель <span aria-hidden="true">→</span></button></form></div></main>;
}
