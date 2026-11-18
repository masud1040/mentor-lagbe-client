"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Nav";
import { fetchTuitions } from "@/lib/api/tuition-api";
import {
  Search,
  MapPin,
  DollarSign,
  BookOpen,
  Users,
  Sparkles,
  Loader2,
  AlertCircle,
  Wifi,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TuitionPost {
  _id: string;
  title: string;
  subject: string;
  category: string;
  location: string;
  isOnline?: boolean;
  budget: number;
  frequency?: string;
  description: string;
  authorName?: string;
  applicantsCount?: number;
  createdAt: string;
}

export default function PublicTuitionsPage() {
  const [posts, setPosts] = useState<TuitionPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [mode, setMode] = useState("all"); // all | true (online) | false (offline)

  const loadTuitions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTuitions({
        adminStatus: "approved",
        status: "active",
        search: search.trim() || undefined,
        category: category !== "all" ? category : undefined,
        isOnline: mode !== "all" ? mode : undefined,
      });
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch public tuitions:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, mode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTuitions();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [loadTuitions]);

  return (
    <div className="min-h-screen bg-slate-50/70">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-xs sm:p-10">
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
            <Sparkles size={14} /> Verified Listings
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Browse Available Tuitions
          </h1>
          <p className="mt-2 text-[15px] font-medium text-slate-500">
            Find admin-verified tuition opportunities across Bangladesh or online.
          </p>

          {/* Search & Filters */}
          <div className="mt-6 grid gap-3 sm:grid-cols-12">
            <div className="relative sm:col-span-6">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by title, subject, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-10 focus-visible:bg-white"
              />
            </div>

            <div className="sm:col-span-3">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12 w-full rounded-xl border-slate-200 bg-slate-50">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="primary">Primary (Class 1-5)</SelectItem>
                  <SelectItem value="jsc">JSC (Class 6-8)</SelectItem>
                  <SelectItem value="ssc">SSC (Class 9-10)</SelectItem>
                  <SelectItem value="hsc">HSC (Class 11-12)</SelectItem>
                  <SelectItem value="admission">University Admission</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-3">
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger className="h-12 w-full rounded-xl border-slate-200 bg-slate-50">
                  <SelectValue placeholder="Tuition Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="true">Online Only</SelectItem>
                  <SelectItem value="false">Offline / Home</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center rounded-[2rem] border border-slate-100 bg-white py-24">
            <Loader2 className="size-8 animate-spin text-blue-600" />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-slate-100 bg-white py-24 text-center shadow-xs">
            <AlertCircle className="mb-3 size-12 text-slate-300" />
            <h3 className="text-xl font-bold text-slate-900">
              No tuition posts found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try adjusting your search or filters to find more opportunities.
            </p>
            {(search || category !== "all" || mode !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                  setMode("all");
                }}
                className="mt-4 rounded-xl"
              >
                Reset Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div
                key={post._id}
                className="group flex flex-col justify-between rounded-[1.75rem] border border-slate-200/70 bg-white p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-600">
                      {post.category}
                    </span>
                    {post.isOnline && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                        <Wifi size={12} /> Online
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/tuitions/${post._id}`}
                    className="line-clamp-2 text-lg font-extrabold text-slate-900 transition-colors group-hover:text-blue-600"
                  >
                    {post.title}
                  </Link>

                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                    {post.description}
                  </p>

                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-[13.5px] font-semibold text-slate-600">
                    <div className="flex items-center gap-2">
                      <BookOpen size={15} className="shrink-0 text-slate-400" />
                      <span className="truncate">{post.subject}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={15} className="shrink-0 text-slate-400" />
                      <span className="truncate">{post.location}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1 text-base font-extrabold text-slate-900">
                        <DollarSign size={16} className="text-blue-600" /> ৳
                        {post.budget}
                        <span className="text-xs font-medium text-slate-400">
                          /{post.frequency || "monthly"}
                        </span>
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                        <Users size={14} /> {post.applicantsCount || 0} applied
                      </span>
                    </div>
                  </div>
                </div>

                <Link href={`/tuitions/${post._id}`} className="mt-5 block">
                  <Button className="h-11 w-full rounded-xl bg-slate-900 font-bold text-white transition-all hover:bg-blue-600">
                    View Details <ArrowRight className="ml-1.5 size-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}