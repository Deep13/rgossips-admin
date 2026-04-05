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

export async function updateBrandInvitation(invitationId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const brandName = formData.get("brand_name") as string;
  const instagramUsername = (formData.get("instagram_username") as string)?.replace(/^@/, "").trim();
  const notesText = (formData.get("notes") as string) || "";
  const category = (formData.get("category") as string) || "";
  const instagramVerified = (formData.get("instagram_verified") as string) === "yes";

  if (!brandName) return { error: "Brand name is required" };
  if (!instagramUsername) return { error: "Instagram username is required" };

  const metadata: Record<string, unknown> = {};
  if (category) metadata.category = category;
  metadata.instagram_verified = instagramVerified;
  let notes = notesText;
  if (Object.keys(metadata).length > 0) {
    notes = notes ? `${notes}\n---\n${JSON.stringify(metadata)}` : JSON.stringify(metadata);
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("brand_invitations").update({
    brand_name: brandName,
    instagram_username: instagramUsername,
    notes,
  }).eq("id", invitationId).eq("status", "pending");

  if (error) return { error: error.message };
  revalidatePath("/dashboard/brands");
  return { success: true };
}
