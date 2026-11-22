"use client";

import React, { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "react-hot-toast";
import SideNavbar from "@/components/dashboard/SideNavbar";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      window.location.href = "/sign-in?from=dashboard-layout";
    }
  }, [isPending, session]);

  if (isPending || !session?.user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  const user = session.user;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50">
        {/* Dynamic Side Navbar */}
        <SideNavbar user={user} />

        {/* Main Content Area */}
        <main className="min-w-0 flex-1 flex flex-col">
          {/* Mobile/Collapsible Sidebar Trigger Header */}
          <div className="sticky top-0 z-20 flex items-center border-b border-slate-200 bg-white/80 px-6 py-3 backdrop-blur-md lg:hidden">
            <SidebarTrigger />
            <span className="ml-3 font-bold text-slate-800">
              MentorLagbe Dashboard
            </span>
          </div>

          <div className="flex-1 p-6 lg:p-10">{children}</div>
        </main>

        <Toaster position="top-center" />
      </div>
    </SidebarProvider>
  );
}