"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { fetchMyProfileApi } from "@/lib/api/user-api";
import { createCheckoutSessionApi } from "@/lib/api/payment-api";

import Footer from "@/components/shared/Footer";
import {
  Check,
  Crown,
  Sparkles,
  Loader2,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import Navbar from "@/components/shared/Nav";

type PlanTab = "student" | "mentor";

export default function PricingPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [activeTab, setActiveTab] = useState<PlanTab>("student");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      if (!session?.user) {
        setUserRole(null);
        setIsPremium(false);
        return;
      }

      try {
        const profile = await fetchMyProfileApi();
        const role = profile?.role || "student";
        setUserRole(role);
        setIsPremium(Boolean(profile?.isPremium));

        if (role === "mentor" || role === "tutor") {
          setActiveTab("mentor");
        } else if (role === "student") {
          setActiveTab("student");
        }
      } catch {
        setUserRole(null);
      }
    };

    loadUser();
  }, [session]);

  const handleUpgrade = async (targetRole: PlanTab) => {
    if (!session?.user) {
      toast.error("Please sign in first to upgrade your plan.");
      router.push("/sign-in");
      return;
    }

    if (userRole === "admin") {
      toast.error("Admin accounts do not require a Pro subscription.");
      return;
    }

    const isUserMentor = userRole === "mentor" || userRole === "tutor";
    if (targetRole === "mentor" && !isUserMentor) {
      toast.error("This plan is only for Mentor accounts.");
      return;
    }
    if (targetRole === "student" && userRole !== "student") {
      toast.error("This plan is only for Student accounts.");
      return;
    }

    if (isPremium) {
      toast.success("You are already on the Pro Plan!");
      return;
    }

    setLoadingCheckout(true);
    try {
      const planName =
        targetRole === "mentor" ? "Mentor Pro Plan" : "Student Pro Plan";
      const price = targetRole === "mentor" ? 500 : 300;

      const { ok, data } = await createCheckoutSessionApi(planName, price, {
        successPath: "/payment/success",
        cancelPath: "/payment/cancel",
      });

      if (ok && data?.url) {
        window.location.href = data.url;
      } else {
        toast.error(data?.message || "Failed to start Stripe checkout.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoadingCheckout(false);
    }
  };

  const isMentorTab = activeTab === "mentor";
  const isCurrentRoleMatched =
    (isMentorTab && (userRole === "mentor" || userRole === "tutor")) ||
    (!isMentorTab && userRole === "student");

  const freeFeatures = isMentorTab
    ? [
        "Create up to 2 tuition listings",
        "Receive student applications",
        "Standard mentor profile page",
        "Manage applicants from dashboard",
      ]
    : [
        "Browse all verified tuition listings",
        "Apply to available tuitions",
        "Track application status in real time",
        "Standard student profile",
      ];

  const proFeatures = isMentorTab
    ? [
        "Unlimited tuition batch & 1-on-1 posts",
        "Verified Pro Mentor badge on all listings",
        "Priority ranking in Find Mentors directory",
        "Downloadable billing & payment receipts",
      ]
    : [
        "Priority booking & highlighted applications",
        "Verified Pro Student badge on profile",
        "Faster response visibility to top mentors",
        "Lifetime one-time upgrade with receipt",
      ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/70">
      <Navbar />

      <main className="flex-1 px-4 py-14 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
              <Sparkles className="size-3.5" /> Simple Pricing
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Upgrade Your MentorLagbe Experience
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
              Start for free and unlock Pro features anytime with a one-time
              Stripe payment. No hidden recurring fees.
            </p>

            <div className="mt-7 inline-flex rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab("student")}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                  !isMentorTab
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <BookOpen className="size-4" />
                For Students
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("mentor")}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                  isMentorTab
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <GraduationCap className="size-4" />
                For Mentors
              </button>
            </div>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-7 shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    {isMentorTab ? "Free Mentor" : "Free Student"}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-600">
                    Starter
                  </span>
                </div>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight text-slate-900">
                    ৳0
                  </span>
                  <span className="text-sm font-medium text-slate-400">
                    / forever
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {isMentorTab
                    ? "Ideal for new tutors testing the platform with up to 2 listings."
                    : "Everything you need to discover and apply for verified tuitions."}
                </p>

                <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                  {freeFeatures.map((feature) => (
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

              <div className="mt-8">
                <Link
                  href={session?.user ? "/dashboard" : "/sign-up"}
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
                >
                  {session?.user ? "Go to Dashboard" : "Get Started Free"}
                </Link>
              </div>
            </div>

            <div className="relative flex flex-col justify-between rounded-2xl border-2 border-slate-900 bg-white p-7 shadow-md">
              <span className="absolute -top-3.5 right-6 inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                <Crown className="size-3 text-amber-400" /> Most Popular
              </span>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    {isMentorTab ? "Pro Mentor" : "Pro Student"}
                  </span>
                  <span className="rounded-md bg-amber-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-700">
                    One-time
                  </span>
                </div>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight text-slate-900 tabular-nums">
                    {isMentorTab ? "৳500" : "৳300"}
                  </span>
                  <span className="text-sm font-medium text-slate-400">
                    / lifetime
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {isMentorTab
                    ? "Remove the 2-post limit and stand out with a verified Pro badge."
                    : "Get priority visibility when applying to competitive tuition batches."}
                </p>

                <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                  {proFeatures.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm font-medium text-slate-700"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-blue-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 space-y-2.5">
                {isPremium && isCurrentRoleMatched ? (
                  <div className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 text-sm font-bold text-emerald-700">
                    <ShieldCheck className="size-4" /> Active Pro Plan
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={loadingCheckout}
                    onClick={() => handleUpgrade(activeTab)}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loadingCheckout ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Redirecting to Stripe...
                      </>
                    ) : (
                      <>
                        Subscribe with Stripe
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </button>
                )}

                <p className="text-center text-[11px] font-medium text-slate-400">
                  Secured by Stripe Checkout • Instant account activation
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}