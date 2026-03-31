import { createAdminClient } from "@/utils/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { RefreshButton } from "@/components/refresh-button";

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

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const verificationConfig: Record<string, { bg: string; dot: string }> = {
    verified: { bg: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
    rejected: { bg: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400", dot: "bg-red-500" },
    pending: { bg: "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400", dot: "bg-yellow-500" },
    not_applied: { bg: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400", dot: "bg-gray-400" },
  };
  const vs = verificationConfig[brand.verification_status] || verificationConfig.not_applied;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/brands" className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div className="flex items-center gap-4">
            {brand.logo_url ? (
              <img src={brand.logo_url} alt="" className="w-16 h-16 rounded-2xl object-cover border-2 border-white dark:border-gray-800 shadow-lg" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">{brand.brand_name?.[0]?.toUpperCase() || "?"}</span>
              </div>
            )}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{brand.brand_name || "Unknown"}</h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${vs.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${vs.dot}`} />{brand.verification_status || "not_applied"}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                {brand.instagram_username && <span className="text-sm text-gray-500 dark:text-gray-400">@{brand.instagram_username}</span>}
                {brand.contact_name && (<><span className="text-gray-300 dark:text-gray-700">|</span><span className="text-sm text-gray-400 dark:text-gray-500">{brand.contact_name}</span></>)}
                <span className="text-gray-300 dark:text-gray-700">|</span>
                <span className="text-sm text-gray-400 dark:text-gray-500">Joined {formatDate(brand.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
        <RefreshButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {(brand.short_description || brand.full_description) && (
            <Card icon="M4 6h16M4 12h16M4 18h7" color="indigo" title="About">
              {brand.short_description && <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{brand.short_description}</p>}
              {brand.full_description && <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{brand.full_description}</p>}
            </Card>
          )}

          <Card icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" color="emerald" title="Contact Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem label="Contact Name" value={brand.contact_name || "—"} />
              <InfoItem label="Contact Role" value={brand.contact_role || "—"} />
              <InfoItem label="Email" value={brand.contact_email || "—"} />
              <InfoItem label="Phone" value={brand.contact_phone || "—"} />
              <InfoItem label="Instagram" value={brand.instagram_username ? `@${brand.instagram_username}` : "—"} />
              <InfoItem label="Website" value={brand.website_url || "—"} />
            </div>
          </Card>

          {brand.gstin && (
            <Card icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" color="amber" title="GSTIN Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem label="GSTIN" value={brand.gstin} />
                <InfoItem label="Legal Name" value={brand.gstin_legal_name || "—"} />
                <InfoItem label="Trade Name" value={brand.gstin_trade_name || "—"} />
                <InfoItem label="Business Type" value={brand.gstin_business_type || "—"} />
                <InfoItem label="GSTIN Status" value={brand.gstin_status || "—"} />
                <InfoItem label="Registration Date" value={brand.gstin_registration_date || "—"} />
                <InfoItem label="State" value={brand.gstin_state || "—"} />
                <InfoItem label="Pincode" value={brand.gstin_pincode || "—"} />
                {brand.gstin_address && <div className="sm:col-span-2"><InfoItem label="Address" value={brand.gstin_address} /></div>}
              </div>
            </Card>
          )}

          <details className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
            <summary className="px-6 py-4 text-sm font-medium text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300">Raw Data</summary>
            <div className="px-6 pb-6"><pre className="text-xs text-gray-500 dark:text-gray-400 overflow-auto whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 rounded-xl p-4">{JSON.stringify(brand, null, 2)}</pre></div>
          </details>
        </div>

        <div className="space-y-6">
          <SidebarTable title="Overview" rows={[
            ["Status", brand.status || "—"],
            ["Verification", brand.verification_status || "—"],
            ["Listing", brand.listing_type || "—"],
            ["Tier", brand.tier || "—"],
            ["Source", brand.source || "—"],
            ["Completion", brand.profile_completion ? `${brand.profile_completion}%` : "—"],
          ]} />
          <SidebarTable title="Preferences" rows={[
            ["Budget Range", brand.monthly_budget_range || "—"],
            ["Influencer Tier", brand.preferred_influencer_tier || "—"],
          ]} />
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800"><h2 className="text-sm font-semibold text-gray-900 dark:text-white">Timeline</h2></div>
            <div className="p-5 space-y-3">
              <DateItem label="Created" date={formatDate(brand.created_at)} />
              <DateItem label="Updated" date={formatDate(brand.updated_at)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ icon, color, title, children }: { icon: string; color: string; title: string; children: React.ReactNode }) {
  const bg: Record<string, string> = { indigo: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400", amber: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400", emerald: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" };
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2.5">
        <div className={`w-8 h-8 rounded-lg ${bg[color]} flex items-center justify-center`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} /></svg></div>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (<div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50"><p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</p><p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5 break-words">{value}</p></div>);
}

function SidebarTable({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800"><h2 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h2></div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {rows.map(([l, v]) => (<div key={l} className="flex items-center justify-between px-6 py-3.5"><span className="text-[13px] text-gray-500 dark:text-gray-400">{l}</span><span className="text-[13px] font-semibold text-gray-900 dark:text-white">{v}</span></div>))}
      </div>
    </div>
  );
}

function DateItem({ label, date }: { label: string; date: string }) {
  return (<div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" /><div className="flex-1 flex items-center justify-between"><span className="text-[13px] text-gray-500 dark:text-gray-400">{label}</span><span className="text-[13px] font-medium text-gray-900 dark:text-white">{date}</span></div></div>);
}
