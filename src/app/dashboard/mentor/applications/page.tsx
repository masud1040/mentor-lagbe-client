"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { fetchTuitions } from "@/lib/api/tuition-api";
import {
  fetchApplicationsApi,
  updateApplicationStatusApi,
} from "@/lib/api/application-api";
import {
  Inbox,
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApplicationItem {
  _id: string;
  tuitionId: string;
  tuitionTitle?: string;
  studentName?: string;
  studentEmail?: string;
  phone?: string;
  message?: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
}

export default function MentorApplicationsPage() {
  const { data: session, isPending } = useSession();
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (isPending || !session?.user?.id) return;

    const loadAllApplications = async () => {
      setLoading(true);
      try {
        const myPosts = await fetchTuitions({ mentorId: session.user.id });
        if (!Array.isArray(myPosts) || myPosts.length === 0) {
          setApplications([]);
          return;
        }

        const results = await Promise.all(
          myPosts.map((post: { _id: string }) =>
            fetchApplicationsApi({ tuitionId: post._id }).catch(() => [])
          )
        );

        const merged = results
          .flat()
          .sort(
            (a, b) =>
              new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
          );

        setApplications(merged);
      } catch (error) {
        console.error("Failed to load applications:", error);
        toast.error("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    loadAllApplications();
  }, [session?.user?.id, isPending]);

  const handleStatusUpdate = async (
    id: string,
    status: "accepted" | "rejected"
  ) => {
    setActionLoading(`${status}-${id}`);
    try {
      const { ok, data } = await updateApplicationStatusApi(id, status);
      if (ok && data.success) {
        setApplications((prev) =>
          prev.map((app) => (app._id === id ? { ...app, status } : app))
        );
        toast.success(
          status === "accepted"
            ? "Application accepted!"
            : "Application rejected."
        );
      } else {
        toast.error("Failed to update status.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="mx-auto max-w-[1050px] space-y-6">
      {/* Header */}
      <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xs sm:p-8">
        <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
          <Inbox size={14} /> Incoming Requests
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Student Applications
        </h1>
        <p className="mt-1 text-[15px] font-medium text-slate-500">
          Review students who applied to your tuition posts and accept or reject their requests.
        </p>
      </div>

      {/* Applications List */}
      {loading || isPending ? (
        <div className="flex items-center justify-center rounded-[2rem] border border-slate-100 bg-white py-20">
          <Loader2 className="size-8 animate-spin text-blue-600" />
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-slate-100 bg-white py-20 text-center shadow-xs">
          <AlertCircle className="mb-3 size-12 text-slate-300" />
          <h3 className="text-lg font-bold text-slate-900">
            No applications yet
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            When students apply to your approved tuition posts, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {applications.map((app) => (
            <div
              key={app._id}
              className="flex flex-col gap-5 rounded-[1.75rem] border border-slate-200/70 bg-white p-6 shadow-xs transition-all hover:border-blue-200 hover:shadow-md lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  {app.status === "accepted" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                      <CheckCircle2 size={13} /> Accepted
                    </span>
                  )}
                  {app.status === "pending" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-600">
                      <Clock size={13} /> Pending
                    </span>
                  )}
                  {app.status === "rejected" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-600">
                      <XCircle size={13} /> Rejected
                    </span>
                  )}

                  <Link
                    href={`/tuitions/${app.tuitionId}`}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    {app.tuitionTitle || "View Tuition Post"}
                    <ExternalLink size={12} />
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-700">
                  <span className="flex items-center gap-1.5 font-bold text-slate-900">
                    <User size={15} className="text-blue-600" />
                    {app.studentName || "Student"}
                  </span>
                  {app.studentEmail && (
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Mail size={15} className="text-slate-400" />
                      {app.studentEmail}
                    </span>
                  )}
                  {app.phone && (
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <Phone size={15} className="text-slate-400" />
                      {app.phone}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar size={14} />
                    {new Date(app.appliedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {app.message && (
                  <p className="rounded-xl bg-slate-50 p-3.5 text-sm text-slate-600">
                    {app.message}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2.5 border-t border-slate-100 pt-4 lg:border-t-0 lg:pt-0">
                {app.status !== "accepted" && (
                  <Button
                    onClick={() => handleStatusUpdate(app._id, "accepted")}
                    disabled={actionLoading === `accepted-${app._id}`}
                    className="h-10 rounded-xl bg-emerald-600 px-4 font-bold text-white hover:bg-emerald-700"
                  >
                    {actionLoading === `accepted-${app._id}` ? (
                      <Loader2 className="mr-1.5 size-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="mr-1.5 size-4" />
                    )}
                    Accept
                  </Button>
                )}

                {app.status !== "rejected" && (
                  <Button
                    onClick={() => handleStatusUpdate(app._id, "rejected")}
                    disabled={actionLoading === `rejected-${app._id}`}
                    variant="outline"
                    className="h-10 rounded-xl border-rose-200 bg-rose-50 font-bold text-rose-600 hover:bg-rose-100"
                  >
                    {actionLoading === `rejected-${app._id}` ? (
                      <Loader2 className="mr-1.5 size-4 animate-spin" />
                    ) : (
                      <XCircle className="mr-1.5 size-4" />
                    )}
                    Reject
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}