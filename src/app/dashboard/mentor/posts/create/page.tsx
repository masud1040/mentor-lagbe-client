"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { fetchMyProfileApi } from "@/lib/api/user-api";
import { fetchTuitions } from "@/lib/api/tuition-api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  MapPin,
  DollarSign,
  Loader2,
  Sparkles,
  GraduationCap,
  Lock,
  ArrowUpRight,
  Crown,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface TuitionFormData {
  title: string;
  subject: string;
  category: string;
  isOnline: boolean;
  location: string;
  budget: string;
  frequency: string;
  description: string;
}

const inputClass =
  "h-12 rounded-xl border-slate-200 bg-slate-50/50 px-4 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-blue-500/10 focus-visible:border-blue-500 transition-all";
const cardClass =
  "rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs";

export default function CreateTuitionPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingPlan, setCheckingPlan] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [postsCount, setPostsCount] = useState(0);

  const [form, setForm] = useState<TuitionFormData>({
    title: "",
    subject: "",
    category: "",
    isOnline: false,
    location: "",
    budget: "",
    frequency: "monthly",
    description: "",
  });

  useEffect(() => {
    const checkQuota = async () => {
      setCheckingPlan(true);
      try {
        const profile = await fetchMyProfileApi();
        const premium = Boolean(profile?.isPremium);
        setIsPremium(premium);

        if (profile?._id || profile?.email) {
          const myPosts = await fetchTuitions({
            mentorId: profile._id,
            mentorEmail: profile.email,
          });
          setPostsCount(Array.isArray(myPosts) ? myPosts.length : 0);
        }
      } catch (error) {
        console.error("Failed to check mentor plan:", error);
      } finally {
        setCheckingPlan(false);
      }
    };

    checkQuota();
  }, []);

  const set =
    <K extends keyof TuitionFormData>(key: K) =>
    (value: TuitionFormData[K]) =>
      setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.category) {
      toast.error("Please select a category.");
      return;
    }

    setLoading(true);

    const postData = {
      ...form,
      budget: Number(form.budget),
      location: form.isOnline ? "Online" : form.location,
    };

    try {
      const response = await fetch(`${API_URL}/tuitions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (response.ok && result.success !== false) {
        toast.success("Tuition post published successfully!");
        router.push("/dashboard/mentor/posts");
        router.refresh();
      } else {
        if (result.requiresPricing) {
          toast.error(
            result.message || "You have reached your free limit of 2 posts."
          );
          router.push("/dashboard/mentor/pricing");
        } else {
          toast.error(result.message || "Failed to create post.");
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Server is offline or network error.");
    }

    setLoading(false);
  };

  if (checkingPlan) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-[800px] items-center justify-center">
        <Loader2 className="size-7 animate-spin text-blue-600" />
      </div>
    );
  }

  // Proactive Lock if Free Mentor already used 2/2 posts
  if (!isPremium && postsCount >= 2) {
    return (
      <div className="mx-auto max-w-xl py-8">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-7 text-center shadow-xs sm:p-10">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Lock className="size-7" />
          </div>

          <span className="mt-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            Free Plan Quota Used ({postsCount}/2 Posts)
          </span>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
            Upgrade to Pro for Unlimited Posts
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            You have reached the 2-post limit on the Free plan. Unlock unlimited tuition listings and a verified Pro Mentor badge with a one-time upgrade.
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Link href="/dashboard/mentor/pricing">
              <Button className="h-11 w-full rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white hover:bg-blue-600 sm:w-auto">
                Upgrade to Pro
                <ArrowUpRight className="ml-1.5 size-4" />
              </Button>
            </Link>
            <Link href="/dashboard/mentor/posts">
              <Button
                variant="outline"
                className="h-11 w-full rounded-xl border-slate-200 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto"
              >
                Manage Existing Posts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[800px] space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-600">
            <Sparkles className="size-3.5" /> New Listing
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Post a Tuition Request
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Fill in the details below to attract the best students across our network.
          </p>
        </div>

        {isPremium ? (
          <span className="inline-flex items-center gap-1.5 self-start rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 sm:self-auto">
            <Crown className="size-3.5" /> Pro Plan • Unlimited Posts
          </span>
        ) : (
          <span className="inline-flex items-center self-start rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 tabular-nums sm:self-auto">
            Free Quota: {postsCount}/2 used
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* 1. Basic Information */}
        <section className={cardClass}>
          <h2 className="mb-5 text-lg font-bold text-slate-900">
            Basic Information
          </h2>
          <div className="flex flex-col gap-5">
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-sm font-semibold text-slate-800"
              >
                Post Title
              </Label>
              <Input
                id="title"
                required
                minLength={5}
                maxLength={120}
                placeholder="e.g. Need an experienced Math Tutor for HSC candidate"
                value={form.title}
                onChange={(e) => set("title")(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="subject"
                  className="text-sm font-semibold text-slate-800"
                >
                  Subject
                </Label>
                <div className="relative">
                  <BookOpen className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="subject"
                    required
                    placeholder="e.g. Higher Math & Physics"
                    value={form.subject}
                    onChange={(e) => set("subject")(e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-sm font-semibold text-slate-800"
                >
                  Category
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(val) => set("category")(val)}
                >
                  <SelectTrigger id="category" className={`${inputClass} w-full`}>
                    <SelectValue placeholder="Select class/level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary (Class 1-5)</SelectItem>
                    <SelectItem value="jsc">JSC (Class 6-8)</SelectItem>
                    <SelectItem value="ssc">SSC (Class 9-10)</SelectItem>
                    <SelectItem value="hsc">HSC (Class 11-12)</SelectItem>
                    <SelectItem value="admission">University Admission</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Location & Compensation */}
        <section className={cardClass}>
          <h2 className="mb-5 text-lg font-bold text-slate-900">
            Location &amp; Compensation
          </h2>
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/70 bg-slate-50/70 p-4">
              <div className="flex flex-col gap-0.5">
                <Label
                  htmlFor="isOnline"
                  className="text-sm font-bold text-slate-800"
                >
                  Online Tuition
                </Label>
                <p className="text-xs text-slate-500">
                  Enable this if the tuition can be conducted via Zoom/Google Meet.
                </p>
              </div>
              <Switch
                id="isOnline"
                checked={form.isOnline}
                onCheckedChange={(checked) => set("isOnline")(checked)}
              />
            </div>

            {!form.isOnline && (
              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-sm font-semibold text-slate-800"
                >
                  Location
                </Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="location"
                    required={!form.isOnline}
                    placeholder="e.g. Mirpur 10, Dhaka"
                    value={form.location}
                    onChange={(e) => set("location")(e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="budget"
                  className="text-sm font-semibold text-slate-800"
                >
                  Budget / Salary (৳)
                </Label>
                <div className="relative">
                  <DollarSign className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="budget"
                    type="number"
                    min={0}
                    required
                    placeholder="e.g. 5000"
                    value={form.budget}
                    onChange={(e) => set("budget")(e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="frequency"
                  className="text-sm font-semibold text-slate-800"
                >
                  Frequency
                </Label>
                <Select
                  value={form.frequency}
                  onValueChange={(val) => set("frequency")(val)}
                >
                  <SelectTrigger id="frequency" className={`${inputClass} w-full`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Per Month</SelectItem>
                    <SelectItem value="per-class">Per Class</SelectItem>
                    <SelectItem value="course">Entire Course</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Details & Requirements */}
        <section className={cardClass}>
          <h2 className="mb-5 text-lg font-bold text-slate-900">
            Details &amp; Requirements
          </h2>
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-semibold text-slate-800"
            >
              Tuition Description
            </Label>
            <Textarea
              id="description"
              required
              rows={5}
              maxLength={2000}
              placeholder="Describe the student's current situation, specific requirements, schedule preferences, etc."
              value={form.description}
              onChange={(e) => set("description")(e.target.value)}
              className="resize-none rounded-xl border-slate-200 bg-slate-50/50 p-4 transition-all focus-visible:border-blue-500 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-blue-500/10"
            />
          </div>
        </section>

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-slate-900 px-8 text-sm font-semibold text-white transition-all hover:bg-blue-600 disabled:opacity-70 sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" /> Publishing...
              </>
            ) : (
              <>
                <GraduationCap className="mr-2 size-4" /> Publish Tuition Post
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}