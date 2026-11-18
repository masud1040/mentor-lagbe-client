"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  fetchTuitions,
  updateTuitionAdminStatusApi,
  deleteTuitionApi,
} from "@/lib/api/tuition-api";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Search,
  MapPin,
  DollarSign,
  BookOpen,
  User,
  ExternalLink,
  Loader2,
  RotateCcw,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TuitionPost {
  _id: string;
  title: string;
  subject: string;
  category: string;
  location: string;
  budget: number;
  description: string;
  authorName?: string;
  status: "active" | "closed";
  adminStatus: "pending" | "approved" | "rejected";
  createdAt: string;
}

type FilterTab = "all" | "pending" | "approved" | "rejected";

export default function AdminManageTuitionsPage() {
  const [posts, setPosts] = useState<TuitionPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const data = await fetchTuitions();
        setPosts(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Failed to load tuition posts.");
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const handleStatusChange = async (
    id: string,
    newStatus: "approved" | "rejected"
  ) => {
    setActionLoading(`${newStatus}-${id}`);
    try {
      const { ok, data } = await updateTuitionAdminStatusApi(id, newStatus);
      if (ok && data.success) {
        setPosts((prev) =>
          prev.map((post) =>
            post._id === id ? { ...post, adminStatus: newStatus } : post
          )
        );
        toast.success(
          newStatus === "approved"
            ? "Post approved and published to website!"
            : "Post has been rejected."
        );
      } else {
        toast.error(data.message || "Failed to update status.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this post?")) return;
    setActionLoading(`delete-${id}`);
    try {
      const { ok } = await deleteTuitionApi(id);
      if (ok) {
        setPosts((prev) => prev.filter((post) => post._id !== id));
        toast.success("Post deleted permanently.");
      } else {
        toast.error("Failed to delete post.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setActionLoading(null);
    }
  };

  const counts = useMemo(
    () => ({
      all: posts.length,
      pending: posts.filter((p) => p.adminStatus === "pending").length,
      approved: posts.filter((p) => p.adminStatus === "approved").length,
      rejected: posts.filter((p) => p.adminStatus === "rejected").length,
    }),
    [posts]
  );

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTab = activeTab === "all" || post.adminStatus === activeTab;
      const matchesSearch =
        !q ||
        post.title?.toLowerCase().includes(q) ||
        post.subject?.toLowerCase().includes(q) ||
        post.location?.toLowerCase().includes(q) ||
        post.authorName?.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [posts, activeTab, search]);

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All Posts", count: counts.all },
    { key: "pending", label: "Pending", count: counts.pending },
    { key: "approved", label: "Approved", count: counts.approved },
    { key: "rejected", label: "Rejected", count: counts.rejected },
  ];

  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:p-8">
        <div>
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
            <ShieldCheck size={14} /> Admin Moderation
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Manage Tuition Posts
          </h1>
          <p className="mt-1 text-[15px] font-medium text-slate-500">
            Review mentor submissions, approve posts for public view, or manage rejected listings.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search title, subject, mentor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 focus-visible:bg-white"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-100 bg-white p-2 shadow-xs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-extrabold ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="flex items-center justify-center rounded-[2rem] border border-slate-100 bg-white py-20">
          <Loader2 className="size-8 animate-spin text-blue-600" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-slate-100 bg-white py-20 text-center shadow-xs">
          <AlertCircle className="mb-3 size-12 text-slate-300" />
          <h3 className="text-lg font-bold text-slate-900">No posts found</h3>
          <p className="mt-1 text-sm text-slate-500">
            No tuition posts match your current filter or search.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {filteredPosts.map((post) => (
            <div
              key={post._id}
              className="flex flex-col gap-6 rounded-[1.75rem] border border-slate-200/70 bg-white p-6 shadow-xs transition-all hover:border-blue-200 hover:shadow-md lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  {post.adminStatus === "approved" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                      <CheckCircle2 size={13} /> Approved
                    </span>
                  )}
                  {post.adminStatus === "pending" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-600">
                      <Clock size={13} /> Pending
                    </span>
                  )}
                  {post.adminStatus === "rejected" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-600">
                      <XCircle size={13} /> Rejected
                    </span>
                  )}
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    {post.category}
                  </span>
                </div>

                <div>
                  <Link
                    href={`/tuitions/${post._id}`}
                    className="group inline-flex items-center gap-2 text-xl font-extrabold text-slate-900 transition-colors hover:text-blue-600"
                  >
                    <span className="line-clamp-1">{post.title}</span>
                    <ExternalLink className="size-4 shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                    {post.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[13.5px] font-semibold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <User size={15} className="text-slate-400" /> {post.authorName || "Mentor"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={15} className="text-slate-400" /> {post.subject}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={15} className="text-slate-400" /> {post.location}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-900">
                    <DollarSign size={15} className="text-slate-400" /> ৳{post.budget}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 border-t border-slate-100 pt-4 lg:border-t-0 lg:pt-0">
                {post.adminStatus !== "approved" && (
                  <Button
                    onClick={() => handleStatusChange(post._id, "approved")}
                    disabled={actionLoading === `approved-${post._id}`}
                    className="h-10 rounded-xl bg-emerald-600 px-4 font-bold text-white hover:bg-emerald-700"
                  >
                    {actionLoading === `approved-${post._id}` ? (
                      <Loader2 className="mr-1.5 size-4 animate-spin" />
                    ) : post.adminStatus === "rejected" ? (
                      <RotateCcw className="mr-1.5 size-4" />
                    ) : (
                      <CheckCircle2 className="mr-1.5 size-4" />
                    )}
                    {post.adminStatus === "rejected" ? "Re-Approve" : "Approve"}
                  </Button>
                )}

                {post.adminStatus !== "rejected" && (
                  <Button
                    onClick={() => handleStatusChange(post._id, "rejected")}
                    disabled={actionLoading === `rejected-${post._id}`}
                    variant="outline"
                    className="h-10 rounded-xl border-amber-200 bg-amber-50 font-bold text-amber-700 hover:bg-amber-100"
                  >
                    {actionLoading === `rejected-${post._id}` ? (
                      <Loader2 className="mr-1.5 size-4 animate-spin" />
                    ) : (
                      <XCircle className="mr-1.5 size-4" />
                    )}
                    Reject
                  </Button>
                )}

                <Button
                  onClick={() => handleDelete(post._id)}
                  disabled={actionLoading === `delete-${post._id}`}
                  variant="outline"
                  className="h-10 rounded-xl border-rose-200 bg-rose-50 font-bold text-rose-600 hover:bg-rose-100"
                >
                  {actionLoading === `delete-${post._id}` ? (
                    <Loader2 className="mr-1.5 size-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-1.5 size-4" />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}