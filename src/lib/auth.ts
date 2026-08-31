import "server-only";

import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  if (!hasSupabaseEnv()) redirect("/admin/login?error=not-configured");
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/admin/login");
  const { data: profile } = await supabase.from("profiles").select("id, full_name, role").eq("id", userId).maybeSingle();
  if (!profile || profile.role !== "admin") redirect("/admin/login?error=forbidden");
  return { supabase, profile };
}
