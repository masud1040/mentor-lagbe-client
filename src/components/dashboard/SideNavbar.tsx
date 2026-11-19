"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FilePlus2,
  BookOpen,
  Users,
  CheckSquare,
  CreditCard,
  LogOut,
  Search,
  Inbox,
  ChevronRight,
  UserCircle,
} from "lucide-react";

type UserRole = "student" | "mentor" | "admin";

interface DashboardUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  mentor: [
    { label: "Overview", href: "/dashboard/mentor", icon: LayoutDashboard },
    { label: "My Tuition Posts", href: "/dashboard/mentor/posts", icon: BookOpen },
    { label: "Create Post", href: "/dashboard/mentor/posts/create", icon: FilePlus2 },
    { label: "Applications", href: "/dashboard/mentor/applications", icon: Inbox },
    { label: "Pricing & Plan", href: "/dashboard/mentor/pricing", icon: CreditCard },
    { label: "My Profile", href: "/dashboard/profile", icon: UserCircle },
  ],
  student: [
    { label: "Overview", href: "/dashboard/student", icon: LayoutDashboard },
    { label: "Browse Tuitions", href: "/tuitions", icon: Search },
    { label: "My Applications", href: "/dashboard/student/applications", icon: CheckSquare },
    { label: "My Profile", href: "/dashboard/profile", icon: UserCircle },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Tuitions", href: "/dashboard/admin/tuitions", icon: BookOpen },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "My Profile", href: "/dashboard/profile", icon: UserCircle },
  ],
};

export default function SideNavbar({ user }: { user: DashboardUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  const role: UserRole =
    user?.role === "mentor" || user?.role === "admin" || user?.role === "student"
      ? user.role
      : "student";

  const menuItems = NAV_ITEMS[role];

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  const handleLogout = async () => {
    setOpenMobile(false);
    await signOut();
    router.push("/sign-in");
    router.refresh();
  };

  const isRouteActive = (href: string) => {
    if (href === `/dashboard/${role}`) {
      return pathname === href;
    }
    if (href === "/dashboard/mentor/posts") {
      return (
        pathname === href ||
        (pathname.startsWith("/dashboard/mentor/posts/") &&
          !pathname.startsWith("/dashboard/mentor/posts/create"))
      );
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <Sidebar className="border-r border-slate-200/80 bg-white">
      {/* Logo Header */}
      <SidebarHeader className="border-b border-slate-100 px-5 py-5">
        <Link
          href="/"
          onClick={handleLinkClick}
          className="group flex items-center gap-3"
        >
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-sm transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="MentorLagbe Logo"
              fill
              className="object-contain p-1"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[19px] font-extrabold leading-none tracking-tight text-slate-900">
              Mentor<span className="text-blue-600">Lagbe</span>
            </span>
            <span className="mt-1 inline-flex w-fit items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600">
              {role} workspace
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Navigation Links */}
      <SidebarContent className="px-3.5 py-5">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="mb-2 px-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isRouteActive(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className={`group relative flex h-11 items-center justify-between rounded-xl px-3.5 text-[14px] font-semibold transition-all duration-200 ${
                        active
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                          : "text-slate-600 hover:bg-slate-100/90 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`size-[18px] shrink-0 transition-colors ${
                            active
                              ? "text-white"
                              : "text-slate-400 group-hover:text-blue-600"
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {active && (
                        <ChevronRight className="size-4 text-white/80" />
                      )}
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile & Logout Footer */}
      <SidebarFooter className="border-t border-slate-100 bg-slate-50/50 p-4">
        <Link
          href="/dashboard/profile"
          onClick={handleLinkClick}
          className="mb-3 flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white p-2.5 shadow-xs transition-colors hover:border-blue-200"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-sm">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-bold text-slate-900">
              {user?.name || "User"}
            </p>
            <p className="truncate text-[11.5px] font-medium text-slate-500">
              {user?.email || ""}
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200/70 bg-rose-50/70 px-4 py-2.5 text-[13.5px] font-bold text-rose-600 transition-all hover:bg-rose-600 hover:text-white active:scale-[0.98]"
        >
          <LogOut className="size-4" />
          <span>Sign Out</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}