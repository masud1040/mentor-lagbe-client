"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import {
  fetchUsersApi,
  updateUserRoleApi,
  toggleUserBanApi,
} from "@/lib/api/user-api";
import {
  Users,
  Search,
  Download,
  ShieldCheck,
  ShieldOff,
  Ban,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type UserRole = "student" | "mentor" | "admin";
type RoleFilter = "all" | UserRole;

interface UserRow {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  banned?: boolean;
  isPremium?: boolean;
  createdAt?: string;
}

const ROLE_TABS: { key: RoleFilter; label: string }[] = [
  { key: "all", label: "All Users" },
  { key: "student", label: "Students" },
  { key: "mentor", label: "Mentors" },
  { key: "admin", label: "Admins" },
];

const formatJoinDate = (createdAt?: string) => {
  if (!createdAt) return "N/A";
  return new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

function ManageUsersContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const currentUserId = session?.user?.id;

  // URL theke initial filter & search read kora
  const urlRole = (searchParams.get("role") as RoleFilter) || "all";
  const urlSearch = searchParams.get("search") || "";

  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // URL query update korar helper function
  const updateUrlParams = (nextRole: RoleFilter, nextSearch: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextRole && nextRole !== "all") {
      params.set("role", nextRole);
    } else {
      params.delete("role");
    }

    if (nextSearch.trim()) {
      params.set("search", nextSearch.trim());
    } else {
      params.delete("search");
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  // Search input debounce kore URL-e sync kora
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== urlSearch) {
        updateUrlParams(urlRole, searchInput);
      }
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // All users load kora
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const data = await fetchUsersApi();
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const counts = useMemo(
    () => ({
      all: users.length,
      student: users.filter((u) => (u.role || "student") === "student").length,
      mentor: users.filter((u) => u.role === "mentor").length,
      admin: users.filter((u) => u.role === "admin").length,
    }),
    [users]
  );

  const visibleUsers = useMemo(() => {
    const q = urlSearch.trim().toLowerCase();
    return users.filter((user) => {
      const userRole = user.role || "student";
      const matchesRole = urlRole === "all" || userRole === urlRole;
      const matchesSearch =
        !q ||
        `${user.name || ""} ${user.email || ""}`.toLowerCase().includes(q);
      return matchesRole && matchesSearch;
    });
  }, [users, urlRole, urlSearch]);

  // Role Change (Make Admin / Remove Admin / Switch Role)
  const handleRoleChange = async (id: string, nextRole: UserRole) => {
    if (id === currentUserId) {
      toast.error("You cannot change your own role.");
      return;
    }

    setActionLoading(`role-${id}`);
    try {
      const { ok, data } = await updateUserRoleApi(id, nextRole);
      if (ok && data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, role: nextRole } : u))
        );
        toast.success(`User role updated to ${nextRole}.`);
      } else {
        toast.error(data.message || "Failed to update role.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setActionLoading(null);
    }
  };

  // Block / Unblock User
  const handleToggleBan = async (user: UserRow) => {
    if (user._id === currentUserId) {
      toast.error("You cannot block your own account.");
      return;
    }

    const nextBanned = !user.banned;
    const confirmMsg = nextBanned
      ? `Are you sure you want to block ${user.name}?`
      : `Unblock ${user.name}?`;

    if (!confirm(confirmMsg)) return;

    setActionLoading(`ban-${user._id}`);
    try {
      const { ok, data } = await toggleUserBanApi(user._id, nextBanned);
      if (ok && data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === user._id ? { ...u, banned: nextBanned } : u
          )
        );
        toast.success(nextBanned ? "User blocked." : "User unblocked.");
      } else {
        toast.error(data.message || "Failed to update status.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setActionLoading(null);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ["Name", "Email", "Role", "Status", "Join Date"];
    const rows = visibleUsers.map((u) => [
      `"${u.name || ""}"`,
      `"${u.email || ""}"`,
      u.role || "student",
      u.banned ? "Blocked" : "Active",
      `"${formatJoinDate(u.createdAt)}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `mentorlagbe-users-${urlRole}.csv`;
    link.click();
  };

  return (
    <div className="mx-auto max-w-[1150px] space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:p-8">
        <div>
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
            <Users size={14} /> User Directory
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Manage Users
          </h1>
          <p className="mt-1 text-[15px] font-medium text-slate-500">
            Filter students &amp; mentors, assign or remove admin access, and block accounts.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleExportCsv}
          variant="outline"
          className="h-11 rounded-xl border-slate-200 bg-white px-4 font-bold text-slate-700 hover:bg-slate-50"
        >
          <Download className="mr-2 size-4" /> Export CSV
        </Button>
      </div>

      {/* Role Filter Tabs + Search Toolbar */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-3 shadow-xs lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-1.5">
          {ROLE_TABS.map((tab) => {
            const active = urlRole === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => updateUrlParams(tab.key, searchInput)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-extrabold ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {counts[tab.key]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white"
          />
        </div>
      </div>

      {/* High-Density Users Table */}
      <section className="overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white shadow-xs">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-blue-600" />
          </div>
        ) : visibleUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="mb-3 size-12 text-slate-300" />
            <h3 className="text-lg font-bold text-slate-900">No users found</h3>
            <p className="mt-1 text-sm text-slate-500">
              No users match your current role filter or search.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-4 py-3.5">Email</th>
                  <th className="px-4 py-3.5">Role</th>
                  <th className="px-4 py-3.5">Join Date</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm">
                {visibleUsers.map((user) => {
                  const role = user.role || "student";
                  const isSelf = user._id === currentUserId;
                  const isBanned = Boolean(user.banned);

                  return (
                    <tr
                      key={user._id}
                      className="transition-colors hover:bg-slate-50/70"
                    >
                      {/* Avatar + Name */}
                      <td className={`px-5 py-3.5 ${isBanned ? "opacity-60" : ""}`}>
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-extrabold text-blue-600">
                            {(user.name || "U").charAt(0).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-bold text-slate-900">
                              {user.name || "Unnamed"}
                              {isSelf && (
                                <span className="ml-1.5 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                                  You
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className={`px-4 py-3.5 text-slate-500 ${isBanned ? "opacity-60" : ""}`}>
                        {user.email}
                      </td>

                      {/* Role Pill */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                            role === "admin"
                              ? "bg-purple-50 text-purple-700"
                              : role === "mentor"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {role}
                        </span>
                      </td>

                      {/* Join Date */}
                      <td className={`px-4 py-3.5 text-slate-500 ${isBanned ? "opacity-60" : ""}`}>
                        {formatJoinDate(user.createdAt)}
                      </td>

                      {/* Status Pill */}
                      <td className="px-4 py-3.5">
                        {isBanned ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-600">
                            <Ban size={12} /> Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                            <CheckCircle2 size={12} /> Active
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          {/* Make Admin / Remove Admin */}
                          {role === "admin" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isSelf || actionLoading === `role-${user._id}`}
                              onClick={() => handleRoleChange(user._id, "student")}
                              className="h-8 rounded-lg border-amber-200 bg-amber-50 px-2.5 text-xs font-bold text-amber-700 hover:bg-amber-100"
                            >
                              {actionLoading === `role-${user._id}` ? (
                                <Loader2 className="mr-1 size-3.5 animate-spin" />
                              ) : (
                                <ShieldOff className="mr-1 size-3.5" />
                              )}
                              Remove Admin
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isSelf || actionLoading === `role-${user._id}`}
                              onClick={() => handleRoleChange(user._id, "admin")}
                              className="h-8 rounded-lg border-blue-200 bg-blue-50 px-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100"
                            >
                              {actionLoading === `role-${user._id}` ? (
                                <Loader2 className="mr-1 size-3.5 animate-spin" />
                              ) : (
                                <ShieldCheck className="mr-1 size-3.5" />
                              )}
                              Make Admin
                            </Button>
                          )}

                          {/* Block / Unblock */}
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isSelf || actionLoading === `ban-${user._id}`}
                            onClick={() => handleToggleBan(user)}
                            className={`h-8 rounded-lg px-2.5 text-xs font-bold ${
                              isBanned
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                            }`}
                          >
                            {actionLoading === `ban-${user._id}` ? (
                              <Loader2 className="mr-1 size-3.5 animate-spin" />
                            ) : isBanned ? (
                              <CheckCircle2 className="mr-1 size-3.5" />
                            ) : (
                              <Ban className="mr-1 size-3.5" />
                            )}
                            {isBanned ? "Unblock" : "Block"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default function AdminManageUsersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <Loader2 className="size-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <ManageUsersContent />
    </Suspense>
  );
}