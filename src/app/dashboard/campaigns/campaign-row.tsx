"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCampaignStatus } from "./actions";
import { ButtonSpinner } from "@/components/spinner";

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
  const router = useRouter();
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

  const actionBtnBase =
    "inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border";

  return (
    <tr
      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
      onClick={() => router.push(`/dashboard/campaigns/${campaign.campaign_id}`)}
    >
      <td className="px-6 py-4">
        <span className="text-sm text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
          {campaign.title || "—"}
        </span>
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
      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          {status === "draft" && (
            <button
              onClick={() => handleStatusChange("active")}
              disabled={loading}
              className={`${actionBtnBase} bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40`}
            >
              {loading ? <ButtonSpinner /> : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              )}
              {loading ? "..." : "Activate"}
            </button>
          )}
          {status === "active" && (
            <>
              <button
                onClick={() => handleStatusChange("paused")}
                disabled={loading}
                className={`${actionBtnBase} bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/40`}
              >
                {loading ? <ButtonSpinner /> : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {loading ? "..." : "Pause"}
              </button>
              <button
                onClick={() => handleStatusChange("completed")}
                disabled={loading}
                className={`${actionBtnBase} bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40`}
              >
                {loading ? <ButtonSpinner /> : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {loading ? "..." : "Complete"}
              </button>
            </>
          )}
          {status === "paused" && (
            <button
              onClick={() => handleStatusChange("active")}
              disabled={loading}
              className={`${actionBtnBase} bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40`}
            >
              {loading ? <ButtonSpinner /> : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              )}
              {loading ? "..." : "Resume"}
            </button>
          )}
          {status === "completed" && (
            <span className="text-xs text-gray-400 italic">Completed</span>
          )}
        </div>
      </td>
    </tr>
  );
}
