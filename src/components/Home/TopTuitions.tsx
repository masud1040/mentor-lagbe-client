"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Flame, AlertCircle } from "lucide-react";
import TuitionCard, { TuitionPost } from "@/components/tuitions/TuitionCard";
import { fetchTuitions } from "@/lib/api/tuition-api";

type TuitionWithCount = TuitionPost & {
  applicantsCount?: number;
  applicationsCount?: number;
  studentCount?: number;
  enrolledCount?: number;
  applicants?: unknown[];
};

const getStudentCount = (post: TuitionWithCount): number => {
  if (typeof post.applicantsCount === "number") return post.applicantsCount;
  if (typeof post.applicationsCount === "number") return post.applicationsCount;
  if (typeof post.studentCount === "number") return post.studentCount;
  if (typeof post.enrolledCount === "number") return post.enrolledCount;
  if (Array.isArray(post.applicants)) return post.applicants.length;
  return 0;
};

export default function TopTuitions() {
  const [posts, setPosts] = useState<TuitionWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopTuitions = async () => {
      try {
        const res = await fetchTuitions({
          adminStatus: "approved",
          status: "active",
          limit: 50,
        });

        const allPosts: TuitionWithCount[] = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : [];

        const sortedTopSix = [...allPosts]
          .sort((a, b) => getStudentCount(b) - getStudentCount(a))
          .slice(0, 6);

        setPosts(sortedTopSix);
      } catch (error) {
        console.error("Failed to fetch top tuitions:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadTopTuitions();
  }, []);

  return (
    <section className="border-t border-slate-200/70 bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-4 md:mb-12 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
              <Flame className="size-3.5" /> Most Popular
            </span>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Top <span className="text-blue-600">Tuitions</span> Right Now
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-600 sm:text-base">
              সবচেয়ে বেশি শিক্ষার্থীদের পছন্দের শীর্ষ ৬টি ভেরিফায়েড টিউশন ও মেন্টরশিপ ব্যাচ।
            </p>
          </div>

          <Link
            href="/tuitions"
            className="group hidden items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 md:inline-flex"
          >
            View All Tuitions
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-64 animate-pulse rounded-2xl border border-slate-200/70 bg-slate-50/50 p-6"
              >
                <div className="flex justify-between">
                  <div className="h-6 w-24 rounded-md bg-slate-200/70" />
                  <div className="h-6 w-16 rounded-md bg-slate-200/70" />
                </div>
                <div className="mt-5 h-5 w-3/4 rounded bg-slate-200/70" />
                <div className="mt-2 h-4 w-full rounded bg-slate-200/70" />
                <div className="mt-6 h-12 w-full rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50/50 px-6 py-16 text-center">
            <AlertCircle className="mb-3 size-10 text-slate-300" />
            <h3 className="text-base font-bold text-slate-900">
              No active tuitions available yet
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Check back soon for new verified tuition posts.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <TuitionCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="mt-8 flex justify-center md:hidden">
          <Link
            href="/tuitions"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50"
          >
            View All Tuitions
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}