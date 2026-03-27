"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

export function DashboardShell({
  userEmail,
  children,
}: {
  userEmail: string;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar
        userEmail={userEmail}
        collapsed={!sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:ml-[260px] transition-all duration-300">
        <Header
          userEmail={userEmail}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
