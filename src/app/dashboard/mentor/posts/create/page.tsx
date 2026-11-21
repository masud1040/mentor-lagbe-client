"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { fetchMyProfileApi } from "@/lib/api/user-api";
import { createTuitionApi, fetchTuitions } from "@/lib/api/tuition-api";
import { uploadImageToImgBB } from "@/lib/api/imgbb";

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
  Banknote,
  Loader2,
  Sparkles,
  GraduationCap,
  Lock,
  ArrowUpRight,
  Crown,
  UploadCloud,
  X,
  Link2,
} from "lucide-react";

interface TuitionFormData {
  title: string;
  subject: string;
  category: string;
  isOnline: boolean;
  location: string;
  budget: string;
  frequency: string;
  description: string;
  image: string;
}

const inputClass =
  "h-11 rounded-xl border border-slate-200/90 bg-white px-3.5 text-sm text-slate-900 shadow-2xs placeholder:text-slate-400 transition-all hover:border-slate-300 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/10";
const labelClass =
  "text-xs font-semibold uppercase tracking-wide text-slate-600";
const cardClass =
  "rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-7";

export default function CreateTuitionPostPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
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
    image: "",
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB.");
      return;
    }

    setUploadingImage(true);
    try {
      const uploadedUrl = await uploadImageToImgBB(file);
      set("image")(uploadedUrl);
      toast.success("Cover image uploaded!");
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Failed to upload image.";
      toast.error(msg);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.category) {
      toast.error("Please select a class/category.");
      return;
    }

    if (uploadingImage) {
      toast.error("Please wait for the image upload to finish.");
      return;
    }

    setLoading(true);

    const postData = {
      ...form,
      budget: Number(form.budget),
      location: form.isOnline ? "Online" : form.location.trim(),
    };

    try {
      const { ok, data } = await createTuitionApi(postData);

      if (ok && data?.success !== false) {
        toast.success("Tuition post submitted for admin approval!");
        router.push("/dashboard/mentor/posts");
        router.refresh();
      } else if (data?.requiresPricing) {
        toast.error(
          data.message || "You have reached your free limit of 2 posts.",
        );
        router.push("/dashboard/mentor/pricing");
      } else {
        toast.error(data?.message || "Failed to create post.");
      }
    } catch {
      toast.error("Server is offline or network error.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingPlan) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-[820px] items-center justify-center">
        <Loader2 className="size-7 animate-spin text-blue-600" />
      </div>
    );
  }

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
            You have reached the 2-post limit on the Free plan. Unlock unlimited
            tuition listings and a verified Pro Mentor badge with a one-time
            upgrade.
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
    <div className="mx-auto max-w-[820px] space-y-6 pb-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-600">
            <Sparkles className="size-3.5" /> New Listing
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Post a Tuition Batch
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Provide clear details about your subject, schedule, and fee to
            attract students.
          </p>
        </div>

        {isPremium ? (
          <span className="inline-flex items-center gap-1.5 self-start rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 sm:self-auto">
            <Crown className="size-3.5" /> Pro Plan • Unlimited
          </span>
        ) : (
          <span className="inline-flex items-center self-start rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 tabular-nums sm:self-auto">
            Free Quota: {postsCount}/2 used
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className={cardClass}>
          <div className="mb-5 border-b border-slate-100 pb-3.5">
            <h2 className="text-base font-bold text-slate-900">
              1. Basic Information
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Clear titles and subjects help students find your listing faster.
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="title" className={labelClass}>
                Post Title
              </Label>
              <Input
                id="title"
                required
                minLength={5}
                maxLength={120}
                placeholder="e.g. HSC Higher Math & Physics Intensive Batch"
                value={form.title}
                onChange={(e) => set("title")(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="subject" className={labelClass}>
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

              <div className="space-y-1.5">
                <Label htmlFor="category" className={labelClass}>
                  Class / Level
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(val) => set("category")(val ?? "")}
                >
                  <SelectTrigger
                    id="category"
                    className={`${inputClass} w-full`}
                  >
                    <SelectValue placeholder="Select class level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary (Class 1-5)</SelectItem>
                    <SelectItem value="jsc">JSC (Class 6-8)</SelectItem>
                    <SelectItem value="ssc">SSC (Class 9-10)</SelectItem>
                    <SelectItem value="hsc">HSC (Class 11-12)</SelectItem>
                    <SelectItem value="admission">
                      University Admission
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        <section className={cardClass}>
          <div className="mb-5 border-b border-slate-100 pb-3.5">
            <h2 className="text-base font-bold text-slate-900">
              2. Mode, Location &amp; Fee
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Set whether classes are online or offline along with your tuition
              fee.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-slate-50/70 px-4 py-3.5">
              <div>
                <Label
                  htmlFor="isOnline"
                  className="text-sm font-bold text-slate-800"
                >
                  Online Tuition
                </Label>
                <p className="text-xs text-slate-500">
                  Conduct classes remotely via Zoom or Google Meet.
                </p>
              </div>
              <Switch
                id="isOnline"
                checked={form.isOnline}
                onCheckedChange={(checked) => set("isOnline")(checked)}
              />
            </div>

            {!form.isOnline && (
              <div className="space-y-1.5">
                <Label htmlFor="location" className={labelClass}>
                  Location
                </Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="location"
                    required={!form.isOnline}
                    placeholder="e.g. GEC Circle, Chattogram"
                    value={form.location}
                    onChange={(e) => set("location")(e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="budget" className={labelClass}>
                  Tuition Fee (৳)
                </Label>
                <div className="relative">
                  <Banknote className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="budget"
                    type="number"
                    min={0}
                    required
                    placeholder="e.g. 5000"
                    value={form.budget}
                    onChange={(e) => set("budget")(e.target.value)}
                    className={`${inputClass} pl-10 tabular-nums`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="frequency" className={labelClass}>
                  Billing Frequency
                </Label>
                <Select
                  value={form.frequency}
                  onValueChange={(val) => set("frequency")(val ?? "monthly")}
                >
                  <SelectTrigger
                    id="frequency"
                    className={`${inputClass} w-full`}
                  >
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

        <section className={cardClass}>
          <div className="mb-5 border-b border-slate-100 pb-3.5">
            <h2 className="text-base font-bold text-slate-900">
              3. Details &amp; Requirements
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Mention days per week, teaching style, and target exam
              preparation.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className={labelClass}>
              Tuition Description
            </Label>
            <Textarea
              id="description"
              required
              rows={5}
              maxLength={2000}
              placeholder="Describe the syllabus coverage, weekly class schedule, exam practice, and expectations..."
              value={form.description}
              onChange={(e) => set("description")(e.target.value)}
              className="resize-none rounded-xl border border-slate-200/90 bg-white p-3.5 text-sm text-slate-900 shadow-2xs placeholder:text-slate-400 transition-all hover:border-slate-300 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/10"
            />
          </div>
        </section>

        <section className={cardClass}>
          <div className="mb-5 border-b border-slate-100 pb-3.5">
            <h2 className="text-base font-bold text-slate-900">
              4. Cover Banner{" "}
              <span className="text-xs font-medium text-slate-400">
                (Optional)
              </span>
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Upload a cover image directly via ImgBB or paste an image link.
              Leave blank to use our clean default cover.
            </p>
          </div>

          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {form.image ? (
              <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <div className="aspect-[16/9] w-full max-w-md overflow-hidden bg-slate-100">
                  <img
                    src={form.image}
                    alt="Cover preview"
                    className="size-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-slate-200/80 bg-white px-4 py-2.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {uploadingImage ? "Uploading..." : "Change Image"}
                  </button>
                  <button
                    type="button"
                    onClick={() => set("image")("")}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
                  >
                    <X className="size-3.5" /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 px-6 py-8 text-center transition-all hover:border-blue-400 hover:bg-blue-50/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-xs">
                  {uploadingImage ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <UploadCloud className="size-5" />
                  )}
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-800">
                  {uploadingImage
                    ? "Uploading to ImgBB..."
                    : "Click to upload cover image"}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  PNG, JPG or WebP (max 5MB)
                </p>
              </button>
            )}

            <div className="relative">
              <Link2 className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="image"
                type="url"
                placeholder="Or paste an ImgBB image URL directly (https://i.ibb.co/...)"
                value={form.image}
                onChange={(e) => set("image")(e.target.value)}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Link href="/dashboard/mentor/posts">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-xl border-slate-200 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto"
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading || uploadingImage}
            className="h-11 w-full rounded-xl bg-slate-900 px-7 text-sm font-semibold text-white transition-all hover:bg-blue-600 disabled:opacity-70 sm:w-auto"
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