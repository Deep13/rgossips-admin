import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DashboardShell } from "./dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Only allow users with an admin_profiles row (if table exists)
  const { count, error: profileError } = await supabase
    .from("admin_profiles")
    .select("*", { count: "exact", head: true });

  // If admin_profiles table exists and has rows, enforce the check
  const tableExists = !profileError;
  const tableHasRows = tableExists && (count ?? 0) > 0;

  if (tableHasRows) {
    const { data: adminProfile } = await supabase
      .from("admin_profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!adminProfile) {
      await supabase.auth.signOut();
      redirect("/login");
    }
  }

  return (
    <DashboardShell userEmail={user.email || ""}>{children}</DashboardShell>
  );
}
