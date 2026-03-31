"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function deleteInvitation(invitationId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("brand_invitations")
    .delete()
    .eq("id", invitationId)
    .eq("status", "pending");

  if (error) return { error: error.message };

  revalidatePath("/dashboard/brands");
  return { success: true };
}
