import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { Toaster } from "react-hot-toast";
import SideNavbar from "@/components/dashboard/SideNavbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // সেশন চেক করে ইউজার ডেটা ফেচ করা
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Dashboard Session Error:", error);
  }

  if (!session || !session.user) {
    redirect("/sign-in");
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
            <span className="ml-3 font-bold text-slate-800">MentorLagbe Dashboard</span>
          </div>

          <div className="flex-1 p-6 lg:p-10">
            {children}
          </div>
        </main>

        <Toaster position="top-center" />
      </div>
    </SidebarProvider>
  );
}