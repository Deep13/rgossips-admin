"use client";

import { useState } from "react";
import Link from "next/link";
import { updateCampaignStatus } from "./actions";

interface Campaign {
  campaign_id: string;
  title: string | null;
  status: string | null;
  max_influencers: number | null;
  campaign_start_date: string | null;
  campaign_end_date: string | null;
  target_categories: string[] | null;
  brand_id: string | null;
  brand_profiles: { brand_name: string | null } | null;
}

export function CampaignRow({ campaign }: { campaign: Campaign }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(campaign.status || "draft");

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    const result = await updateCampaignStatus(campaign.campaign_id, newStatus);
    if (result.error) {
      alert(result.error);
    } else {
      setStatus(newStatus);
    }
    setLoading(false);
  };

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

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="px-6 py-4">
        <Link
          href={`/dashboard/campaigns/${campaign.campaign_id}`}
          className="text-sm text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
        >
          {campaign.title || "—"}
        </Link>
        {campaign.target_categories && campaign.target_categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {campaign.target_categories.map((cat) => (
              <span
                key={cat}
                className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
              >
                {cat}
              </span>
            ))}
          </div>
        )}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
        {campaign.brand_profiles?.brand_name || "—"}
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusColors[status] || statusColors.draft
          }`}
        >
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
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {status === "draft" && (
            <button
              onClick={() => handleStatusChange("active")}
              disabled={loading}
              className="text-xs font-medium px-3 py-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "..." : "Activate"}
            </button>
          )}
          {status === "active" && (
            <>
              <button
                onClick={() => handleStatusChange("paused")}
                disabled={loading}
                className="text-xs font-medium px-3 py-1.5 rounded-lg text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? "..." : "Pause"}
              </button>
              <button
                onClick={() => handleStatusChange("completed")}
                disabled={loading}
                className="text-xs font-medium px-3 py-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? "..." : "Complete"}
              </button>
            </>
          )}
          {status === "paused" && (
            <button
              onClick={() => handleStatusChange("active")}
              disabled={loading}
              className="text-xs font-medium px-3 py-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "..." : "Resume"}
            </button>
          )}
          {status === "completed" && (
            <span className="text-xs text-gray-400">Done</span>
          )}
        </div>
      </td>
    </tr>
  );
}
