"use client";

import { useState } from "react";
import { removeAdmin } from "./actions";

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
              className="text-sm text-red-500 hover:text-red-700 disabled:text-red-300 transition-colors cursor-pointer"
            >
              {loading ? "Removing..." : "Remove"}
            </button>
          )}
        </td>
      )}
    </tr>
  );
}
