"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/shared/Nav";
import TuitionCard, { TuitionPost } from "@/components/tuitions/TuitionCard";
import { PublicMentor } from "@/components/mentors/MentorCard";
import { fetchMentorByIdApi } from "@/lib/api/user-api";
import {
  ArrowLeft,
  MapPin,
  GraduationCap,
  Briefcase,
  FileText,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  BookOpen,
  AlertCircle,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SingleMentorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [mentor, setMentor] = useState<PublicMentor | null>(null);
  const [posts, setPosts] = useState<TuitionPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadMentorData = async () => {
      setLoading(true);
      try {
        const data = await fetchMentorByIdApi(id);
        if (data?.mentor) {
          setMentor(data.mentor);
          setPosts(Array.isArray(data.posts) ? data.posts : []);
        } else {
          setMentor(null);
        }
      } catch (error) {
        console.error("Failed to fetch mentor profile:", error);
        setMentor(null);
      } finally {
        setLoading(false);
      }
    };

    loadMentorData();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="size-4" /> Back to Mentors
        </button>

        {loading ? (
          <div className="space-y-6">
            <div className="h-56 animate-pulse rounded-2xl border border-slate-200/80 bg-white p-6" />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-60 animate-pulse rounded-2xl border border-slate-200/80 bg-white p-6"
                />
              ))}
            </div>
          </div>
        ) : !mentor ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white px-6 py-20 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <AlertCircle className="size-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Mentor not found
            </h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              This mentor profile may no longer be available.
            </p>
            <Link href="/mentors" className="mt-5">
              <Button className="rounded-xl bg-slate-900 px-5 font-semibold text-white hover:bg-blue-600">
                Browse All Mentors
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Mentor Profile Header Card */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                <div className="flex items-start gap-4">
                  {mentor.image && !imgError ? (
                    <img
                      src={mentor.image}
                      alt={mentor.name}
                      onError={() => setImgError(true)}
                      className="size-16 shrink-0 rounded-2xl border border-slate-200 object-cover sm:size-20"
                    />
                  ) : (
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-extrabold text-white sm:size-20">
                      {(mentor.name || "M").charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                        {mentor.name}
                      </h1>
                      {mentor.isPremium && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold uppercase text-amber-700">
                          <Sparkles className="size-3" /> Pro Mentor
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-slate-500">
                      {mentor.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3.5 text-slate-400" />
                          {mentor.location}
                        </span>
                      )}
                      {mentor.gender && (
                        <span className="inline-flex items-center gap-1 capitalize">
                          <User className="size-3.5 text-slate-400" />
                          {mentor.gender}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 font-semibold text-blue-600">
                        <BookOpen className="size-3.5" />
                        {posts.length}{" "}
                        {posts.length === 1 ? "Active Tuition" : "Active Tuitions"}
                      </span>
                    </div>
                  </div>
                </div>

                {mentor.cvUrl && (
                  <a
                    href={mentor.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-800 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <FileText className="size-4 text-blue-600" />
                    View CV
                    <ExternalLink className="size-3.5" />
                  </a>
                )}
              </div>

              {/* Bio */}
              {mentor.bio && (
                <p className="mt-5 border-t border-slate-100 pt-5 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                  {mentor.bio}
                </p>
              )}

              {/* Education & Occupation Grid */}
              {(mentor.education || mentor.currentOccupation) && (
                <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  {mentor.education && (
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        <GraduationCap className="size-3.5 text-blue-600" />
                        Education
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {mentor.education}
                      </p>
                    </div>
                  )}

                  {mentor.currentOccupation && (
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        <Briefcase className="size-3.5 text-blue-600" />
                        Current Occupation
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {mentor.currentOccupation}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Expert Subjects */}
              {mentor.expertSubjects && mentor.expertSubjects.length > 0 && (
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Expert Subjects
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {mentor.expertSubjects.map((sub) => (
                      <span
                        key={sub}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                      >
                        <CheckCircle2 className="size-3.5" />
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Mentor's Active Tuition Posts */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                  Tuition Posts by {mentor.name}
                </h2>
                <span className="rounded-full bg-slate-200/70 px-3 py-0.5 text-xs font-bold text-slate-700">
                  {posts.length}
                </span>
              </div>

              {posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white px-6 py-16 text-center">
                  <BookOpen className="mb-3 size-10 text-slate-300" />
                  <h3 className="text-base font-bold text-slate-900">
                    No active tuition posts yet
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    This mentor hasn&apos;t published any approved tuition listings right now.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <TuitionCard key={post._id} post={post} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}