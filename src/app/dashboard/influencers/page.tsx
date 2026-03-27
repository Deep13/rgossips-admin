import { createAdminClient } from "@/utils/supabase/admin";
import { FilterBar } from "@/components/filter-bar";
import { InfluencerRow } from "./influencer-row";

export default async function InfluencersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { search, status, followers, category } = await searchParams;
  const supabase = createAdminClient();

  // Fetch all distinct categories from the DB to populate the filter
  const { data: allInfluencers } = await supabase
    .from("influencer_profiles")
    .select("categories");

  const allCategories = new Set<string>();
  allInfluencers?.forEach((inf) => {
    if (inf.categories && Array.isArray(inf.categories)) {
      inf.categories.forEach((cat: string) => allCategories.add(cat));
    }
  });

  const categoryOptions = Array.from(allCategories)
    .sort()
    .map((cat) => ({ label: cat, value: cat }));

  const filterFields = [
    { name: "search", label: "Search", type: "text" as const, placeholder: "Search by name or username..." },
    {
      name: "status",
      label: "All Statuses",
      type: "select" as const,
      options: [
        { label: "Active", value: "active" },
        { label: "Suspended", value: "suspended" },
        { label: "Pending", value: "pending" },
        { label: "Inactive", value: "inactive" },
      ],
    },
    {
      name: "followers",
      label: "Followers",
      type: "select" as const,
      options: [
        { label: "< 1K", value: "0-1000" },
        { label: "1K - 10K", value: "1000-10000" },
        { label: "10K - 100K", value: "10000-100000" },
        { label: "100K - 1M", value: "100000-1000000" },
        { label: "1M+", value: "1000000-" },
      ],
    },
    {
      name: "category",
      label: "All Categories",
      type: "multiselect" as const,
      options: categoryOptions,
    },
  ];

  let query = supabase
    .from("influencer_profiles")
    .select("influencer_id, full_name, username, profile_photo_url, followers_count, categories, status")
    .order("updated_at", { ascending: false });

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,username.ilike.%${search}%`);
  }
  if (status) {
    query = query.eq("status", status);
  }
  if (followers) {
    const [min, max] = followers.split("-");
    if (min) query = query.gte("followers_count", parseInt(min));
    if (max) query = query.lte("followers_count", parseInt(max));
  }
  if (category) {
    const cats = category.split(",").filter(Boolean);
    if (cats.length > 0) {
      query = query.contains("categories", cats);
    }
  }

  const { data: influencers, error } = await query;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Influencers</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Manage influencer profiles
        </p>
      </div>

      <FilterBar fields={filterFields} />

      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm mb-6">
          Failed to load influencers: {error.message}
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                Name
              </th>
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                Username
              </th>
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                Followers
              </th>
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                Categories
              </th>
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                Status
              </th>
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {influencers && influencers.length > 0 ? (
              influencers.map((inf) => (
                <InfluencerRow key={inf.influencer_id} inf={inf} />
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-400 dark:text-gray-500 text-sm"
                >
                  No influencers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
