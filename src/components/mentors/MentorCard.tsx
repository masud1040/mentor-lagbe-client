"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  GraduationCap,
  Briefcase,
  BookOpen,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

export interface PublicMentor {
  _id: string;
  name: string;
  email?: string;
  image?: string;
  bio?: string;
  gender?: string;
  location?: string;
  education?: string;
  currentOccupation?: string;
  cvUrl?: string;
  expertSubjects?: string[];
  isPremium?: boolean;
  postsCount?: number;
  createdAt?: string;
}

export default function MentorCard({ mentor }: { mentor: PublicMentor }) {
  const [imgError, setImgError] = useState(false);

  const initial = (mentor.name || "M").charAt(0).toUpperCase();
  const subjects = Array.isArray(mentor.expertSubjects)
    ? mentor.expertSubjects
    : [];
  const visibleSubjects = subjects.slice(0, 3);
  const extraCount = subjects.length - visibleSubjects.length;

  return (
    <article className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300/80 hover:shadow-[0_12px_30px_-12px_rgba(15,23,42,0.12)] sm:p-6">
      <div>
        {/* Top Row: Avatar + Name + Pro Badge */}
        <div className="flex items-start gap-3.5">
          {mentor.image && !imgError ? (
            <img
              src={mentor.image}
              alt={mentor.name}
              onError={() => setImgError(true)}
              className="size-13 shrink-0 rounded-xl border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex size-13 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-lg font-extrabold text-white">
              {initial}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <Link
                href={`/mentors/${mentor._id}`}
                className="truncate text-[16.5px] font-bold text-slate-900 transition-colors group-hover:text-blue-600"
              >
                {mentor.name || "Verified Mentor"}
              </Link>
              {mentor.isPremium && (
                <span className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-700">
                  <Sparkles className="size-2.5" /> Pro
                </span>
              )}
            </div>

            <p className="mt-0.5 truncate text-xs font-medium text-slate-500">
              {mentor.currentOccupation || "Tuition Mentor"}
            </p>

            {mentor.location && (
              <p className="mt-1 flex items-center gap-1 truncate text-xs font-medium text-slate-400">
                <MapPin className="size-3 shrink-0" />
                <span className="truncate">{mentor.location}</span>
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        {mentor.bio && (
          <p className="mt-4 line-clamp-2 text-[13.5px] leading-relaxed text-slate-500">
            {mentor.bio}
          </p>
        )}

        {/* Education & Gender Meta */}
        <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3.5 text-[13px] font-medium text-slate-600">
          {mentor.education && (
            <div className="flex items-center gap-2">
              <GraduationCap className="size-4 shrink-0 text-slate-400" />
              <span className="truncate">{mentor.education}</span>
            </div>
          )}
          {!mentor.education && mentor.currentOccupation && (
            <div className="flex items-center gap-2">
              <Briefcase className="size-4 shrink-0 text-slate-400" />
              <span className="truncate">{mentor.currentOccupation}</span>
            </div>
          )}
        </div>

        {/* Expert Subjects */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {visibleSubjects.length > 0 ? (
            <>
              {visibleSubjects.map((sub) => (
                <span
                  key={sub}
                  className="rounded-md bg-blue-50/80 px-2 py-0.5 text-[11px] font-semibold text-blue-700"
                >
                  {sub}
                </span>
              ))}
              {extraCount > 0 && (
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                  +{extraCount} more
                </span>
              )}
            </>
          ) : (
            <span className="text-xs text-slate-400">
              Subjects not listed yet
            </span>
          )}
        </div>
      </div>

      {/* Footer: Active Posts Count + Profile CTA */}
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <BookOpen className="size-3.5 text-blue-600" />
          {mentor.postsCount || 0}{" "}
          {(mentor.postsCount || 0) === 1 ? "Active Post" : "Active Posts"}
        </span>

        <Link
          href={`/mentors/${mentor._id}`}
          className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-600"
        >
          View Profile
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}