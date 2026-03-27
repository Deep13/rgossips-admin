"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function updateBrandVerification(brandId: string, action: "verified" | "rejected" | "pending") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("brand_profiles")
    .update({
      verification_status: action,
      is_verified: action === "verified",
    })
    .eq("brand_id", brandId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/brands");
  return { success: true };
}

export async function addBrand(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const brandName = formData.get("brand_name") as string;
  const contactName = formData.get("contact_name") as string;
  const contactPhone = formData.get("contact_phone") as string;
  const contactEmail = formData.get("contact_email") as string;
  const gstin = formData.get("gstin") as string;

  if (!brandName) return { error: "Brand name is required" };

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("brand_profiles").insert({
    brand_name: brandName,
    contact_name: contactName || null,
    contact_phone: contactPhone || null,
    contact_email: contactEmail || null,
    gstin: gstin || null,
    verification_status: "pending",
    status: "active",
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/brands");
  return { success: true };
}
