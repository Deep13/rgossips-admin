"use client";

import { useState } from "react";
import { ButtonSpinner } from "@/components/spinner";
import { deleteInfluencerInvitation } from "./actions";

interface Invitation {
  id: string;
  full_name: string;
  instagram_username: string;
  profile_photo_url: string | null;
  notes: string | null;
  status: string;
  created_at: string;
}

export function InvitedInfluencerRow({ invitation }: { invitation: Invitation }) {
  const [loading, setLoading] = useState(false);
  const [removed, setRemoved] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Remove invitation for @${invitation.instagram_username}?`)) return;
    setLoading(true);
    const result = await deleteInfluencerInvitation(invitation.id);
    if (result.error) alert(result.error);
    else setRemoved(true);
    setLoading(false);
  };

  if (removed) return null;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {invitation.profile_photo_url ? (
            <img src={invitation.profile_photo_url} alt="" className="w-11 h-11 rounded-xl object-cover border border-gray-200 dark:border-gray-700" />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <span className="text-sm font-bold text-white">{invitation.full_name[0]?.toUpperCase()}</span>
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{invitation.full_name}</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">@{invitation.instagram_username}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Awaiting Claim
        </span>
      </div>
      {invitation.notes && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{invitation.notes}</p>}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
        <span className="text-[11px] text-gray-400 dark:text-gray-500">Created {new Date(invitation.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
        <button onClick={handleDelete} disabled={loading} className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-500 hover:text-red-600 cursor-pointer disabled:opacity-50">
          {loading ? <ButtonSpinner /> : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
          Remove
        </button>
      </div>
    </div>
  );
}
