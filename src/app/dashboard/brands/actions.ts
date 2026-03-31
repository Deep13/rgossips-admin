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

export async function uploadBrandIcon(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { error: "No file provided" };
  if (!file.type.startsWith("image/")) return { error: "Only images are allowed" };
  if (file.size > 5 * 1024 * 1024) return { error: "File must be under 5MB" };

  const adminClient = createAdminClient();

  // Ensure bucket exists
  await adminClient.storage.createBucket("brand-icons", {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"],
  });

  const timestamp = Date.now();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `icons/${timestamp}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error } = await adminClient.storage
    .from("brand-icons")
    .upload(path, Buffer.from(arrayBuffer), {
      contentType: file.type,
      upsert: true,
    });

  if (error) return { error: error.message };

  const { data } = adminClient.storage.from("brand-icons").getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function inviteBrand(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const brandName = formData.get("brand_name") as string;
  const instagramUsername = (formData.get("instagram_username") as string)?.replace(/^@/, "").trim();
  const logoUrl = (formData.get("logo_url") as string) || "";
  const notes = (formData.get("notes") as string) || "";

  if (!brandName) return { error: "Brand name is required" };
  if (!instagramUsername) return { error: "Instagram username is required" };

  const adminClient = createAdminClient();

  // Check if instagram_username already exists in brand_invitations
  const { data: existing } = await adminClient
    .from("brand_invitations")
    .select("id")
    .ilike("instagram_username", instagramUsername)
    .limit(1);

  if (existing && existing.length > 0) {
    return { error: `An invitation for @${instagramUsername} already exists` };
  }

  // Check if instagram_username already exists in brand_profiles
  const { data: existingProfile } = await adminClient
    .from("brand_profiles")
    .select("brand_id")
    .ilike("instagram_username", instagramUsername)
    .limit(1);

  if (existingProfile && existingProfile.length > 0) {
    return { error: `A brand with @${instagramUsername} is already registered` };
  }

  const { error } = await adminClient.from("brand_invitations").insert({
    brand_name: brandName,
    instagram_username: instagramUsername,
    logo_url: logoUrl,
    notes,
    created_by: user.id,
    status: "pending",
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/brands");
  return { success: true };
}

// Keep the old addBrand for backward compat (direct brand_profiles insert)
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
