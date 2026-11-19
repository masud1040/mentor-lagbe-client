"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Navbar from "@/components/shared/Nav";
import { useSession } from "@/lib/auth-client";
import { fetchTuitionById } from "@/lib/api/tuition-api";
import {
  applyForTuitionApi,
  fetchApplicationsApi,
} from "@/lib/api/application-api";
import {
  ArrowLeft,
  BookOpen,
  MapPin,
  Users,
  Calendar,
  Wifi,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  Send,
  Phone,
  ShieldCheck,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TuitionDetail {
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
  status: string;
  adminStatus: string;
  applicantsCount?: number;
  createdAt: string;
}

interface ExistingApplication {
  _id?: string;
  tuitionId: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  primary: "Primary",
  jsc: "JSC",
  ssc: "SSC",
  hsc: "HSC",
  admission: "Admission",
};

const FREQUENCY_LABELS: Record<string, string> = {
  monthly: "month",
  "per-class": "class",
  course: "course",
};

export default function TuitionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: session, isPending: sessionLoading } = useSession();
  const userRole = (session?.user as { role?: string } | undefined)?.role;

  const [post, setPost] = useState<TuitionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [existingApp, setExistingApp] = useState<ExistingApplication | null>(
    null
  );
  const [checkingApp, setCheckingApp] = useState(false);

  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [applying, setApplying] = useState(false);

  // 1. Fetch tuition details
  useEffect(() => {
    if (!id) return;
    const loadDetail = async () => {
      setLoading(true);
      try {
        const data = await fetchTuitionById(id);
        setPost(data);
      } catch (error) {
        console.error("Failed to fetch tuition detail:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [id]);

  // 2. Check if logged-in student already applied to this tuition
  useEffect(() => {
    if (sessionLoading || !session?.user?.id || userRole !== "student" || !id) {
      return;
    }

    const checkExistingApplication = async () => {
      setCheckingApp(true);
      try {
        const apps = await fetchApplicationsApi({
          applicantId: session.user.id,
        });
        if (Array.isArray(apps)) {
          const matching = apps.filter(
            (a: ExistingApplication) => a.tuitionId === id
          );
          if (matching.length > 0) {
            // Active (pending/accepted) thakle seta priority pabe
            const active = matching.find(
              (a: ExistingApplication) => a.status !== "rejected"
            );
            setExistingApp(active || matching[0]);
          }
        }
      } catch (error) {
        console.error("Failed to check application status:", error);
      } finally {
        setCheckingApp(false);
      }
    };

    checkExistingApplication();
  }, [id, session?.user?.id, sessionLoading, userRole]);

  const handleApply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!post) return;

    if (!session?.user) {
      toast.error("Please sign in as a student to apply.");
      router.push("/sign-in");
      return;
    }

    setApplying(true);
    try {
      const { ok, data } = await applyForTuitionApi({
        tuitionId: post._id,
        phone: phone.trim(),
        message: message.trim(),
      });

      if (ok && data.success) {
        toast.success("Application submitted successfully!");
        setExistingApp({
          tuitionId: post._id,
          status: "pending",
          appliedAt: new Date().toISOString(),
        });
        setPhone("");
        setMessage("");
        setPost((prev) =>
          prev
            ? { ...prev, applicantsCount: (prev.applicantsCount || 0) + 1 }
            : prev
        );
      } else {
        toast.error(data.message || "Failed to submit application.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const canApply =
    post?.status === "active" && post?.adminStatus === "approved";

  const hasActiveApplication =
    existingApp !== null && existingApp.status !== "rejected";

  const categoryLabel =
    CATEGORY_LABELS[post?.category?.toLowerCase() || ""] ||
    post?.category ||
    "General";
  const freqLabel =
    FREQUENCY_LABELS[post?.frequency || "monthly"] ||
    post?.frequency ||
    "month";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="size-4" /> Back to listings
        </button>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="h-96 animate-pulse rounded-2xl border border-slate-200/80 bg-white p-6 lg:col-span-8" />
            <div className="h-72 animate-pulse rounded-2xl border border-slate-200/80 bg-white p-6 lg:col-span-4" />
          </div>
        ) : !post ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white px-6 py-20 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <AlertCircle className="size-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Tuition post not found
            </h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              This post may have been removed or the link is no longer valid.
            </p>
            <Link href="/tuitions" className="mt-5">
              <Button className="rounded-xl bg-slate-900 px-5 font-semibold text-white hover:bg-blue-600">
                Browse All Tuitions
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            {/* LEFT COLUMN: Tuition Details */}
            <div className="space-y-5 lg:col-span-8">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {categoryLabel}
                  </span>
                  {post.isOnline ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <Wifi className="size-3.5" /> Online
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                      Home Tuition
                    </span>
                  )}
                  {post.adminStatus === "approved" ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <ShieldCheck className="size-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold capitalize text-amber-700">
                      <Clock className="size-3.5" /> {post.adminStatus}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  {post.title}
                </h1>

                {/* Compact Key Facts Strip */}
                <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-slate-200/70 bg-slate-50/70 p-4 sm:grid-cols-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Salary
                    </p>
                    <p className="mt-1 text-base font-extrabold text-slate-900 tabular-nums">
                      ৳{Number(post.budget || 0).toLocaleString()}
                      <span className="text-xs font-medium text-slate-500">
                        /{freqLabel}
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Subject
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                      <BookOpen className="size-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{post.subject}</span>
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Location
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                      <MapPin className="size-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{post.location}</span>
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Applicants
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                      <Users className="size-3.5 shrink-0 text-slate-400" />
                      <span>{post.applicantsCount || 0} Applied</span>
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <h2 className="text-base font-bold text-slate-900">
                    Description &amp; Requirements
                  </h2>
                  <p className="mt-2.5 whitespace-pre-line text-sm leading-relaxed text-slate-600 sm:text-[15px]">
                    {post.description}
                  </p>
                </div>

                {/* Mentor Info Footer */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                      {(post.authorName || "M").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {post.authorName || "Verified Mentor"}
                      </p>
                      <p className="text-xs text-slate-500">Tuition Mentor</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Calendar className="size-3.5 text-slate-400" />
                    Posted{" "}
                    {new Date(post.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Sticky Apply / Status Panel */}
            <aside className="lg:sticky lg:top-24 lg:col-span-4">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
                <h2 className="text-base font-bold text-slate-900">
                  {hasActiveApplication
                    ? "Application Status"
                    : "Apply for this Tuition"}
                </h2>

                {!canApply ? (
                  <div className="mt-4 rounded-xl border border-amber-200/70 bg-amber-50/70 p-4 text-sm font-medium text-amber-800">
                    This tuition post is currently closed or awaiting admin approval.
                  </div>
                ) : sessionLoading || checkingApp ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="size-5 animate-spin text-blue-600" />
                  </div>
                ) : !session?.user ? (
                  <div className="mt-4 space-y-4">
                    <p className="text-sm leading-relaxed text-slate-500">
                      Sign in with your student account to apply and connect directly with the mentor.
                    </p>
                    <Link href="/sign-in" className="block">
                      <Button className="h-11 w-full rounded-xl bg-slate-900 font-semibold text-white hover:bg-blue-600">
                        Sign In to Apply
                      </Button>
                    </Link>
                  </div>
                ) : userRole !== "student" ? (
                  <div className="mt-4 rounded-xl border border-slate-200/70 bg-slate-50 p-4 text-sm font-medium text-slate-600">
                    Only student accounts can submit applications for tuition posts.
                  </div>
                ) : hasActiveApplication ? (
                  /* Button & Form completely hidden once applied */
                  <div className="mt-4 space-y-4">
                    <div
                      className={`rounded-xl border p-4 ${
                        existingApp.status === "accepted"
                          ? "border-emerald-200 bg-emerald-50/70 text-emerald-800"
                          : "border-blue-200 bg-blue-50/70 text-blue-800"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold">
                        {existingApp.status === "accepted" ? (
                          <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                        ) : (
                          <Clock className="size-5 shrink-0 text-blue-600" />
                        )}
                        <span>
                          {existingApp.status === "accepted"
                            ? "Application Approved"
                            : "Already Applied"}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed opacity-90">
                        {existingApp.status === "accepted"
                          ? "Congratulations! The mentor has accepted your application."
                          : "Your application is currently pending review by the mentor."}
                      </p>
                    </div>

                    <Link
                      href="/dashboard/student/applications"
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      View My Applications
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="mt-4 space-y-4">
                    {existingApp?.status === "rejected" && (
                      <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs font-medium text-amber-800">
                        <RotateCcw className="mt-0.5 size-3.5 shrink-0" />
                        <span>
                          Your previous application was rejected. You can submit a new application below.
                        </span>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="phone"
                        className="text-xs font-semibold text-slate-700"
                      >
                        Contact Number
                      </Label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="phone"
                          type="tel"
                          required
                          placeholder="017XXXXXXXX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="h-10 rounded-xl border-slate-200 bg-slate-50/70 pl-9 text-sm focus-visible:bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="message"
                        className="text-xs font-semibold text-slate-700"
                      >
                        Short Note
                      </Label>
                      <Textarea
                        id="message"
                        required
                        rows={4}
                        placeholder="Mention your class, preferred time, or any questions..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="resize-none rounded-xl border-slate-200 bg-slate-50/70 p-3 text-sm focus-visible:bg-white"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={applying}
                      className="h-11 w-full rounded-xl bg-blue-600 font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                      {applying ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 size-4" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}