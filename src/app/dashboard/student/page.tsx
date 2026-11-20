"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { fetchMyProfileApi } from "@/lib/api/user-api";
import { fetchApplicationsApi } from "@/lib/api/application-api";
import { fetchTuitions } from "@/lib/api/tuition-api";
import TuitionCard, { TuitionPost } from "@/components/tuitions/TuitionCard";
import {
  Search,
  Users,
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  BookOpen,
  School,
  MapPin,
  Edit3,
  AlertCircle,
  Sparkles,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudentProfile {
  _id?: string;
  name?: string;
  email?: string;
  location?: string;
  studentClass?: string;
  institution?: string;
}

interface StudentApplication {
  _id: string;
  tuitionId: string;
  tuitionTitle?: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
}

export default function StudentDashboardPage() {
  const { data: session, isPending: sessionLoading } = useSession();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [latestTuitions, setLatestTuitions] = useState<TuitionPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading || !session?.user?.id) return;

    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [profileRes, appsRes, tuitionsRes] = await Promise.all([
          fetchMyProfileApi().catch(() => null),
          fetchApplicationsApi({ applicantId: session.user.id }).catch(() => []),
          fetchTuitions({
            adminStatus: "approved",
            status: "active",
            limit: 3,
          }).catch(() => []),
        ]);

        setProfile(profileRes);

        const sortedApps = Array.isArray(appsRes)
          ? [...appsRes].sort(
              (a, b) =>
                new Date(b.appliedAt).getTime() -
                new Date(a.appliedAt).getTime()
            )
          : [];
        setApplications(sortedApps);

        setLatestTuitions(
          Array.isArray(tuitionsRes) ? tuitionsRes.slice(0, 3) : []
        );
      } catch (error) {
        console.error("Failed to load student dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [session?.user?.id, sessionLoading]);

  const totalApplied = applications.length;
  const pendingCount = applications.filter((a) => a.status === "pending").length;
  const acceptedCount = applications.filter(
    (a) => a.status === "accepted"
  ).length;
  const rejectedCount = applications.filter(
    (a) => a.status === "rejected"
  ).length;

  const recentApplications = applications.slice(0, 5);

  const isProfileIncomplete =
    !loading &&
    (!profile?.studentClass || !profile?.institution || !profile?.location);

  const displayName =
    profile?.name || session?.user?.name || "Student";

  const statCards = [
    {
      label: "Total Applied",
      value: totalApplied,
      icon: FileCheck2,
      iconBg: "bg-slate-100 text-slate-700",
    },
    {
      label: "Pending Review",
      value: pendingCount,
      icon: Clock,
      iconBg: "bg-amber-50 text-amber-600",
    },
    {
      label: "Accepted",
      value: acceptedCount,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Rejected",
      value: rejectedCount,
      icon: XCircle,
      iconBg: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Top Welcome Header */}
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 sm:flex-row sm:items-center sm:p-7">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-600">
            Student Workspace
          </span>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Welcome back, {displayName.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track your tuition applications and discover verified mentors across Bangladesh.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/mentors">
            <Button
              variant="outline"
              className="h-10 rounded-xl border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Users className="mr-1.5 size-4 text-slate-500" />
              Find Mentors
            </Button>
          </Link>
          <Link href="/tuitions">
            <Button className="h-10 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-blue-600">
              <Search className="mr-1.5 size-4" />
              Browse Tuitions
            </Button>
          </Link>
        </div>
      </section>

      {/* Profile Completion Prompt */}
      {isProfileIncomplete && (
        <section className="flex flex-col justify-between gap-3 rounded-2xl border border-blue-200/80 bg-blue-50/70 p-4 sm:flex-row sm:items-center sm:px-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Sparkles className="size-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Complete your academic profile
              </p>
              <p className="mt-0.5 text-xs text-slate-600">
                Add your class, school/college, and area so mentors can review your background faster when you apply.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/profile"
            className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Update Profile
            <ArrowUpRight className="size-3.5" />
          </Link>
        </section>
      )}

      {/* 4 Stat Cards */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  {stat.label}
                </span>
                <div
                  className={`flex size-8 items-center justify-center rounded-lg ${stat.iconBg}`}
                >
                  <Icon className="size-4" />
                </div>
              </div>

              {loading || sessionLoading ? (
                <div className="mt-3 h-7 w-12 animate-pulse rounded bg-slate-100" />
              ) : (
                <p className="mt-2.5 text-2xl font-extrabold tracking-tight text-slate-900 tabular-nums sm:text-3xl">
                  {stat.value}
                </p>
              )}
            </div>
          );
        })}
      </section>

      {/* Main 2-Column Content: Recent Applications + Academic Snapshot */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT: Recent Applications */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 lg:col-span-8">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Recent Applications
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Latest tuition posts you have applied to
              </p>
            </div>
            <Link
              href="/dashboard/student/applications"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View all
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          {loading || sessionLoading ? (
            <div className="mt-4 space-y-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-16 animate-pulse rounded-xl bg-slate-50"
                />
              ))}
            </div>
          ) : recentApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <AlertCircle className="size-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                No applications yet
              </h3>
              <p className="mt-1 max-w-xs text-xs text-slate-500">
                Browse verified tuition posts and submit your first application.
              </p>
              <Link href="/tuitions" className="mt-4">
                <Button
                  size="sm"
                  className="rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-blue-600"
                >
                  Explore Tuitions
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-slate-100">
              {recentApplications.map((app) => (
                <div
                  key={app._id}
                  className="flex flex-col justify-between gap-3 py-3.5 first:pt-1 last:pb-0 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/tuitions/${app.tuitionId}`}
                      className="line-clamp-1 text-sm font-bold text-slate-900 transition-colors hover:text-blue-600"
                    >
                      {app.tuitionTitle || "Tuition Post"}
                    </Link>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar className="size-3.5" />
                      Applied{" "}
                      {new Date(app.appliedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2.5">
                    {app.status === "accepted" && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 className="size-3" /> Accepted
                      </span>
                    )}
                    {app.status === "pending" && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                        <Clock className="size-3" /> Pending
                      </span>
                    )}
                    {app.status === "rejected" && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700">
                        <XCircle className="size-3" /> Rejected
                      </span>
                    )}

                    <Link
                      href={`/tuitions/${app.tuitionId}`}
                      className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-blue-300 hover:text-blue-600"
                      title="View Tuition Details"
                    >
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Academic Info Card */}
        <aside className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 lg:col-span-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900">
                My Academic Info
              </h2>
              <Link
                href="/dashboard/profile"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <Edit3 className="size-3.5" /> Edit
              </Link>
            </div>

            {loading || sessionLoading ? (
              <div className="mt-4 space-y-3">
                <div className="h-12 animate-pulse rounded-xl bg-slate-50" />
                <div className="h-12 animate-pulse rounded-xl bg-slate-50" />
                <div className="h-12 animate-pulse rounded-xl bg-slate-50" />
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                  <BookOpen className="mt-0.5 size-4 shrink-0 text-blue-600" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Class / Level
                    </p>
                    <p className="truncate text-sm font-bold text-slate-800">
                      {profile?.studentClass || "Not added yet"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                  <School className="mt-0.5 size-4 shrink-0 text-blue-600" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      School / College
                    </p>
                    <p className="truncate text-sm font-bold text-slate-800">
                      {profile?.institution || "Not added yet"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-blue-600" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Location
                    </p>
                    <p className="truncate text-sm font-bold text-slate-800">
                      {profile?.location || "Not added yet"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href="/dashboard/profile" className="mt-5 block">
            <Button
              variant="outline"
              className="h-10 w-full rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Manage Full Profile
            </Button>
          </Link>
        </aside>
      </section>

      {/* Bottom Section: Latest Verified Tuitions */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Latest Verified Tuitions
            </h2>
            <p className="text-xs text-slate-500">
              Fresh home &amp; online opportunities open for application
            </p>
          </div>
          <Link
            href="/tuitions"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Browse all
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-60 animate-pulse rounded-2xl border border-slate-200/80 bg-white p-6"
              />
            ))}
          </div>
        ) : latestTuitions.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white px-6 py-12 text-center text-sm text-slate-500">
            No active tuitions available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {latestTuitions.map((post) => (
              <TuitionCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}