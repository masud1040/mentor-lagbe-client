"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { signOut } from "@/lib/auth-client";
import { clearJwtToken } from "@/lib/api/jwt-client";
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
  UserCircle,
  GraduationCap,
  Receipt,
  X,
  Sparkles,
  Loader2,
} from "lucide-react";

type UserRole = "student" | "mentor" | "admin";

interface DashboardUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
  isPremium?: boolean | null;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: Record<UserRole, NavSection[]> = {
  mentor: [
    {
      title: "Workspace",
      items: [
        { label: "Overview", href: "/dashboard/mentor", icon: LayoutDashboard },
        { label: "My Tuition Posts", href: "/dashboard/mentor/posts", icon: BookOpen },
        { label: "Create Post", href: "/dashboard/mentor/posts/create", icon: FilePlus2 },
        { label: "Applications", href: "/dashboard/mentor/applications", icon: Inbox },
      ],
    },
    {
      title: "Billing & Account",
      items: [
        { label: "Pricing & Plan", href: "/dashboard/mentor/pricing", icon: CreditCard },
        { label: "My Profile", href: "/dashboard/profile", icon: UserCircle },
      ],
    },
  ],
  student: [
    {
      title: "Workspace",
      items: [
        { label: "Overview", href: "/dashboard/student", icon: LayoutDashboard },
        { label: "My Applications", href: "/dashboard/student/applications", icon: CheckSquare },
      ],
    },
    {
      title: "Discover",
      items: [
        { label: "Browse Tuitions", href: "/tuitions", icon: Search },
        { label: "Find Mentors", href: "/mentors", icon: GraduationCap },
      ],
    },
    {
      title: "Account",
      items: [
        { label: "Pricing & Plan", href: "/pricing", icon: CreditCard },
        { label: "My Profile", href: "/dashboard/profile", icon: UserCircle },
      ],
    },
  ],
  admin: [
    {
      title: "Management",
      items: [
        { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
        { label: "Manage Tuitions", href: "/dashboard/admin/tuitions", icon: BookOpen },
        { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
        { label: "Payments & Revenue", href: "/dashboard/admin/payments", icon: Receipt },
      ],
    },
    {
      title: "Account",
      items: [
        { label: "My Profile", href: "/dashboard/profile", icon: UserCircle },
      ],
    },
  ],
};

export default function SideNavbar({ user }: { user: DashboardUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const [imgFailed, setImgFailed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const role: UserRole =
    user?.role === "mentor" || user?.role === "admin" || user?.role === "student"
      ? user.role
      : "student";

  const sections = NAV_SECTIONS[role];

  const handleCloseMobile = () => {
    setOpenMobile(false);
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      setOpenMobile(false);
      await signOut();
      clearJwtToken();
      toast.success("Logged out successfully!");
      window.location.href = "/sign-in";
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
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

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <Sidebar className="border-r border-slate-200/80 bg-white">
      {/* Header: Brand + Mobile Close Button */}
      <SidebarHeader className="border-b border-slate-100 px-4 py-4">
        <div className="flex items-center justify-between gap-2">
          <Link
            href="/"
            onClick={handleCloseMobile}
            className="flex min-w-0 items-center gap-2.5"
          >
            <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200/80 bg-white">
              <Image
                src="/logo.png"
                alt="MentorLagbe Logo"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-[17px] font-extrabold leading-tight tracking-tight text-slate-900">
                Mentor<span className="text-blue-600">Lagbe</span>
              </span>
              <span className="text-[11px] font-medium capitalize text-slate-400">
                {role} workspace
              </span>
            </div>
          </Link>

          {/* Mobile Drawer Close (X) Button */}
          <button
            type="button"
            onClick={handleCloseMobile}
            aria-label="Close sidebar"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 md:hidden"
          >
            <X className="size-4" />
          </button>
        </div>
      </SidebarHeader>

      {/* Grouped Navigation */}
      <SidebarContent className="px-3 py-4">
        <div className="space-y-5">
          {sections.map((section) => (
            <SidebarGroup key={section.title} className="p-0">
              <SidebarGroupLabel className="mb-1.5 h-auto px-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {section.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isRouteActive(item.href);

                    return (
                      <SidebarMenuItem key={item.href}>
                        <Link
                          href={item.href}
                          onClick={handleCloseMobile}
                          className={`group flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13.5px] transition-colors ${
                            active
                              ? "bg-slate-100 font-semibold text-slate-900"
                              : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <Icon
                            className={`size-4 shrink-0 transition-colors ${
                              active
                                ? "text-blue-600"
                                : "text-slate-400 group-hover:text-slate-600"
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </div>
      </SidebarContent>

      {/* Footer: Compact User Info + Subtle Sign Out */}
      <SidebarFooter className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/70 bg-slate-50/70 p-2">
          <Link
            href="/dashboard/profile"
            onClick={handleCloseMobile}
            className="flex min-w-0 flex-1 items-center gap-2.5"
          >
            {user?.image && !imgFailed ? (
              <Image
                src={user.image}
                alt={user?.name || "User"}
                onError={() => setImgFailed(true)}
                width={100}
                height={100}
                className="size-8 shrink-0 rounded-lg border border-slate-200/80 object-cover"
              />
            ) : (
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                {userInitial}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-[13px] font-semibold text-slate-900">
                  {user?.name || "User"}
                </p>
                {user?.isPremium && role !== "admin" && (
                  <span className="inline-flex shrink-0 items-center gap-0.5 rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-700">
                    <Sparkles className="size-2.5" /> Pro
                  </span>
                )}
              </div>
              <p className="truncate text-[11px] text-slate-500">
                {user?.email || ""}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            title="Sign out"
            aria-label="Sign out"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
          >
            {loggingOut ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <LogOut className="size-4" />
            )}
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}