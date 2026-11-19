"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/shared/Nav";
import MentorCard, { PublicMentor } from "@/components/mentors/MentorCard";
import { fetchMentorsApi } from "@/lib/api/user-api";
import { Search, SlidersHorizontal, X, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SUBJECT_FILTERS = [
  "Mathematics",
  "Higher Math",
  "Physics",
  "Chemistry",
  "Biology",
  "ICT",
  "English",
  "Bangla",
  "Accounting",
  "Finance",
  "Economics",
];

function MentorsDirectoryContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get("search") || "";
  const urlSubject = searchParams.get("subject") || "all";

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [mentors, setMentors] = useState<PublicMentor[]>([]);
  const [loading, setLoading] = useState(true);

  const updateUrl = useCallback(
    (next: { search?: string; subject?: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      const s = next.search !== undefined ? next.search : urlSearch;
      const sub = next.subject !== undefined ? next.subject : urlSubject;

      if (s.trim()) params.set("search", s.trim());
      else params.delete("search");

      if (sub && sub !== "all") params.set("subject", sub);
      else params.delete("subject");

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams, urlSearch, urlSubject]
  );

  // Debounce search -> URL sync
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== urlSearch) {
        updateUrl({ search: searchInput });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput, urlSearch, updateUrl]);

  // Fetch mentors whenever URL filters change
  useEffect(() => {
    const loadMentors = async () => {
      setLoading(true);
      try {
        const data = await fetchMentorsApi({
          search: urlSearch || undefined,
          subject: urlSubject !== "all" ? urlSubject : undefined,
        });
        setMentors(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch mentors:", error);
        setMentors([]);
      } finally {
        setLoading(false);
      }
    };

    loadMentors();
  }, [urlSearch, urlSubject]);

  const hasActiveFilters = Boolean(urlSearch) || urlSubject !== "all";

  const handleReset = () => {
    setSearchInput("");
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Header & Filter Bar */}
      <section className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Verified Mentors
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Explore Experienced Mentors
            </h1>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-500 sm:text-[15px]">
              Check mentor backgrounds, expertise, and browse their active tuition listings directly.
            </p>
          </div>

          {/* Search & Subject Filter */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-12">
            <div className="relative sm:col-span-8">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by mentor name, university, subject, or area..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-11 rounded-xl border-slate-200 bg-slate-50/70 pl-10 pr-9 text-sm focus-visible:bg-white"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    updateUrl({ search: "" });
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <div className="sm:col-span-4">
              <Select
                value={urlSubject}
                onValueChange={(val) => updateUrl({ subject: val })}
              >
                <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-slate-50/70 text-sm">
                  <SelectValue placeholder="Filter by Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {SUBJECT_FILTERS.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Result Count & Clear */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-3.5 text-slate-400" />
              <span>
                {loading
                  ? "Loading mentors..."
                  : `${mentors.length} ${mentors.length === 1 ? "mentor" : "mentors"} available`}
              </span>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700"
              >
                <X className="size-3.5" /> Clear all filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Mentors Grid */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-60 animate-pulse rounded-2xl border border-slate-200/70 bg-white p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="size-13 rounded-xl bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/2 rounded bg-slate-100" />
                    <div className="h-3 w-1/3 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="mt-5 h-4 w-full rounded bg-slate-100" />
                <div className="mt-2 h-4 w-2/3 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : mentors.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white px-6 py-20 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <AlertCircle className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              No mentors found
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Try searching with a different subject, name, or location.
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="mt-5 rounded-xl font-semibold"
              >
                Reset Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor) => (
              <MentorCard key={mentor._id} mentor={mentor} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function MentorsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC]">
          <Navbar />
          <div className="mx-auto max-w-7xl px-4 py-16 text-center text-sm font-medium text-slate-500">
            Loading mentors...
          </div>
        </div>
      }
    >
      <MentorsDirectoryContent />
    </Suspense>
  );
}