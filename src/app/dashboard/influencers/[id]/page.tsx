import { createAdminClient } from "@/utils/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function InfluencerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: inf, error } = await supabase
    .from("influencer_profiles")
    .select("*")
    .eq("influencer_id", id)
    .single();

  if (error || !inf) notFound();

  const fields = [
    { label: "Full Name", value: inf.full_name },
    { label: "Username", value: inf.username },
    { label: "Email", value: inf.email },
    { label: "Phone", value: inf.phone },
    { label: "Instagram Handle", value: inf.instagram_handle ? `@${inf.instagram_handle}` : null },
    { label: "Followers", value: inf.followers_count?.toLocaleString() },
    { label: "Category", value: inf.category },
    { label: "City", value: inf.city },
    { label: "State", value: inf.state },
    { label: "Country", value: inf.country },
    { label: "Bio", value: inf.bio },
    { label: "Status", value: inf.status },
    { label: "Created", value: inf.created_at ? new Date(inf.created_at).toLocaleString() : null },
    { label: "Updated", value: inf.updated_at ? new Date(inf.updated_at).toLocaleString() : null },
  ];

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/influencers"
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-4 inline-block"
        >
          &larr; Back to Influencers
        </Link>
        <div className="flex items-center gap-4">
          {inf.profile_photo_url ? (
            <img
              src={inf.profile_photo_url}
              alt=""
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xl font-bold">
              {inf.full_name?.[0] || "?"}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {inf.full_name || "Unknown"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              {inf.username && (
                <span className="text-gray-500 dark:text-gray-400 text-sm">@{inf.username}</span>
              )}
              <span
                className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  inf.status === "active"
                    ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}
              >
                {inf.status || "unknown"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {fields.map((field) => (
            <div key={field.label} className="px-6 py-4 flex">
              <dt className="w-40 shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400">
                {field.label}
              </dt>
              <dd className="text-sm text-gray-900 dark:text-white">
                {field.value || "—"}
              </dd>
            </div>
          ))}
        </div>
      </div>

      {/* Raw JSON for any extra fields */}
      <details className="mt-6">
        <summary className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
          View raw data
        </summary>
        <pre className="mt-2 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-700 dark:text-gray-300 overflow-x-auto">
          {JSON.stringify(inf, null, 2)}
        </pre>
      </details>
    </div>
  );
}
