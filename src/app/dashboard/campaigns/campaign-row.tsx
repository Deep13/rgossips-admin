import Link from "next/link";

interface Campaign {
  campaign_id: string;
  title: string | null;
  status: string | null;
  max_influencers: number | null;
  campaign_start_date: string | null;
  campaign_end_date: string | null;
  target_categories: string[] | null;
  brand_id: string | null;
  brand_invitation_id: string | null;
  created_by_admin: boolean | null;
  brand_profiles: { brand_name: string | null } | null;
  brand_invitations: { brand_name: string | null } | null;
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
  active: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  paused: "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
  completed: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
};

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function CampaignRow({ campaign }: { campaign: Campaign }) {
  const brandName = campaign.brand_profiles?.brand_name || campaign.brand_invitations?.brand_name || "—";
  const status = campaign.status || "draft";

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="px-6 py-4">
        <Link href={`/dashboard/campaigns/${campaign.campaign_id}`} className="text-sm text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
          {campaign.title || "—"}
        </Link>
        {campaign.target_categories && campaign.target_categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {campaign.target_categories.map((cat) => (
              <span key={cat} className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">{cat}</span>
            ))}
          </div>
        )}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
        {brandName}
        {campaign.brand_invitation_id && !campaign.brand_id && (
          <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-semibold">Invited</span>
        )}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || statusColors.draft}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
        {campaign.max_influencers ?? "—"}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
        <div>{formatDate(campaign.campaign_start_date)}</div>
        {campaign.campaign_end_date && (
          <div className="text-xs text-gray-400">to {formatDate(campaign.campaign_end_date)}</div>
        )}
      </td>
    </tr>
  );
}
