import Link from "next/link";
import { createAdminClient } from "@/utils/supabase/admin";
import { FilterBar } from "@/components/filter-bar";
import { CampaignRow } from "./campaign-row";

const filterFields = [
  { name: "search", label: "Search", type: "text" as const, placeholder: "Search by title..." },
  {
    name: "status",
    label: "Status",
    type: "select" as const,
    options: [
      { label: "Draft", value: "draft" },
      { label: "Active", value: "active" },
      { label: "Paused", value: "paused" },
      { label: "Completed", value: "completed" },
    ],
  },
  {
    name: "category",
    label: "Category",
    type: "multiselect" as const,
    options: [
      { label: "Hotel", value: "Hotel" },
      { label: "Food and Dining", value: "Food and Dining" },
      { label: "Tech Gadgets", value: "Tech Gadgets" },
      { label: "Fashion and Beauty", value: "Fashion and Beauty" },
    ],
  },
];

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { search, status, category } = await searchParams;
  const supabase = createAdminClient();

  let query = supabase
    .from("campaigns")
    .select("campaign_id, title, status, max_influencers, campaign_start_date, campaign_end_date, target_categories, brand_id, brand_profiles(brand_name)")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }
  if (status) {
    query = query.eq("status", status);
  }
  if (category) {
    const cats = category.split(",").filter(Boolean);
    if (cats.length > 0) {
      query = query.contains("target_categories", cats);
    }
  }

  const { data: campaigns, error } = await query;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Campaigns</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage campaigns</p>
        </div>
        <Link
          href="/dashboard/campaigns/create"
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
        >
          + New Campaign
        </Link>
      </div>

      <FilterBar fields={filterFields} />

      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm mb-6">
          Failed to load campaigns: {error.message}
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                Title
              </th>
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                Brand
              </th>
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                Status
              </th>
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                Slots
              </th>
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                Dates
              </th>
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {campaigns && campaigns.length > 0 ? (
              campaigns.map((campaign: any) => (
                <CampaignRow key={campaign.campaign_id} campaign={campaign} />
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-400 dark:text-gray-500 text-sm"
                >
                  No campaigns found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
