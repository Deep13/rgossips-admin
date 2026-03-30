"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCampaignStatus } from "../actions";
import { ButtonSpinner } from "@/components/spinner";

export function CampaignDetailActions({
  campaignId,
  status,
}: {
  campaignId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    const result = await updateCampaignStatus(campaignId, newStatus);
    if (result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  const btnBase =
    "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border";

  return (
    <div className="flex items-center gap-2 shrink-0">
      {status === "draft" && (
        <button
          onClick={() => handleStatusChange("active")}
          disabled={loading}
          className={`${btnBase} bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40`}
        >
          {loading ? <ButtonSpinner /> : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
          )}
          Activate
        </button>
      )}
      {status === "active" && (
        <>
          <button
            onClick={() => handleStatusChange("paused")}
            disabled={loading}
            className={`${btnBase} bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/40`}
          >
            {loading ? <ButtonSpinner /> : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            Pause
          </button>
          <button
            onClick={() => handleStatusChange("completed")}
            disabled={loading}
            className={`${btnBase} bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40`}
          >
            {loading ? <ButtonSpinner /> : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            Complete
          </button>
        </>
      )}
      {status === "paused" && (
        <button
          onClick={() => handleStatusChange("active")}
          disabled={loading}
          className={`${btnBase} bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40`}
        >
          {loading ? <ButtonSpinner /> : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
          )}
          Resume
        </button>
      )}
    </div>
  );
}
