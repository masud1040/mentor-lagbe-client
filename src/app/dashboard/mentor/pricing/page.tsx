"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { fetchMyProfileApi } from "@/lib/api/user-api";
import { fetchTuitions } from "@/lib/api/tuition-api";
import {
  createCheckoutSessionApi,
  verifyPaymentSessionApi,
} from "@/lib/api/payment-api";
import PricingCards from "@/components/pricing/PricingCards";
import {
  CreditCard,
  Loader2,
  ShieldCheck,
  Sparkles,
  Lock,
  CheckCircle2,
} from "lucide-react";

function MentorPricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: sessionLoading } = useSession();

  const [isPremium, setIsPremium] = useState(false);
  const [postsUsed, setPostsUsed] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const verifiedRef = useRef(false);

  const sessionId = searchParams.get("session_id");
  const isSuccess = searchParams.get("success") === "true";
  const isCanceled = searchParams.get("canceled") === "true";

  // 1. Load live mentor profile & current post count
  const loadBillingData = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const [profile, myPosts] = await Promise.all([
        fetchMyProfileApi(),
        fetchTuitions({
          mentorId: session.user.id,
          mentorEmail: session.user.email || undefined,
        }),
      ]);

      setIsPremium(Boolean(profile?.isPremium));
      setPostsUsed(Array.isArray(myPosts) ? myPosts.length : 0);
    } catch (error) {
      console.error("Failed to load billing info:", error);
      toast.error("Failed to load subscription details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionLoading && session?.user?.id) {
      loadBillingData();
    }
  }, [session?.user?.id, session?.user?.email, sessionLoading]);

  // 2. Handle Stripe return (verify session_id or show canceled toast)
  useEffect(() => {
    if (verifiedRef.current) return;

    if (isCanceled) {
      verifiedRef.current = true;
      toast("Payment canceled. You can upgrade anytime.");
      router.replace("/dashboard/mentor/pricing", { scroll: false });
      return;
    }

    if ((isSuccess || sessionId) && sessionId) {
      verifiedRef.current = true;

      const verify = async () => {
        setVerifying(true);
        try {
          const { ok, data } = await verifyPaymentSessionApi(sessionId);
          if (ok && data.success) {
            setIsPremium(true);
            toast.success("Payment verified! Welcome to Pro Mentor.");
          } else {
            toast.error(
              data.message || "Could not verify payment. Please contact support."
            );
          }
        } catch {
          toast.error("Verification failed due to a network error.");
        } finally {
          setVerifying(false);
          router.replace("/dashboard/mentor/pricing", { scroll: false });
        }
      };

      verify();
    }
  }, [isCanceled, isSuccess, router, sessionId]);

  // 3. Initiate Stripe Checkout
  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const { ok, data } = await createCheckoutSessionApi();
      if (ok && data?.url) {
        window.location.href = data.url;
      } else {
        toast.error(data?.message || "Failed to start Stripe checkout.");
        setUpgrading(false);
      }
    } catch {
      toast.error("Network error while starting checkout.");
      setUpgrading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header Card */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 sm:flex-row sm:items-center sm:p-7">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
            <CreditCard className="size-3.5" /> Billing &amp; Plan
          </span>
          <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Mentor Subscription
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Upgrade to Pro to remove the 2-post limit and boost your mentor profile.
          </p>
        </div>

        {/* Live Status Pill */}
        {!loading && !verifying && (
          <div
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold ${
              isPremium
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-slate-50 text-slate-700"
            }`}
          >
            {isPremium ? (
              <>
                <Sparkles className="size-4 text-emerald-600" />
                Pro Mentor Active
              </>
            ) : (
              <>
                <ShieldCheck className="size-4 text-slate-400" />
                Free Plan ({postsUsed}/2 posts used)
              </>
            )}
          </div>
        )}
      </div>

      {/* Payment Verification Loading State */}
      {verifying ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-blue-200/80 bg-white py-20 text-center">
          <Loader2 className="size-8 animate-spin text-blue-600" />
          <h2 className="mt-4 text-base font-bold text-slate-900">
            Verifying your Stripe payment...
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Please wait a moment while we activate your Pro Mentor plan.
          </p>
        </div>
      ) : loading || sessionLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="h-[430px] animate-pulse rounded-2xl border border-slate-200/80 bg-white p-7" />
          <div className="h-[430px] animate-pulse rounded-2xl border border-slate-200/80 bg-white p-7" />
        </div>
      ) : (
        <>
          {/* Active Pro Confirmation Strip */}
          {isPremium && (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-800">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
              <div>
                <p className="font-bold">You have full Pro Mentor access</p>
                <p className="mt-0.5 text-xs text-emerald-700">
                  You can publish unlimited tuition posts and your profile displays the verified Pro badge across the Mentors directory.
                </p>
              </div>
            </div>
          )}

          {/* Reusable Pricing Cards */}
          <PricingCards
            mode="dashboard"
            userRole="mentor"
            isPremium={isPremium}
            postsUsed={postsUsed}
            maxFreePosts={2}
            proPrice="৳500"
            proBillingLabel="one-time"
            upgrading={upgrading}
            onUpgrade={handleUpgrade}
          />

          {/* Compact Security Note */}
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-2xl border border-slate-200/70 bg-white px-5 py-4 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="size-3.5 text-slate-400" />
              Secured by Stripe Checkout
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              Instant Pro activation after payment
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-blue-500" />
              No recurring hidden charges
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default function MentorPricingPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex max-w-5xl items-center justify-center rounded-2xl border border-slate-200/80 bg-white py-24">
          <Loader2 className="size-7 animate-spin text-blue-600" />
        </div>
      }
    >
      <MentorPricingContent />
    </Suspense>
  );
}