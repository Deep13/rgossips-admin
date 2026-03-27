import { createAdminClient } from "@/utils/supabase/admin";
import { FilterBar } from "@/components/filter-bar";
import { BrandRow } from "./brand-row";
import { AddBrandForm } from "./add-brand-form";

const filterFields = [
  { name: "search", label: "Search", type: "text" as const, placeholder: "Search by brand name..." },
  {
    name: "verification",
    label: "Verification",
    type: "select" as const,
    options: [
      { label: "Pending", value: "pending" },
      { label: "Verified", value: "verified" },
      { label: "Rejected", value: "rejected" },
    ],
  },
];

export default async function BrandsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { search, verification } = await searchParams;
  const supabase = createAdminClient();

  let query = supabase
    .from("brand_profiles")
    .select("brand_id, brand_name, logo_url, contact_phone, verification_status, gstin")
    .order("updated_at", { ascending: false });

  if (search) {
    query = query.or(`brand_name.ilike.%${search}%,gstin.ilike.%${search}%`);
  }
  if (verification) {
    query = query.eq("verification_status", verification);
  }

  const { data: brands, error } = await query;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Brands</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage brand profiles</p>
        </div>
      </div>

      <AddBrandForm />

      <FilterBar fields={filterFields} />

      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm mb-6">
          Failed to load brands: {error.message}
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                Brand Name
              </th>
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                Contact Number
              </th>
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                Verification
              </th>
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                GSTIN
              </th>
              <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {brands && brands.length > 0 ? (
              brands.map((brand) => (
                <BrandRow key={brand.brand_id} brand={brand} />
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-400 dark:text-gray-500 text-sm"
                >
                  No brands found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
