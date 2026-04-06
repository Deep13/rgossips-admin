"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateApplicationStatus } from "../actions";
import { ButtonSpinner } from "@/components/spinner";

interface Application {
  id: string;
  campaign_id: string;
  influencer_id: string;
  initiated_by: string;
  proposed_rate: number | null;
  brand_offered_rate: number | null;
  final_agreed_rate: number | null;
  status: string;
  rejection_reason: string | null;
  created_at: string;
  influencer_profiles: {
    full_name: string | null;
    username: string | null;
    profile_photo_url: string | null;
    followers_count: number | null;
    instagram_handle: string | null;
  } | null;
}

const statusConfig: Record<string, { bg: string; label: string }> = {
  pending: { bg: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400", label: "Pending" },
  accepted: { bg: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400", label: "Accepted" },
  rejected: { bg: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400", label: "Rejected" },
  completed: { bg: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400", label: "Completed" },
  withdrawn: { bg: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400", label: "Withdrawn" },
};

export function ApplicationsList({ applications }: { applications: Application[] }) {
  if (!applications || applications.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Applications</h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">{applications.length}</span>
        </div>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {applications.map((app) => (
          <ApplicationRow key={app.id} application={app} />
        ))}
      </div>
    </div>
  );
}

function ApplicationRow({ application }: { application: Application }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const inf = application.influencer_profiles;
  const st = statusConfig[application.status] || statusConfig.pending;

  const handleAction = async (newStatus: string, rejectionReason?: string) => {
    setLoading(true);
    const result = await updateApplicationStatus(application.id, newStatus, rejectionReason);
    if (result.error) alert(result.error);
    else router.refresh();
    setLoading(false);
    setShowReject(false);
  };

  const btnBase = "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border";

  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Link href={`/dashboard/influencers/${application.influencer_id}`}>
            {inf?.profile_photo_url ? (
              <img src={inf.profile_photo_url} alt="" className="w-10 h-10 rounded-xl object-cover border border-gray-200 dark:border-gray-700 hover:border-indigo-400 transition-colors" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center hover:opacity-80 transition-opacity">
                <span className="text-sm font-bold text-white">{inf?.full_name?.[0]?.toUpperCase() || "?"}</span>
              </div>
            )}
          </Link>
          <div className="min-w-0">
            <Link href={`/dashboard/influencers/${application.influencer_id}`} className="text-sm font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate block">
              {inf?.full_name || "Unknown"}
            </Link>
            <div className="flex items-center gap-2 mt-0.5">
              {inf?.instagram_handle && <span className="text-xs text-gray-400">@{inf.instagram_handle}</span>}
              {inf?.followers_count && <span className="text-xs text-gray-400">{inf.followers_count.toLocaleString()} followers</span>}
              <span className="text-xs text-gray-400">via {application.initiated_by}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {application.proposed_rate && (
            <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">₹{application.proposed_rate.toLocaleString()}</span>
          )}
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${st.bg}`}>{st.label}</span>

          {application.status === "pending" && (
            <div className="flex items-center gap-1.5 ml-2">
              <button
                onClick={() => handleAction("accepted")}
                disabled={loading}
                className={`${btnBase} bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100`}
              >
                {loading ? <ButtonSpinner /> : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                Accept
              </button>
              <button
                onClick={() => setShowReject(!showReject)}
                disabled={loading}
                className={`${btnBase} bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-100`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                Reject
              </button>
            </div>
          )}

          {application.status === "accepted" && (
            <button
              onClick={() => handleAction("completed")}
              disabled={loading}
              className={`${btnBase} ml-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100`}
            >
              {loading ? <ButtonSpinner /> : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              Mark Complete
            </button>
          )}
        </div>
      </div>

      {/* Reject reason input */}
      {showReject && (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for rejection (optional)"
            className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={() => handleAction("rejected", reason || undefined)}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
          >
            {loading ? <ButtonSpinner /> : "Confirm Reject"}
          </button>
          <button onClick={() => setShowReject(false)} className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs cursor-pointer">Cancel</button>
        </div>
      )}

      {application.rejection_reason && application.status === "rejected" && (
        <p className="mt-2 text-xs text-red-500 dark:text-red-400">Reason: {application.rejection_reason}</p>
      )}

      {/* Date */}
      <p className="text-[11px] text-gray-400 mt-1.5">
        Applied {new Date(application.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
      </p>
    </div>
  );
}
