import Link from "next/link";
import { createAdminClient } from "@/utils/supabase/admin";
import { CreateCampaignForm } from "./create-campaign-form";

export default async function CreateCampaignPage() {
  const supabase = createAdminClient();
  const { data: brands } = await supabase
    .from("brand_profiles")
    .select("brand_id, brand_name")
    .order("brand_name");

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/campaigns"
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Campaign</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-0.5">Fill in the details to launch a new influencer campaign</p>
        </div>
      </div>

      <CreateCampaignForm brands={brands || []} />
    </div>
  );
}
