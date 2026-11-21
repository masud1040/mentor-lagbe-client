"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { fetchTuitionById, updateTuitionApi } from "@/lib/api/tuition-api";

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
  ArrowLeft,
  Save,
  AlertCircle,
  Edit3,
} from "lucide-react";

interface TuitionFormData {
  title: string;
  subject: string;
  category: string;
  isOnline: boolean;
  location: string;
  budget: string;
  frequency: string;
  status: string;
  description: string;
}

const inputClass =
  "h-12 rounded-xl border-slate-200 bg-slate-50/50 px-4 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-blue-500/10 focus-visible:border-blue-500 transition-all";
const cardClass =
  "rounded-[2rem] border border-slate-100 bg-white p-6 sm:p-10 shadow-sm";

export default function EditTuitionPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [fetching, setFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<TuitionFormData>({
    title: "",
    subject: "",
    category: "",
    isOnline: false,
    location: "",
    budget: "",
    frequency: "monthly",
    status: "active",
    description: "",
  });

  useEffect(() => {
    if (!id) return;

    const loadPost = async () => {
      setFetching(true);
      try {
        const data = await fetchTuitionById(id);
        if (!data || !data._id) {
          setNotFound(true);
          return;
        }

        setForm({
          title: data.title || "",
          subject: data.subject || "",
          category: data.category || "",
          isOnline: Boolean(data.isOnline),
          location: data.isOnline ? "" : data.location || "",
          budget: data.budget !== undefined ? String(data.budget) : "",
          frequency: data.frequency || "monthly",
          status: data.status || "active",
          description: data.description || "",
        });
      } catch (error) {
        console.error("Failed to load tuition post:", error);
        setNotFound(true);
      } finally {
        setFetching(false);
      }
    };

    loadPost();
  }, [id]);

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

    setSaving(true);

    const payload = {
      title: form.title.trim(),
      subject: form.subject.trim(),
      category: form.category,
      isOnline: form.isOnline,
      location: form.isOnline ? "Online" : form.location.trim(),
      budget: Number(form.budget),
      frequency: form.frequency,
      status: form.status,
      description: form.description.trim(),
    };

    try {
      const { ok, data } = await updateTuitionApi(id, payload);

      if (ok && data.success !== false) {
        toast.success("Tuition post updated successfully!");
        router.push("/dashboard/mentor/posts");
        router.refresh();
      } else {
        toast.error(data.message || "Failed to update post.");
      }
    } catch (error) {
      console.error("Update Tuition Error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <div className="mx-auto flex max-w-[800px] items-center justify-center rounded-[2rem] border border-slate-100 bg-white py-28 shadow-xs">
        <Loader2 className="size-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto flex max-w-[800px] flex-col items-center justify-center rounded-[2rem] border border-slate-100 bg-white py-24 text-center shadow-xs">
        <AlertCircle className="mb-3 size-12 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-900">
          Tuition post not found
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          This post may have been deleted or you don&apos;t have access to it.
        </p>
        <Link href="/dashboard/mentor/posts" className="mt-5">
          <Button className="rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700">
            Back to My Posts
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[800px] space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/mentor/posts"
          className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-blue-600"
        >
          <ArrowLeft size={16} /> Back to My Posts
        </Link>

        <div>
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-600">
            <Edit3 size={14} /> Edit Listing
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Update Tuition Post
          </h1>
          <p className="mt-2 text-[15px] font-medium text-slate-500">
            Modify your tuition details below and save changes.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* 1. Basic Information */}
        <section className={cardClass}>
          <h2 className="mb-6 text-xl font-bold text-slate-900">
            Basic Information
          </h2>
          <div className="flex flex-col gap-6">
            <div className="space-y-2.5">
              <Label
                htmlFor="title"
                className="text-[14px] font-semibold text-slate-800"
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

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2.5">
                <Label
                  htmlFor="subject"
                  className="text-[14px] font-semibold text-slate-800"
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

              <div className="space-y-2.5">
                <Label
                  htmlFor="category"
                  className="text-[14px] font-semibold text-slate-800"
                >
                  Category
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(val) => set("category")(val ?? "")}
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

            {/* Post Status */}
            <div className="space-y-2.5">
              <Label
                htmlFor="status"
                className="text-[14px] font-semibold text-slate-800"
              >
                Post Status
              </Label>
              <Select
                value={form.status}
                onValueChange={(val) => set("status")(val ?? "active")}
              >
                <SelectTrigger id="status" className={`${inputClass} w-full sm:w-64`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active (Accepting Applications)</SelectItem>
                  <SelectItem value="closed">Closed (Not Accepting)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* 2. Location & Compensation */}
        <section className={cardClass}>
          <h2 className="mb-6 text-xl font-bold text-slate-900">
            Location &amp; Compensation
          </h2>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
              <div className="flex flex-col gap-1">
                <Label
                  htmlFor="isOnline"
                  className="text-[15px] font-bold text-slate-800"
                >
                  Online Tuition
                </Label>
                <p className="text-[13px] font-medium text-slate-500">
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
              <div className="space-y-2.5">
                <Label
                  htmlFor="location"
                  className="text-[14px] font-semibold text-slate-800"
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

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2.5">
                <Label
                  htmlFor="budget"
                  className="text-[14px] font-semibold text-slate-800"
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

              <div className="space-y-2.5">
                <Label
                  htmlFor="frequency"
                  className="text-[14px] font-semibold text-slate-800"
                >
                  Frequency
                </Label>
                <Select
                  value={form.frequency}
                  onValueChange={(val) => set("frequency")(val ?? "monthly")}
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
          <h2 className="mb-6 text-xl font-bold text-slate-900">
            Details &amp; Requirements
          </h2>
          <div className="space-y-2.5">
            <Label
              htmlFor="description"
              className="text-[14px] font-semibold text-slate-800"
            >
              Tuition Description
            </Label>
            <Textarea
              id="description"
              required
              rows={6}
              maxLength={2000}
              placeholder="Describe the student's current situation, specific requirements, schedule preferences, etc."
              value={form.description}
              onChange={(e) => set("description")(e.target.value)}
              className="resize-none rounded-2xl border-slate-200 bg-slate-50/50 p-4 transition-all focus-visible:border-blue-500 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-blue-500/10"
            />
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            disabled={saving}
            className="h-14 w-full min-w-[200px] rounded-2xl bg-blue-600 px-8 text-[15px] font-bold text-white shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 disabled:opacity-70 sm:w-auto"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" /> Saving Changes...
              </>
            ) : (
              <>
                <Save className="mr-2 size-5" /> Save Changes
              </>
            )}
          </Button>

          <Link href="/dashboard/mentor/posts" className="w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              className="h-14 w-full rounded-2xl border-slate-200 px-8 text-[15px] font-bold text-slate-700 hover:bg-slate-50 sm:w-auto"
            >
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}