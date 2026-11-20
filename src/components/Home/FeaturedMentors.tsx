"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchMentorsApi } from "@/lib/api/user-api";
import {
  ShieldCheck,
  GraduationCap,
  Users,
  BookOpen,
  ArrowRight,
  MapPin,
} from "lucide-react";

interface TopMentor {
  _id: string;
  name: string;
  image?: string;
  location?: string;
  education?: string;
  currentOccupation?: string;
  expertSubjects?: string[];
  isPremium?: boolean;
  postsCount?: number;
  studentsCount?: number;
}

function MentorAvatar({
  name,
  image,
  isPremium,
}: {
  name: string;
  image?: string;
  isPremium?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const initial = (name || "M").charAt(0).toUpperCase();

  return (
    <div className="relative mx-auto size-24">
      <div className="relative size-24 overflow-hidden rounded-full border border-slate-200/80 bg-slate-100 ring-4 ring-slate-50 transition-transform duration-300 group-hover:scale-[1.03]">
        {image && !failed ? (
          <img
            src={image}
            alt={name}
            onError={() => setFailed(true)}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-slate-900 text-2xl font-bold text-white">
            {initial}
          </div>
        )}
      </div>

      {/* Verified / Pro Badge anchored cleanly to avatar */}
      <div
        className={`absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full border-2 border-white text-white shadow-xs ${
          isPremium ? "bg-amber-500" : "bg-blue-600"
        }`}
        title={isPremium ? "Pro Verified Mentor" : "Verified Mentor"}
      >
        <ShieldCheck className="size-4" />
      </div>
    </div>
  );
}

export default function FeaturedMentors() {
  const [mentors, setMentors] = useState<TopMentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopMentors = async () => {
      setLoading(true);
      try {
        const data = await fetchMentorsApi({ sort: "top", limit: 3 });
        setMentors(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch top mentors:", error);
        setMentors([]);
      } finally {
        setLoading(false);
      }
    };

    loadTopMentors();
  }, []);

  if (!loading && mentors.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-slate-200/70 bg-slate-50/60 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 flex flex-col items-center justify-between gap-4 md:mb-12 md:flex-row md:items-end">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Meet Our <span className="text-blue-600">Top Mentors</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
              দেশের সেরা বিশ্ববিদ্যালয়গুলোর অভিজ্ঞ ও ভেরিফাইড মেন্টরদের সাথে যুক্ত হয়ে আপনার প্রস্তুতি আরও মজবুত করুন।
            </p>
          </div>

          <Link
            href="/mentors"
            className="group hidden items-center gap-1.5 text-sm font-semibold text-slate-700 transition-colors hover:text-blue-600 md:inline-flex"
          >
            View All Mentors
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Dynamic Mentor Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white p-6"
              >
                <div className="size-24 animate-pulse rounded-full bg-slate-100" />
                <div className="mt-5 h-5 w-40 animate-pulse rounded bg-slate-100" />
                <div className="mt-2 h-4 w-28 animate-pulse rounded bg-slate-100" />
                <div className="mt-4 h-4 w-44 animate-pulse rounded bg-slate-100" />
                <div className="mt-6 h-10 w-full animate-pulse rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor) => {
              const primarySubjects =
                Array.isArray(mentor.expertSubjects) &&
                mentor.expertSubjects.length > 0
                  ? mentor.expertSubjects.slice(0, 2).join(" • ")
                  : mentor.currentOccupation || "Experienced Mentor";

              const secondaryLine =
                mentor.education || mentor.location || "Bangladesh";

              const studentsCount = mentor.studentsCount || 0;
              const postsCount = mentor.postsCount || 0;

              return (
                <article
                  key={mentor._id}
                  className="group flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_30px_-14px_rgba(15,23,42,0.12)]"
                >
                  {/* Profile Avatar */}
                  <div className="mb-5">
                    <MentorAvatar
                      name={mentor.name}
                      image={mentor.image}
                      isPremium={mentor.isPremium}
                    />
                  </div>

                  {/* Centered Info Section */}
                  <div className="flex-1 text-center">
                    <Link
                      href={`/mentors/${mentor._id}`}
                      className="block truncate text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600"
                    >
                      {mentor.name || "Verified Mentor"}
                    </Link>

                    <p className="mt-1 truncate text-xs font-medium text-slate-500">
                      {mentor.currentOccupation || "Tuition Mentor"}
                    </p>

                    <div className="mt-4 space-y-1.5">
                      <div className="flex items-center justify-center gap-1.5 text-[13.5px] font-semibold text-slate-700">
                        <GraduationCap className="size-4 shrink-0 text-blue-600" />
                        <span className="truncate">{primarySubjects}</span>
                      </div>

                      <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500">
                        {mentor.education ? null : (
                          <MapPin className="size-3.5 shrink-0 text-slate-400" />
                        )}
                        <span className="max-w-[230px] truncate">
                          {secondaryLine}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Real Stats & Action */}
                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <div className="mb-4 flex items-center justify-between px-1 text-xs font-semibold text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Users className="size-4 text-blue-600" />
                        <span className="tabular-nums">
                          {studentsCount}{" "}
                          {studentsCount === 1 ? "Student" : "Students"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-500">
                        <BookOpen className="size-4 text-slate-400" />
                        <span className="tabular-nums">
                          {postsCount}{" "}
                          {postsCount === 1 ? "Tuition" : "Tuitions"}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/mentors/${mentor._id}`}
                      className="flex h-10 w-full items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
                    >
                      View Profile
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="mt-8 flex justify-center md:hidden">
          <Link
            href="/mentors"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            View All Mentors
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}