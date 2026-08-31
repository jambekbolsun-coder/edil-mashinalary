"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Bot, CircleUserRound, FileText, LayoutDashboard, LogOut, Package, Settings, Users } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";

const links = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard },
  { href: "/admin/catalog", label: "Каталог", icon: Package },
  { href: "/admin/leads", label: "Заявки", icon: Users },
  { href: "/admin/chatbot", label: "Чат-бот", icon: Bot },
  { href: "/admin/content", label: "Материалы", icon: FileText },
  { href: "/admin/analytics", label: "Аналитика", icon: BarChart3 },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
  { href: "/admin/profile", label: "Профиль", icon: CircleUserRound },
];

export function AdminSidebar({ name }: { name: string | null }) {
  const pathname = usePathname();
  return <aside className="admin-sidebar"><div className="admin-brand"><span>EDIL</span><small>CONTROL CENTER</small></div><nav>{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={pathname === href || (href !== "/admin" && pathname.startsWith(href)) ? "active" : ""}><Icon aria-hidden="true" />{label}</Link>)}</nav><div className="admin-profile"><div><span>{name?.slice(0, 1).toUpperCase() || "A"}</span><p><strong>{name || "Администратор"}</strong><small>Полный доступ</small></p></div><form action={logoutAction}><button aria-label="Выйти"><LogOut aria-hidden="true" /></button></form></div></aside>;
}
