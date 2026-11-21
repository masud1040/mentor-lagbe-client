"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import {
  cancelApplicationApi,
  fetchApplicationsApi,
} from "@/lib/api/application-api";
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  Phone,
  ExternalLink,
  Loader2,
  AlertCircle,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudentApplication {
  _id: string;
  tuitionId: string;
  tuitionTitle?: string;
  phone?: string;
  message?: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
}

type StatusFilter = "all" | "pending" | "accepted" | "rejected";

export default function StudentApplicationsPage() {
  const { data: session, isPending } = useSession();
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<StatusFilter>("all");

  useEffect(() => {
    if (isPending || !session?.user?.id) return;

    const loadMyApplications = async () => {
      setLoading(true);
      try {
        const data = await fetchApplicationsApi({
          applicantId: session.user.id,
        });
        setApplications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch student applications:", error);
        toast.error("Failed to load your applications.");
      } finally {
        setLoading(false);
      }
    };

    loadMyApplications();
  }, [session?.user?.id, isPending]);

  const handleCancelApplication = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this application?"
    );
    if (!confirmed) return;

    setCancelingId(id);
    try {
      const { ok, data } = await cancelApplicationApi(id);
      if (ok && data?.success !== false) {
        setApplications((prev) => prev.filter((item) => item._id !== id));
        toast.success("Application canceled successfully.");
      } else {
        toast.error(data?.message || "Failed to cancel application.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setCancelingId(null);
    }
  };

  const counts = useMemo(
    () => ({
      all: applications.length,
      pending: applications.filter((a) => a.status === "pending").length,
      accepted: applications.filter((a) => a.status === "accepted").length,
      rejected: applications.filter((a) => a.status === "rejected").length,
    }),
    [applications]
  );

  const filteredApplications = useMemo(() => {
    if (activeTab === "all") return applications;
    return applications.filter((a) => a.status === activeTab);
  }, [applications, activeTab]);

  const tabs: { key: StatusFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "pending", label: "Pending", count: counts.pending },
    { key: "accepted", label: "Approved", count: counts.accepted },
    { key: "rejected", label: "Rejected", count: counts.rejected },
  ];

  return (
    <div className="mx-auto max-w-[1050px] space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:p-8">
        <div>
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
            <CheckSquare size={14} /> Student Workspace
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            My Applications
          </h1>
          <p className="mt-1 text-[15px] font-medium text-slate-500">
            Track the status of your tuition applications in real time.
          </p>
        </div>

        <Link href="/tuitions">
          <Button className="h-11 rounded-xl bg-blue-600 px-5 font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700">
            <Search className="mr-2 size-4" /> Browse Tuitions
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-100 bg-white p-2 shadow-xs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-extrabold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {loading || isPending ? (
        <div className="flex items-center justify-center rounded-[2rem] border border-slate-100 bg-white py-20">
          <Loader2 className="size-8 animate-spin text-blue-600" />
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-slate-100 bg-white py-20 text-center shadow-xs">
          <AlertCircle className="mb-3 size-12 text-slate-300" />
          <h3 className="text-lg font-bold text-slate-900">
            No applications found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {activeTab === "all"
              ? "You haven't applied to any tuition posts yet."
              : `No ${activeTab === "accepted" ? "approved" : activeTab} applications found.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {filteredApplications.map((app) => (
            <div
              key={app._id}
              className="flex flex-col gap-5 rounded-[1.75rem] border border-slate-200/70 bg-white p-6 shadow-xs transition-all hover:border-blue-200 hover:shadow-md lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  {app.status === "accepted" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                      <CheckCircle2 size={13} /> Approved
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
                </div>

                <div>
                  <Link
                    href={`/tuitions/${app.tuitionId}`}
                    className="group inline-flex items-center gap-2 text-xl font-extrabold text-slate-900 transition-colors hover:text-blue-600"
                  >
                    <span className="line-clamp-1">
                      {app.tuitionTitle || "Tuition Post"}
                    </span>
                    <ExternalLink className="size-4 shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[13.5px] font-semibold text-slate-600">
                  {app.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone size={15} className="text-slate-400" /> {app.phone}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Calendar size={15} className="text-slate-400" />
                    Applied on{" "}
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

              <div className="flex flex-wrap items-center gap-2.5 border-t border-slate-100 pt-4 lg:border-t-0 lg:pt-0">
                <Link href={`/tuitions/${app.tuitionId}`}>
                  <Button
                    variant="outline"
                    className="h-10 rounded-xl border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50"
                  >
                    View Tuition <ExternalLink className="ml-1.5 size-4" />
                  </Button>
                </Link>

                {app.status === "pending" && (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={cancelingId === app._id}
                    onClick={() => handleCancelApplication(app._id)}
                    className="h-10 rounded-xl border-rose-200 bg-rose-50/50 font-bold text-rose-600 hover:bg-rose-100 hover:text-rose-700"
                  >
                    {cancelingId === app._id ? (
                      <>
                        <Loader2 className="mr-1.5 size-4 animate-spin" />
                        Canceling...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-1.5 size-4" />
                        Cancel
                      </>
                    )}
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