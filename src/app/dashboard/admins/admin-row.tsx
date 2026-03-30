"use client";

import { useState } from "react";
import { removeAdmin } from "./actions";
import { ButtonSpinner } from "@/components/spinner";

interface Admin {
  id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
}

export function AdminRow({
  admin,
  isSuperAdmin,
  isCurrentUser,
}: {
  admin: Admin;
  isSuperAdmin: boolean;
  isCurrentUser: boolean;
}) {
  const [loading, setLoading] = useState(false);

  const roleColors: Record<string, string> = {
    super_admin: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    admin: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
    viewer: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
  };

  const roleLabels: Record<string, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    viewer: "Viewer",
  };

  const handleRemove = async () => {
    if (!confirm(`Remove ${admin.full_name} from admin access?`)) return;
    setLoading(true);
    const result = await removeAdmin(admin.id);
    if (result.error) {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
        {admin.full_name}
        {isCurrentUser && (
          <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">(you)</span>
        )}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{admin.email}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
            roleColors[admin.role] || roleColors.viewer
          }`}
        >
          {roleLabels[admin.role] || admin.role}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
        {new Date(admin.created_at).toLocaleDateString()}
      </td>
      {isSuperAdmin && (
        <td className="px-6 py-4">
          {!isCurrentUser && (
            <button
              onClick={handleRemove}
              disabled={loading}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <ButtonSpinner /> : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
              {loading ? "Removing..." : "Remove"}
            </button>
          )}
        </td>
      )}
    </tr>
  );
}
