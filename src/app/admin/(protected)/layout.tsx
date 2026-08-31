import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { profile } = await requireAdmin();
  return <div className="admin-shell"><AdminSidebar name={profile.full_name} /><div className="admin-main">{children}</div></div>;
}
