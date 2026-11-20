"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyPaymentSessionApi } from "@/lib/api/payment-api";
import {
  CheckCircle2,
  Loader2,
  XCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type VerifyStatus = "verifying" | "success" | "error";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<VerifyStatus>("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(4);

  const verifiedRef = useRef(false);

  // 1. Verify payment session with backend
  useEffect(() => {
    if (verifiedRef.current) return;
    verifiedRef.current = true;

    if (!sessionId) {
      setStatus("error");
      setErrorMessage("Invalid payment session. No session ID was found.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const { ok, data } = await verifyPaymentSessionApi(sessionId);
        if (ok && data?.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage(
            data?.message || "Payment could not be verified. Please contact support."
          );
        }
      } catch {
        setStatus("error");
        setErrorMessage("Network error while verifying your payment.");
      }
    };

    verifyPayment();
  }, [sessionId]);

  // 2. Countdown & auto-redirect to Mentor Dashboard once verified
  useEffect(() => {
    if (status !== "success") return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard/mentor");
          router.refresh();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, status]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center px-4">
      <div className="w-full rounded-2xl border border-slate-200/80 bg-white p-7 text-center shadow-xs sm:p-9">
        {status === "verifying" && (
          <div className="py-6">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Loader2 className="size-7 animate-spin" />
            </div>
            <h1 className="mt-5 text-xl font-extrabold text-slate-900">
              Confirming your payment...
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Please wait while Stripe verifies your transaction and unlocks your Pro Mentor plan.
            </p>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="size-9" />
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
              <Sparkles className="size-3.5" /> Pro Mentor Unlocked
            </div>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
              Payment Successful!
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Thank you for upgrading. You now have unlimited tuition posts and a verified Pro badge on your profile.
            </p>

            <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-xs font-medium text-slate-600">
              Redirecting to your Mentor Dashboard in{" "}
              <span className="font-bold text-slate-900 tabular-nums">
                {secondsLeft}s
              </span>
              ...
            </div>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <Button
                type="button"
                onClick={() => {
                  router.push("/dashboard/mentor");
                  router.refresh();
                }}
                className="h-11 flex-1 rounded-xl bg-slate-900 text-sm font-semibold text-white hover:bg-blue-600"
              >
                Go to Dashboard Now
                <ArrowRight className="ml-1.5 size-4" />
              </Button>

              <Link href="/dashboard/mentor/posts/create" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full rounded-xl border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Create Tuition Post
                </Button>
              </Link>
            </div>

            <p className="mt-5 flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-400">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              Transaction verified by Stripe
            </p>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <XCircle className="size-9" />
            </div>

            <h1 className="mt-4 text-xl font-extrabold text-slate-900">
              Verification Failed
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              {errorMessage}
            </p>

            <div className="mt-6">
              <Link href="/dashboard/mentor/pricing">
                <Button className="h-11 w-full rounded-xl bg-slate-900 text-sm font-semibold text-white hover:bg-blue-600">
                  Back to Pricing &amp; Plan
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MentorPaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center">
          <Loader2 className="size-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}