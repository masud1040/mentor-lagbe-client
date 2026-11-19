"use client";

import React from "react";
import Link from "next/link";
import {
  Check,
  Sparkles,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PricingCardsProps {
  mode?: "public" | "dashboard";
  userRole?: string | null;
  isPremium?: boolean;
  postsUsed?: number;
  maxFreePosts?: number;
  proPrice?: string;
  proBillingLabel?: string;
  upgrading?: boolean;
  onUpgrade?: () => void;
}

const FREE_FEATURES = [
  "Publish up to 2 tuition posts",
  "Public mentor profile listing",
  "Receive & manage student applications",
  "View applicant contact & academic details",
  "Standard admin verification",
];

const PRO_FEATURES = [
  "Unlimited tuition posts — no caps",
  "Verified Pro badge on profile & mentor card",
  "Top priority placement in Mentors directory",
  "Full applicant profile & academic insights",
  "Priority admin review & support",
];

export default function PricingCards({
  mode = "public",
  userRole = null,
  isPremium = false,
  postsUsed,
  maxFreePosts = 2,
  proPrice = "৳500",
  proBillingLabel = "one-time",
  upgrading = false,
  onUpgrade,
}: PricingCardsProps) {
  const showUsageBar =
    mode === "dashboard" && !isPremium && typeof postsUsed === "number";
  const usagePercent = showUsageBar
    ? Math.min(100, Math.round((postsUsed / maxFreePosts) * 100))
    : 0;

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
      {/* 1. FREE STARTER PLAN */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              Starter
            </span>
            {mode === "dashboard" && !isPremium && (
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                Current Plan
              </span>
            )}
          </div>

          <h3 className="mt-4 text-xl font-extrabold text-slate-900">
            Free Mentor
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
            Best for getting started and finding your first tuition students.
          </p>

          <div className="mt-5 flex items-baseline gap-1.5 border-b border-slate-100 pb-5">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900 tabular-nums">
              ৳0
            </span>
            <span className="text-sm font-medium text-slate-400">/ forever</span>
          </div>

          {/* Optional live usage meter in Mentor Dashboard */}
          {showUsageBar && (
            <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600">Free Post Limit</span>
                <span
                  className={
                    postsUsed >= maxFreePosts
                      ? "text-rose-600"
                      : "text-slate-900"
                  }
                >
                  {postsUsed} / {maxFreePosts} used
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full transition-all ${
                    postsUsed >= maxFreePosts ? "bg-rose-500" : "bg-blue-600"
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
          )}

          <ul className="mt-5 space-y-3">
            {FREE_FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2.5 text-sm text-slate-600"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-slate-400" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Free Card CTA */}
        <div className="mt-7 pt-2">
          {mode === "dashboard" ? (
            <Button
              type="button"
              disabled
              variant="outline"
              className="h-11 w-full rounded-xl border-slate-200 bg-slate-50 font-semibold text-slate-500"
            >
              {isPremium ? "Included in Pro" : "Active Free Plan"}
            </Button>
          ) : !userRole ? (
            <Link href="/sign-up" className="block">
              <Button
                variant="outline"
                className="h-11 w-full rounded-xl border-slate-200 font-semibold text-slate-800 hover:bg-slate-50"
              >
                Start for Free
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </Link>
          ) : userRole === "mentor" ? (
            <Link href="/dashboard/mentor" className="block">
              <Button
                variant="outline"
                className="h-11 w-full rounded-xl border-slate-200 font-semibold text-slate-800 hover:bg-slate-50"
              >
                Go to Mentor Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/tuitions" className="block">
              <Button
                variant="outline"
                className="h-11 w-full rounded-xl border-slate-200 font-semibold text-slate-800 hover:bg-slate-50"
              >
                Browse Tuitions Free
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* 2. PRO MENTOR PLAN */}
      <div className="relative flex flex-col justify-between rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-[0_14px_35px_-16px_rgba(15,23,42,0.18)] sm:p-7">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
              <Sparkles className="size-3 text-amber-400" /> Most Popular
            </span>
            {isPremium && (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                <ShieldCheck className="size-3.5" /> Pro Active
              </span>
            )}
          </div>

          <h3 className="mt-4 text-xl font-extrabold text-slate-900">
            Pro Mentor
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
            Built for active tutors who want unlimited reach and higher visibility.
          </p>

          <div className="mt-5 flex items-baseline gap-1.5 border-b border-slate-100 pb-5">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900 tabular-nums">
              {proPrice}
            </span>
            <span className="text-sm font-medium text-slate-400">
              / {proBillingLabel}
            </span>
          </div>

          <ul className="mt-5 space-y-3">
            {PRO_FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2.5 text-sm font-medium text-slate-700"
              >
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Check className="size-3 stroke-[2.75]" />
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pro Card CTA */}
        <div className="mt-7 pt-2">
          {mode === "dashboard" ? (
            isPremium ? (
              <Button
                type="button"
                disabled
                className="h-11 w-full rounded-xl bg-emerald-600 font-semibold text-white opacity-95"
              >
                <ShieldCheck className="mr-1.5 size-4" />
                You are on Pro Plan
              </Button>
            ) : (
              <Button
                type="button"
                onClick={onUpgrade}
                disabled={upgrading}
                className="h-11 w-full rounded-xl bg-blue-600 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                {upgrading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Redirecting to Stripe...
                  </>
                ) : (
                  <>
                    <Zap className="mr-1.5 size-4" />
                    Upgrade to Pro
                  </>
                )}
              </Button>
            )
          ) : !userRole ? (
            <Link href="/sign-up" className="block">
              <Button className="h-11 w-full rounded-xl bg-slate-900 font-semibold text-white transition-colors hover:bg-blue-600">
                Get Started as Mentor
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </Link>
          ) : userRole === "mentor" ? (
            <Link href="/dashboard/mentor/pricing" className="block">
              <Button className="h-11 w-full rounded-xl bg-blue-600 font-semibold text-white transition-colors hover:bg-blue-700">
                {isPremium ? "Manage Pro Plan" : "Upgrade in Dashboard"}
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </Link>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-center text-xs font-semibold text-slate-600">
              Mentors only — Students use MentorLagbe 100% free
            </div>
          )}
        </div>
      </div>
    </div>
  );
}