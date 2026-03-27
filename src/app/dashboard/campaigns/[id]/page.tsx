import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/utils/supabase/admin";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: campaign, error } = await supabase
    .from("campaigns")
    .select("*, brand_profiles(brand_name, logo_url)")
    .eq("campaign_id", id)
    .single();

  if (error || !campaign) return notFound();

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
    active: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    paused: "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    completed: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  };

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  // Parse content_types_required (format: "reels:3", "posts:2", etc.)
  const deliverables: Record<string, number> = {};
  if (campaign.content_types_required) {
    for (const entry of campaign.content_types_required) {
      const [type, count] = entry.split(":");
      if (type && count) deliverables[type] = parseInt(count);
    }
  }

  const fields = [
    { label: "Title", value: campaign.title },
    { label: "Brand", value: campaign.brand_profiles?.brand_name },
    { label: "Status", value: campaign.status, badge: true },
    { label: "Description", value: campaign.description },
    { label: "Total Slots", value: campaign.max_influencers },
    { label: "Start Date", value: formatDate(campaign.campaign_start_date) },
    { label: "End Date", value: formatDate(campaign.campaign_end_date) },
    { label: "Application Deadline", value: formatDate(campaign.application_deadline) },
    { label: "Categories", value: campaign.target_categories?.join(", ") },
    { label: "Min Followers", value: campaign.target_follower_min },
    { label: "Target Cities", value: campaign.target_cities?.join(", ") },
    { label: "Created", value: formatDate(campaign.created_at) },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/dashboard/campaigns"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{campaign.title || "Campaign"}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Campaign Details</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          {fields.map((f) => (
            <div key={f.label}>
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">{f.label}</p>
              {f.badge ? (
                <span
                  className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    statusColors[String(f.value)] || statusColors.draft
                  }`}
                >
                  {String(f.value || "draft")}
                </span>
              ) : (
                <p className="text-sm text-gray-900 dark:text-white mt-0.5">{String(f.value ?? "—")}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Deliverables */}
      {Object.keys(deliverables).length > 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Content Deliverables</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(deliverables).map(([type, count]) => (
              <div key={type} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{count}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-1">{type}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw data */}
      <details className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <summary className="text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer">
          Raw Campaign Data
        </summary>
        <pre className="mt-4 text-xs text-gray-600 dark:text-gray-300 overflow-auto whitespace-pre-wrap">
          {JSON.stringify(campaign, null, 2)}
        </pre>
      </details>
    </div>
  );
}
