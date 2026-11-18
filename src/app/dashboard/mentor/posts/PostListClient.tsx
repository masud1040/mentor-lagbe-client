"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Users,
  MapPin,
  DollarSign,
  Edit,
  Trash2,
  PowerOff,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Post {
  _id: string;
  title: string;
  subject: string;
  location: string;
  budget: number;
  status: string;
  adminStatus: string;
  applicantsCount: number;
  createdAt: string;
}

export default function PostListClient({ initialPosts }: { initialPosts: Post[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleClose = async (id: string) => {
    if (!confirm("Are you sure you want to close this post? Students won't be able to apply anymore.")) return;
    setLoadingId(`close-${id}`);

    try {
      const res = await fetch(`${API_URL}/tuitions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "closed" }),
      });

      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: "closed" } : p))
        );
        toast.success("Tuition post closed successfully.");
        router.refresh();
      } else {
        toast.error("Failed to close post.");
      }
    } catch {
      toast.error("Network error.");
    }

    setLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this post?")) return;
    setLoadingId(`delete-${id}`);

    try {
      const res = await fetch(`${API_URL}/tuitions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p._id !== id));
        toast.success("Post deleted permanently.");
        router.refresh();
      } else {
        toast.error("Failed to delete post.");
      }
    } catch {
      toast.error("Network error.");
    }

    setLoadingId(null);
  };

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[2rem] border border-slate-100 bg-white py-20 text-center shadow-sm">
        <AlertCircle className="mb-4 size-12 text-slate-300" />
        <h3 className="text-xl font-bold text-slate-900">No tuition posts yet</h3>
        <p className="mt-2 text-slate-500">
          You haven&apos;t created any tuition requirements yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {posts.map((post) => (
        <div
          key={post._id}
          className="flex flex-col gap-6 rounded-[1.75rem] border border-slate-200/70 bg-white p-6 shadow-xs transition-all hover:border-blue-200 hover:shadow-md lg:flex-row lg:items-center lg:justify-between"
        >
          {/* Left Content */}
          <div className="flex-1 space-y-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                  post.status === "active"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {post.status}
              </span>

              {post.adminStatus === "approved" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                  <CheckCircle2 size={13} /> Approved
                </span>
              )}
              {post.adminStatus === "pending" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-600">
                  <Clock size={13} /> Pending Review
                </span>
              )}
              {post.adminStatus === "rejected" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-600">
                  <XCircle size={13} /> Rejected
                </span>
              )}
            </div>

            <div>
              <Link
                href={`/tuitions/${post._id}`}
                className="group inline-flex items-center gap-2 text-xl font-extrabold text-slate-900 transition-colors hover:text-blue-600"
              >
                <span className="line-clamp-1">{post.title}</span>
                <ExternalLink className="size-4 shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
              <p className="mt-1 flex items-center gap-1.5 text-[14.5px] font-medium text-slate-500">
                <BookOpen size={15} className="text-slate-400" /> {post.subject}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[13.5px] font-semibold text-slate-600">
              <div className="flex items-center gap-1.5">
                <MapPin size={15} className="text-slate-400" /> {post.location}
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign size={15} className="text-slate-400" /> ৳{post.budget}
              </div>
              <Link
                href={`/tuitions/${post._id}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-blue-600 transition-colors hover:bg-blue-100"
              >
                <Users size={15} /> {post.applicantsCount || 0} Applicants
              </Link>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex flex-wrap items-center gap-2.5 border-t border-slate-100 pt-4 lg:border-t-0 lg:pt-0">
            <Link href={`/dashboard/mentor/posts/edit/${post._id}`}>
              <Button
                variant="outline"
                className="h-10 rounded-xl border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50"
              >
                <Edit className="mr-1.5 size-4" /> Edit
              </Button>
            </Link>

            {post.status === "active" && (
              <Button
                onClick={() => handleClose(post._id)}
                disabled={loadingId === `close-${post._id}`}
                variant="outline"
                className="h-10 rounded-xl border-orange-200 bg-orange-50 font-bold text-orange-600 hover:bg-orange-100"
              >
                {loadingId === `close-${post._id}` ? (
                  <Loader2 className="mr-1.5 size-4 animate-spin" />
                ) : (
                  <PowerOff className="mr-1.5 size-4" />
                )}
                Close
              </Button>
            )}

            <Button
              onClick={() => handleDelete(post._id)}
              disabled={loadingId === `delete-${post._id}`}
              variant="outline"
              className="h-10 rounded-xl border-rose-200 bg-rose-50 font-bold text-rose-600 hover:bg-rose-100"
            >
              {loadingId === `delete-${post._id}` ? (
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
  );
}