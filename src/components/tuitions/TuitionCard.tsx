"use client";

import React from "react";
import Link from "next/link";
import TuitionCover from "@/components/tuitions/TuitionCover";
import {
  MapPin,
  BookOpen,
  Users,
  Wifi,
  ArrowUpRight,
  Clock,
} from "lucide-react";

export interface TuitionPost {
  _id: string;
  title: string;
  subject: string;
  category: string;
  location: string;
  isOnline?: boolean;
  budget: number;
  frequency?: string;
  description: string;
  image?: string;
  authorName?: string;
  applicantsCount?: number;
  createdAt: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  primary: "Primary",
  jsc: "JSC",
  ssc: "SSC",
  hsc: "HSC",
  admission: "Admission",
};

const FREQUENCY_LABELS: Record<string, string> = {
  monthly: "mo",
  "per-class": "class",
  course: "course",
};

function formatTimeAgo(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1d ago";
  if (diffDays < 30) return `${diffDays}d ago`;
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export default function TuitionCard({ post }: { post: TuitionPost }) {
  const categoryLabel =
    CATEGORY_LABELS[post.category?.toLowerCase()] || post.category || "General";
  const freqLabel =
    FREQUENCY_LABELS[post.frequency || "monthly"] || post.frequency || "mo";
  const mentorInitial = (post.authorName || "M").charAt(0).toUpperCase();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300/80 hover:shadow-[0_12px_30px_-12px_rgba(15,23,42,0.12)]">
      {/* Top Cover Image (Clickable) */}
      <Link href={`/tuitions/${post._id}`} className="block">
        <TuitionCover
          image={post.image}
          category={post.category}
          subject={post.subject}
          isOnline={post.isOnline}
        />
      </Link>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          {/* Top Row: Badges + Salary */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-slate-700">
                {categoryLabel}
              </span>
              {post.isOnline ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                  <Wifi className="size-3" /> Online
                </span>
              ) : (
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                  Home Tuition
                </span>
              )}
            </div>

            <div className="shrink-0 text-right">
              <p className="text-lg font-extrabold tracking-tight text-slate-900 tabular-nums">
                ৳{Number(post.budget || 0).toLocaleString()}
              </p>
              <p className="text-[11px] font-medium text-slate-400">
                per {freqLabel}
              </p>
            </div>
          </div>

          {/* Title & Description */}
          <div className="mt-4">
            <Link
              href={`/tuitions/${post._id}`}
              className="line-clamp-2 text-[17px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600"
            >
              {post.title}
            </Link>
            <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-slate-500">
              {post.description}
            </p>
          </div>

          {/* Meta Info */}
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 text-[13px] font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <BookOpen className="size-4 shrink-0 text-slate-400" />
              <span className="truncate">{post.subject}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <MapPin className="size-4 shrink-0 text-slate-400" />
                <span className="truncate">{post.location}</span>
              </div>
              <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-400">
                <Users className="size-3.5" />
                {post.applicantsCount || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Footer: Mentor + CTA */}
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
              {mentorInitial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-slate-800">
                {post.authorName || "Verified Mentor"}
              </p>
              <p className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="size-3" />
                {formatTimeAgo(post.createdAt)}
              </p>
            </div>
          </div>

          <Link
            href={`/tuitions/${post._id}`}
            className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-600"
          >
            Details
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}