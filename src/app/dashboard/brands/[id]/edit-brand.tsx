"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateBrand } from "../actions";
import { ButtonSpinner } from "@/components/spinner";

const inputClass = "w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";
const labelClass = "block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5";

export function EditBrandButton({ brand }: { brand: any }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Edit
      </button>
      {open && <EditBrandModal brand={brand} onClose={() => setOpen(false)} />}
    </>
  );
}

function EditBrandModal({ brand, onClose }: { brand: any; onClose: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setError("");
    setLoading(true);
    const result = await updateBrand(brand.brand_id, formData);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.refresh();
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed z-50 inset-4 lg:inset-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-w-2xl lg:max-h-[85vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Brand</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form action={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Brand Name</label>
              <input name="brand_name" type="text" defaultValue={brand.brand_name || ""} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Instagram Username</label>
              <input name="instagram_username" type="text" defaultValue={brand.instagram_username || ""} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Contact Name</label>
              <input name="contact_name" type="text" defaultValue={brand.contact_name || ""} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Contact Role</label>
              <input name="contact_role" type="text" defaultValue={brand.contact_role || ""} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Contact Email</label>
              <input name="contact_email" type="email" defaultValue={brand.contact_email || ""} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Contact Phone</label>
              <input name="contact_phone" type="tel" defaultValue={brand.contact_phone || ""} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Website</label>
              <input name="website_url" type="text" defaultValue={brand.website_url || ""} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>GSTIN</label>
              <input name="gstin" type="text" defaultValue={brand.gstin || ""} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select name="status" defaultValue={brand.status || "active"} className={inputClass}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Verification</label>
              <select name="verification_status" defaultValue={brand.verification_status || "not_applied"} className={inputClass}>
                <option value="not_applied">Not Applied</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Tier</label>
              <select name="tier" defaultValue={brand.tier || ""} className={inputClass}>
                <option value="">None</option>
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Listing Type</label>
              <select name="listing_type" defaultValue={brand.listing_type || "free"} className={inputClass}>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Monthly Budget Range</label>
              <input name="monthly_budget_range" type="text" defaultValue={brand.monthly_budget_range || ""} placeholder="e.g. 50K - 1L" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Preferred Influencer Tier</label>
              <input name="preferred_influencer_tier" type="text" defaultValue={brand.preferred_influencer_tier || ""} placeholder="e.g. micro, macro" className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Short Description</label>
            <input name="short_description" type="text" defaultValue={brand.short_description || ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Full Description</label>
            <textarea name="full_description" rows={3} defaultValue={brand.full_description || ""} className={`${inputClass} resize-none`} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 text-white text-sm font-semibold transition-colors cursor-pointer">
              {loading && <ButtonSpinner />}{loading ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium cursor-pointer">Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
}
