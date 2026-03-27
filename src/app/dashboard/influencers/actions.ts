"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function toggleInfluencerStatus(influencerId: string, currentStatus: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const newStatus = currentStatus === "active" ? "suspended" : "active";

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("influencer_profiles")
    .update({ status: newStatus })
    .eq("influencer_id", influencerId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/influencers");
  return { success: true, newStatus };
}
