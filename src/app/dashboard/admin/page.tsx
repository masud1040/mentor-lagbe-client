"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchTuitions } from "@/lib/api/tuition-api";
import {
  ShieldCheck,
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TuitionPost {
  _id: string;
  adminStatus: "pending" | "approved" | "rejected";
}

export default function AdminDashboardPage() {
  const [posts, setPosts] = useState<TuitionPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchTuitions();
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load admin overview:", error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const totalPosts = posts.length;
  const pendingCount = posts.filter((p) => p.adminStatus === "pending").length;
  const approvedCount = posts.filter((p) => p.adminStatus === "approved").length;
  const rejectedCount = posts.filter((p) => p.adminStatus === "rejected").length;

  const stats = [
    {
      label: "Total Posts",
      value: totalPosts,
      icon: BookOpen,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Pending Review",
      value: pendingCount,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Approved Posts",
      value: approvedCount,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Rejected Posts",
      value: rejectedCount,
      icon: XCircle,
      color: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      {/* Header */}
      <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xs sm:p-8">
        <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
          <ShieldCheck size={14} /> Admin Workspace
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Admin Overview
        </h1>
        <p className="mt-1 text-[15px] font-medium text-slate-500">
          Monitor tuition posts, approve pending submissions, and manage platform users.
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex items-center justify-center rounded-[2rem] border border-slate-100 bg-white py-16">
          <Loader2 className="size-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-[1.75rem] border border-slate-200/70 bg-white p-6 shadow-xs"
              >
                <div
                  className={`mb-4 inline-flex size-11 items-center justify-center rounded-xl ${item.color}`}
                >
                  <Icon className="size-5" />
                </div>
                <p className="text-sm font-semibold text-slate-500">
                  {item.label}
                </p>
                <p className="mt-1 text-3xl font-extrabold text-slate-900">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-[1.75rem] border border-slate-200/70 bg-white p-6 shadow-xs">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Manage Tuition Posts
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Approve, reject, or re-approve mentor tuition listings before they go live.
            </p>
          </div>
          <Link href="/dashboard/admin/tuitions" className="mt-5 block">
            <Button className="h-11 rounded-xl bg-blue-600 px-5 font-bold text-white hover:bg-blue-700">
              Go to Tuitions <ArrowRight className="ml-1.5 size-4" />
            </Button>
          </Link>
        </div>

        <div className="flex flex-col justify-between rounded-[1.75rem] border border-slate-200/70 bg-white p-6 shadow-xs">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Manage Users
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              View all registered students, mentors, and admins, and update user roles.
            </p>
          </div>
          <Link href="/dashboard/admin/users" className="mt-5 block">
            <Button
              variant="outline"
              className="h-11 rounded-xl border-slate-200 px-5 font-bold text-slate-800 hover:bg-slate-50"
            >
              <Users className="mr-1.5 size-4" /> Go to Users
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}