"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Code2,
  FlaskConical,
  GraduationCap,
  MessagesSquare,
  TrendingUp,
  PenTool,
  Briefcase,
  BookOpen,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { fetchTuitions } from "@/lib/api/tuition-api";

interface CategoryItem {
  id: string;
  name: string;
  banglaName: string;
  href: string;
  matchType: "category" | "keyword";
  matchValues: string[];
  icon: React.ElementType;
  color: string;
  bg: string;
}

interface TuitionRecord {
  _id?: string;
  title?: string;
  subject?: string;
  category?: string;
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: "web-development",
    name: "Web Development",
    banglaName: "ওয়েব ডেভেলপমেন্ট",
    href: "/tuitions?search=Web+Development",
    matchType: "keyword",
    matchValues: ["web", "react", "next", "javascript", "programming", "coding", "ict"],
    icon: Code2,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: "hsc-science",
    name: "HSC Science",
    banglaName: "এইচএসসি বিজ্ঞান",
    href: "/tuitions?category=hsc",
    matchType: "category",
    matchValues: ["hsc", "physics", "chemistry", "math", "biology"],
    icon: FlaskConical,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    id: "university-admission",
    name: "University Admission",
    banglaName: "বিশ্ববিদ্যালয় ভর্তি",
    href: "/tuitions?category=admission",
    matchType: "category",
    matchValues: ["admission", "buet", "medical", "varsity", "du"],
    icon: GraduationCap,
    color: "text-slate-700",
    bg: "bg-slate-100",
  },
  {
    id: "english-spoken",
    name: "English Spoken",
    banglaName: "ইংরেজি স্পোকেন",
    href: "/tuitions?search=English",
    matchType: "keyword",
    matchValues: ["english", "spoken", "ielts", "grammar"],
    icon: MessagesSquare,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    banglaName: "ডিজিটাল মার্কেটিং",
    href: "/tuitions?search=Marketing",
    matchType: "keyword",
    matchValues: ["marketing", "seo", "digital", "social media"],
    icon: TrendingUp,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    id: "graphic-design",
    name: "Graphic Design",
    banglaName: "গ্রাফিক ডিজাইন",
    href: "/tuitions?search=Design",
    matchType: "keyword",
    matchValues: ["graphic", "design", "ui", "ux", "figma", "photoshop"],
    icon: PenTool,
    color: "text-slate-700",
    bg: "bg-slate-100",
  },
  {
    id: "govt-jobs-bcs",
    name: "Govt. Jobs & BCS",
    banglaName: "বিসিএস ও চাকরি",
    href: "/tuitions?search=BCS",
    matchType: "keyword",
    matchValues: ["bcs", "job", "bank", "govt", "government"],
    icon: Briefcase,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: "religious-studies",
    name: "Religious Studies",
    banglaName: "কুরআন ও ধর্মশিক্ষা",
    href: "/tuitions?search=Quran",
    matchType: "keyword",
    matchValues: ["quran", "arabic", "islam", "religion", "religious"],
    icon: BookOpen,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
];

export default function PopularCategories() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategoryCounts = async () => {
      try {
        const res = await fetchTuitions({
          adminStatus: "approved",
          status: "active",
          limit: 100,
        });

        const posts: TuitionRecord[] = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : [];

        const nextCounts: Record<string, number> = {};

        for (const cat of DEFAULT_CATEGORIES) {
          const matched = posts.filter((post) => {
            const postCategory = (post.category || "").toLowerCase();
            const searchableText = `${post.title || ""} ${post.subject || ""} ${postCategory}`.toLowerCase();

            if (cat.matchType === "category") {
              return (
                postCategory === cat.matchValues[0] ||
                cat.matchValues.some((val) => searchableText.includes(val))
              );
            }

            return cat.matchValues.some((val) => searchableText.includes(val));
          }).length;

          nextCounts[cat.id] = matched;
        }

        setCounts(nextCounts);
      } catch (error) {
        console.error("Failed to load category counts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryCounts();
  }, []);

  return (
    <section className="border-t border-slate-200/70 bg-slate-50/60 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-4 md:mb-12 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Browse by Subject
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Popular <span className="text-blue-600">Subjects</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              শিক্ষার্থীদের কাছে সবচেয়ে জনপ্রিয় ক্যাটাগরিগুলো থেকে আপনার পছন্দের
              বিষয় বা স্কিল বেছে নিন।
            </p>
          </div>

          <Link
            href="/tuitions"
            className="group hidden items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 md:inline-flex"
          >
            Explore All Tuitions
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Premium Static-Position Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DEFAULT_CATEGORIES.map((category) => {
            const Icon = category.icon;
            const liveCount = counts[category.id] || 0;

            return (
              <Link
                key={category.id}
                href={category.href}
                className="group flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`flex size-11 items-center justify-center rounded-xl ${category.bg} ${category.color} transition-colors duration-200 group-hover:bg-blue-600 group-hover:text-white`}
                  >
                    <Icon size={21} strokeWidth={2} />
                  </div>

                  <ArrowUpRight
                    size={17}
                    className="text-slate-300 transition-colors duration-200 group-hover:text-blue-600"
                  />
                </div>

                <div className="mt-4">
                  <h3 className="text-[16px] font-bold tracking-tight text-slate-900 transition-colors group-hover:text-blue-600">
                    {category.name}
                  </h3>
                  <p className="mt-0.5 text-[13.5px] font-medium text-slate-500">
                    {category.banglaName}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5">
                  <span className="text-xs font-semibold text-slate-500">
                    {loading ? (
                      <span className="inline-block h-3.5 w-20 animate-pulse rounded bg-slate-100" />
                    ) : liveCount > 0 ? (
                      <span className="text-slate-700">
                        {liveCount} {liveCount === 1 ? "active post" : "active posts"}
                      </span>
                    ) : (
                      "Browse category"
                    )}
                  </span>

                  <span className="text-[11px] font-semibold text-blue-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    View
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile Button */}
        <div className="mt-8 flex justify-center md:hidden">
          <Link
            href="/tuitions"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50"
          >
            Explore All Tuitions
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}