"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

export function Header({
  userEmail,
  onToggleSidebar,
}: {
  userEmail: string;
  onToggleSidebar: () => void;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const initials = userEmail
    ? userEmail
        .split("@")[0]
        .split(/[._-]/)
        .map((p) => p[0]?.toUpperCase())
        .slice(0, 2)
        .join("")
    : "A";

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 gap-4">
      {/* Left: hamburger + search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer lg:hidden"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-sm hover:bg-gray-150 dark:hover:bg-gray-750 transition-colors cursor-pointer w-64"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Search...</span>
          <kbd className="ml-auto text-[10px] font-mono bg-white dark:bg-gray-700 text-gray-400 dark:text-gray-500 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-600">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        <ThemeToggle />

        {/* Notifications */}
        <button className="relative p-2.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Settings */}
        <button className="p-2.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Separator */}
        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2" />

        {/* User avatar */}
        <div className="flex items-center gap-3 pl-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-xs font-bold text-white">{initials}</span>
          </div>
        </div>
      </div>

      {/* Search modal overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-start justify-center pt-24"
          onClick={() => {
            setSearchOpen(false);
            setSearchQuery("");
          }}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pages, influencers, brands..."
                className="flex-1 bg-transparent text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none"
              />
              <kbd className="text-[10px] font-mono bg-gray-100 dark:bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">
                ESC
              </kbd>
            </div>
            <div className="p-3 max-h-80 overflow-y-auto">
              {[
                { label: "Overview", href: "/dashboard" },
                { label: "Influencers", href: "/dashboard/influencers" },
                { label: "Brands", href: "/dashboard/brands" },
                { label: "Campaigns", href: "/dashboard/campaigns" },
                { label: "Create Campaign", href: "/dashboard/campaigns/create" },
                { label: "Admins", href: "/dashboard/admins" },
              ]
                .filter((item) =>
                  item.label.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item) => (
                  <button
                    key={item.href}
                    onClick={() => {
                      router.push(item.href);
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer flex items-center gap-3"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                    {item.label}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
