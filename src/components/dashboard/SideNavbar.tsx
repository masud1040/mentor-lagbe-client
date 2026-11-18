"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings, 
  LogOut, 
  ShieldAlert,
  CreditCard,
  FileText
} from "lucide-react";

interface UserProps {
  user: {
    name: string;
    email: string;
    role?: string;
    image?: string | null;
  };
}

export default function SideNavbar({ user }: UserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const role = user.role || "student";

  // Role onujayi menu items define kora
  const getMenuItems = () => {
    if (role === "admin") {
      return [
        { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
        { name: "Manage Mentors", href: "/dashboard/admin/mentors", icon: Users },
        { name: "All Tuitions", href: "/dashboard/admin/tuitions", icon: BookOpen },
        { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
      ];
    } else if (role === "mentor") {
      return [
        { name: "Dashboard", href: "/dashboard/mentor", icon: LayoutDashboard },
        { name: "My Tuition Posts", href: "/dashboard/mentor/posts", icon: FileText },
        { name: "Student Requests", href: "/dashboard/mentor/requests", icon: Users },
        { name: "Subscription", href: "/dashboard/mentor/pricing", icon: CreditCard },
      ];
    } else {
      // Default: Student
      return [
        { name: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
        { name: "Find Mentors", href: "/dashboard/student/mentors", icon: Users },
        { name: "My Bookings", href: "/dashboard/student/bookings", icon: BookOpen },
        { name: "Billing", href: "/dashboard/student/billing", icon: CreditCard },
      ];
    }
  };

  const menuItems = getMenuItems();

  // Logout handler
  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully!");
            router.push("/sign-in");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Failed to log out.");
    }
  };

  return (
    <aside className="flex h-screen w-72 flex-col justify-between border-r border-slate-200 bg-white p-6 sticky top-0 shadow-sm">
      
      {/* Top Section: Logo & User Info */}
      <div>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-8 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-extrabold shadow-md shadow-blue-600/20 transition-transform group-hover:scale-105">
            M
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Mentor<span className="text-blue-600">Lagbe</span>
          </span>
        </Link>

        {/* User Profile Card Box */}
        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold text-lg uppercase">
            {user.name ? user.name[0] : "U"}
          </div>
          <div className="overflow-hidden">
            <h4 className="truncate text-[15px] font-bold text-slate-900">
              {user.name || "User"}
            </h4>
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-600 capitalize tracking-wider mt-0.5">
              {role}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Logout Button */}
      <div className="border-t border-slate-100 pt-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-semibold text-rose-600 transition-colors hover:bg-rose-50"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>

    </aside>
  );
}