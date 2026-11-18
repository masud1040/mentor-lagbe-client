"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

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
}

const inputClass =
  "h-12 rounded-xl border-slate-200 bg-slate-50/50 px-4 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-blue-500/10 focus-visible:border-blue-500 transition-all";
const cardClass =
  "rounded-[2rem] border border-slate-100 bg-white p-6 sm:p-10 shadow-sm";

export default function CreateTuitionPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
      // Direct client-side fetch with credentials included so BetterAuth cookie passes correctly
      const response = await fetch("http://localhost:5000/tuitions", {
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
          toast.error(result.message || "You have reached your free limit of 2 posts.");
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

  return (
    <div className="mx-auto max-w-[800px] space-y-8">
      {/* Header */}
      <div className="mb-10">
        <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-600">
          <Sparkles size={14} /> New Listing
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Post a Tuition Request
        </h1>
        <p className="mt-3 text-[15px] font-medium text-slate-500">
          Fill in the details below to attract the best students across our network.
        </p>
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
          <h2 className="mb-6 text-xl font-bold text-slate-900">
            Location & Compensation
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
          <h2 className="mb-6 text-xl font-bold text-slate-900">
            Details & Requirements
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

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            disabled={loading}
            className="h-14 w-full min-w-[200px] rounded-2xl bg-blue-600 px-8 text-[15px] font-bold text-white shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 disabled:opacity-70 sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" /> Publishing...
              </>
            ) : (
              <>
                <GraduationCap className="mr-2 size-5" /> Publish Tuition Post
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}