"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

async function uploadImage(
  adminClient: ReturnType<typeof createAdminClient>,
  bucket: string,
  file: File,
  path: string
): Promise<string | null> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await adminClient.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) return null;

  const { data } = adminClient.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function createCampaign(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const brandId = formData.get("brand_id") as string;
  const category = formData.getAll("category") as string[];
  const maxInfluencers = formData.get("max_influencers") as string;
  const startDate = formData.get("campaign_start_date") as string;
  const endDate = formData.get("campaign_end_date") as string;
  const deadline = formData.get("application_deadline") as string;

  // Content deliverables
  const reels = formData.get("num_reels") as string;
  const posts = formData.get("num_posts") as string;
  const stories = formData.get("num_stories") as string;
  const videos = formData.get("num_videos") as string;

  // Requirements
  const minFollowers = formData.get("target_follower_min") as string;
  const minEngagement = formData.get("min_engagement_rate") as string;
  const targetCities = formData.get("target_cities") as string;

  // Images
  const bannerFile = formData.get("banner_image") as File | null;
  const galleryFiles = formData.getAll("gallery_images") as File[];

  if (!title) return { error: "Title is required" };
  if (!brandId) return { error: "Brand is required" };

  const adminClient = createAdminClient();

  // Ensure storage bucket exists
  await adminClient.storage.createBucket("campaign-images", {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp", "image/gif"],
  });

  const timestamp = Date.now();

  // Upload banner image
  let bannerUrl: string | null = null;
  if (bannerFile && bannerFile.size > 0) {
    const ext = bannerFile.name.split(".").pop() || "jpg";
    bannerUrl = await uploadImage(
      adminClient,
      "campaign-images",
      bannerFile,
      `banners/${timestamp}_${Math.random().toString(36).slice(2, 8)}.${ext}`
    );
  }

  // Upload gallery images
  const galleryUrls: string[] = [];
  for (let i = 0; i < galleryFiles.length; i++) {
    const file = galleryFiles[i];
    if (file && file.size > 0) {
      const ext = file.name.split(".").pop() || "jpg";
      const url = await uploadImage(
        adminClient,
        "campaign-images",
        file,
        `gallery/${timestamp}_${i}_${Math.random().toString(36).slice(2, 8)}.${ext}`
      );
      if (url) galleryUrls.push(url);
    }
  }

  // Build content_types_required as a structured array
  const contentTypes: string[] = [];
  if (reels && parseInt(reels) > 0) contentTypes.push(`reels:${reels}`);
  if (posts && parseInt(posts) > 0) contentTypes.push(`posts:${posts}`);
  if (stories && parseInt(stories) > 0) contentTypes.push(`stories:${stories}`);
  if (videos && parseInt(videos) > 0) contentTypes.push(`videos:${videos}`);

  // Build description with metadata (banner + gallery URLs) if images were uploaded
  let fullDescription = description || "";
  const metadata: Record<string, unknown> = {};
  if (bannerUrl) metadata.banner_image = bannerUrl;
  if (galleryUrls.length > 0) metadata.gallery_images = galleryUrls;
  if (minEngagement) metadata.min_engagement_rate = parseFloat(minEngagement);
  if (Object.keys(metadata).length > 0) {
    fullDescription = fullDescription
      ? `${fullDescription}\n\n---\n${JSON.stringify(metadata)}`
      : JSON.stringify(metadata);
  }

  const { error } = await adminClient.from("campaigns").insert({
    brand_id: brandId,
    title,
    description: fullDescription || null,
    target_categories: category.length > 0 ? category : null,
    max_influencers: maxInfluencers ? parseInt(maxInfluencers) : null,
    campaign_start_date: startDate || null,
    campaign_end_date: endDate || null,
    application_deadline: deadline || null,
    content_types_required: contentTypes.length > 0 ? contentTypes : null,
    target_follower_min: minFollowers ? parseInt(minFollowers) : null,
    target_cities: targetCities ? targetCities.split(",").map((c) => c.trim()).filter(Boolean) : null,
    status: "draft",
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/campaigns");
  return { success: true };
}

export async function updateCampaignStatus(campaignId: string, status: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("campaigns")
    .update({ status })
    .eq("campaign_id", campaignId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/campaigns");
  return { success: true };
}
