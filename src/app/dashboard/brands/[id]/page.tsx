import { createAdminClient } from "@/utils/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: brand, error } = await supabase
    .from("brand_profiles")
    .select("*")
    .eq("brand_id", id)
    .single();

  if (error || !brand) notFound();

  const fields = [
    { label: "Brand Name", value: brand.brand_name },
    { label: "Contact Name", value: brand.contact_name },
    { label: "Contact Email", value: brand.contact_email },
    { label: "Phone", value: brand.phone },
    { label: "Instagram", value: brand.instagram_username ? `@${brand.instagram_username}` : null },
    { label: "Website", value: brand.website },
    { label: "GSTIN", value: brand.gstin },
    { label: "Industry", value: brand.industry },
    { label: "City", value: brand.city },
    { label: "State", value: brand.state },
    { label: "Country", value: brand.country },
    { label: "Description", value: brand.description },
    { label: "Status", value: brand.status },
    { label: "Created", value: brand.created_at ? new Date(brand.created_at).toLocaleString() : null },
    { label: "Updated", value: brand.updated_at ? new Date(brand.updated_at).toLocaleString() : null },
  ];

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/brands"
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-4 inline-block"
        >
          &larr; Back to Brands
        </Link>
        <div className="flex items-center gap-4">
          {brand.logo_url ? (
            <img
              src={brand.logo_url}
              alt=""
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xl font-bold">
              {brand.brand_name?.[0] || "?"}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {brand.brand_name || "Unknown"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              {brand.contact_name && (
                <span className="text-gray-500 dark:text-gray-400 text-sm">{brand.contact_name}</span>
              )}
              <span
                className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  brand.status === "active"
                    ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}
              >
                {brand.status || "unknown"}
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
          {JSON.stringify(brand, null, 2)}
        </pre>
      </details>
    </div>
  );
}
