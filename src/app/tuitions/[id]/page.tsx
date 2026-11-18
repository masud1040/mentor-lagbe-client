"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Navbar from "@/components/shared/Nav";
import { useSession } from "@/lib/auth-client";
import { fetchTuitionById } from "@/lib/api/tuition-api";
import { applyForTuitionApi } from "@/lib/api/application-api";
import {
  ArrowLeft,
  BookOpen,
  MapPin,
  DollarSign,
  Users,
  User,
  Calendar,
  Wifi,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  Send,
  Phone,
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

export default function TuitionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: session } = useSession();
  const userRole = (session?.user as { role?: string } | undefined)?.role;

  const [post, setPost] = useState<TuitionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

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
        setApplied(true);
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

  return (
    <div className="min-h-screen bg-slate-50/70">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition-colors hover:text-blue-600"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {loading ? (
          <div className="flex items-center justify-center rounded-[2rem] border border-slate-100 bg-white py-24">
            <Loader2 className="size-8 animate-spin text-blue-600" />
          </div>
        ) : !post ? (
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-slate-100 bg-white py-24 text-center shadow-xs">
            <AlertCircle className="mb-3 size-12 text-slate-300" />
            <h2 className="text-xl font-bold text-slate-900">
              Tuition post not found
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              This post may have been removed or the link is invalid.
            </p>
            <Link href="/tuitions" className="mt-5">
              <Button className="rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700">
                Browse All Tuitions
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Main Details Card */}
            <div className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-xs sm:p-10">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
                  {post.category}
                </span>
                {post.isOnline && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600">
                    <Wifi size={13} /> Online
                  </span>
                )}
                {post.adminStatus === "approved" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600">
                    <CheckCircle2 size={13} /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-600">
                    <Clock size={13} /> {post.adminStatus}
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {post.title}
              </h1>

              {/* Meta Grid */}
              <div className="mt-6 grid gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-5 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Salary / Budget
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-lg font-extrabold text-slate-900">
                    <DollarSign size={16} className="text-blue-600" /> ৳
                    {post.budget}
                    <span className="text-xs font-medium text-slate-500">
                      /{post.frequency || "monthly"}
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Subject
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-800">
                    <BookOpen size={15} className="text-slate-400" />
                    {post.subject}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Location
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-800">
                    <MapPin size={15} className="text-slate-400" />
                    {post.location}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Applicants
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-800">
                    <Users size={15} className="text-slate-400" />
                    {post.applicantsCount || 0} Applied
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8">
                <h2 className="text-lg font-bold text-slate-900">
                  Tuition Description & Requirements
                </h2>
                <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-slate-600">
                  {post.description}
                </p>
              </div>

              {/* Footer Info */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6 text-sm font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-slate-400" />
                  Posted by{" "}
                  <span className="font-bold text-slate-900">
                    {post.authorName || "Mentor"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-slate-400" />
                  {new Date(post.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>

            {/* Apply Section */}
            <div className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-xs sm:p-10">
              <h2 className="text-xl font-extrabold text-slate-900">
                Apply for this Tuition
              </h2>

              {!canApply ? (
                <p className="mt-3 rounded-xl bg-amber-50 p-4 text-sm font-semibold text-amber-700">
                  This tuition post is currently closed or pending admin approval.
                </p>
              ) : !session?.user ? (
                <div className="mt-4 flex flex-col items-start justify-between gap-4 rounded-2xl bg-slate-50 p-5 sm:flex-row sm:items-center">
                  <p className="text-sm font-medium text-slate-600">
                    Sign in with a student account to apply for this tuition.
                  </p>
                  <Link href="/sign-in">
                    <Button className="rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700">
                      Sign In to Apply
                    </Button>
                  </Link>
                </div>
              ) : userRole !== "student" ? (
                <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                  Only student accounts can apply for tuition posts.
                </p>
              ) : applied ? (
                <div className="mt-4 flex items-center gap-3 rounded-2xl bg-emerald-50 p-5 text-emerald-700">
                  <CheckCircle2 className="size-6 shrink-0" />
                  <div>
                    <p className="font-bold">Application Submitted!</p>
                    <p className="text-sm">
                      The mentor will review your request and contact you soon.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApply} className="mt-5 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-semibold text-slate-800">
                      Contact Number
                    </Label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="phone"
                        type="tel"
                        required
                        placeholder="e.g. 017XXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-10 focus-visible:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="font-semibold text-slate-800">
                      Short Note / Availability
                    </Label>
                    <Textarea
                      id="message"
                      required
                      rows={4}
                      placeholder="Write your class/background, preferred schedule, or any questions..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="resize-none rounded-xl border-slate-200 bg-slate-50 p-3.5 focus-visible:bg-white"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={applying}
                    className="h-12 rounded-xl bg-blue-600 px-8 font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700"
                  >
                    {applying ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 size-4" /> Submit Application
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}