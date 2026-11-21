"use client";

import React, { Suspense, useEffect, useState, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/shared/Nav";
import Pagination from "@/components/shared/Pagination";
import TuitionCard, { TuitionPost } from "@/components/tuitions/TuitionCard";
import { fetchTuitions } from "@/lib/api/tuition-api";
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

const ITEMS_PER_PAGE = 9;

function TuitionsBrowseContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "all";
  const urlMode = searchParams.get("mode") || "all";
  const urlPage = Math.max(1, Number(searchParams.get("page")) || 1);

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [posts, setPosts] = useState<TuitionPost[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const updateUrl = useCallback(
    (next: {
      search?: string;
      category?: string;
      mode?: string;
      page?: number;
    }) => {
      const params = new URLSearchParams(searchParams.toString());

      const filterChanged =
        next.search !== undefined ||
        next.category !== undefined ||
        next.mode !== undefined;

      const s = next.search !== undefined ? next.search : urlSearch;
      const c = next.category !== undefined ? next.category : urlCategory;
      const m = next.mode !== undefined ? next.mode : urlMode;
      const p = filterChanged
        ? 1
        : next.page !== undefined
          ? next.page
          : urlPage;

      if (s.trim()) params.set("search", s.trim());
      else params.delete("search");

      if (c && c !== "all") params.set("category", c);
      else params.delete("category");

      if (m && m !== "all") params.set("mode", m);
      else params.delete("mode");

      if (p > 1) params.set("page", String(p));
      else params.delete("page");

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams, urlCategory, urlMode, urlPage, urlSearch]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== urlSearch) {
        updateUrl({ search: searchInput });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput, urlSearch, updateUrl]);

  useEffect(() => {
    const loadTuitions = async () => {
      setLoading(true);
      try {
        const res = await fetchTuitions({
          adminStatus: "approved",
          status: "active",
          search: urlSearch || undefined,
          category: urlCategory !== "all" ? urlCategory : undefined,
          isOnline: urlMode !== "all" ? urlMode : undefined,
          page: urlPage,
          limit: ITEMS_PER_PAGE,
        });

        if (Array.isArray(res)) {
          setPosts(res);
          setTotal(res.length);
          setTotalPages(1);
        } else {
          setPosts(Array.isArray(res?.data) ? res.data : []);
          setTotal(Number(res?.total) || 0);
          setTotalPages(Math.max(1, Number(res?.totalPages) || 1));
        }
      } catch (error) {
        console.error("Failed to fetch tuitions:", error);
        setPosts([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    loadTuitions();
  }, [urlSearch, urlCategory, urlMode, urlPage]);

  const hasActiveFilters =
    Boolean(urlSearch) || urlCategory !== "all" || urlMode !== "all";

  const handleReset = () => {
    setSearchInput("");
    router.replace(pathname, { scroll: false });
  };

  const handlePageChange = (nextPage: number) => {
    updateUrl({ page: nextPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <section className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Verified Tuitions
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Find the right tuition for you
            </h1>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-500 sm:text-[15px]">
              Browse admin-verified home and online tuition opportunities posted
              by mentors across Bangladesh.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-12">
            <div className="relative sm:col-span-6 lg:col-span-6">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search subject, title, or area (e.g. Math, Mirpur)..."
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

            <div className="sm:col-span-3 lg:col-span-3">
              <Select
                value={urlCategory}
                onValueChange={(val) => updateUrl({ category: val })}
              >
                <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-slate-50/70 text-sm">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="primary">Primary (Class 1–5)</SelectItem>
                  <SelectItem value="jsc">JSC (Class 6–8)</SelectItem>
                  <SelectItem value="ssc">SSC (Class 9–10)</SelectItem>
                  <SelectItem value="hsc">HSC (Class 11–12)</SelectItem>
                  <SelectItem value="admission">University Admission</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-3 lg:col-span-3">
              <Select
                value={urlMode}
                onValueChange={(val) => updateUrl({ mode: val })}
              >
                <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-slate-50/70 text-sm">
                  <SelectValue placeholder="All Modes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="true">Online Only</SelectItem>
                  <SelectItem value="false">Home Tuition</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-3.5 text-slate-400" />
              <span>
                {loading
                  ? "Searching tuitions..."
                  : `${total} ${total === 1 ? "tuition" : "tuitions"} available`}
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

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-64 animate-pulse rounded-2xl border border-slate-200/70 bg-white p-6"
              >
                <div className="flex justify-between">
                  <div className="h-6 w-24 rounded-md bg-slate-100" />
                  <div className="h-6 w-16 rounded-md bg-slate-100" />
                </div>
                <div className="mt-5 h-5 w-3/4 rounded bg-slate-100" />
                <div className="mt-2 h-4 w-full rounded bg-slate-100" />
                <div className="mt-6 h-12 w-full rounded-xl bg-slate-50" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white px-6 py-20 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <AlertCircle className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              No matching tuitions found
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Try changing your search keyword, category, or tuition mode.
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
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <TuitionCard key={post._id} post={post} />
              ))}
            </div>

            <Pagination
              currentPage={urlPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default function PublicTuitionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC]">
          <Navbar />
          <div className="mx-auto max-w-7xl px-4 py-16 text-center text-sm font-medium text-slate-500">
            Loading tuitions...
          </div>
        </div>
      }
    >
      <TuitionsBrowseContent />
    </Suspense>
  );
}