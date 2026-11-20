"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyPaymentSessionApi } from "@/lib/api/payment-api";
import { fetchMyProfileApi } from "@/lib/api/user-api";
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowRight,
  Crown,
} from "lucide-react";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [message, setMessage] = useState("Verifying your Stripe payment...");
  const [dashboardPath, setDashboardPath] = useState("/dashboard");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const verify = async () => {
      if (!sessionId) {
        setStatus("error");
        setMessage("Invalid payment session. No session ID found.");
        return;
      }

      try {
        const { ok, data } = await verifyPaymentSessionApi(sessionId);
        if (ok && data?.success) {
          setStatus("success");
          setMessage(data.message || "Your account has been upgraded to Pro!");

          try {
            const profile = await fetchMyProfileApi();
            if (profile?.role === "mentor" || profile?.role === "tutor") {
              setDashboardPath("/dashboard/mentor");
            } else if (profile?.role === "student") {
              setDashboardPath("/dashboard/student");
            }
          } catch {
            setDashboardPath("/dashboard");
          }
        } else {
          setStatus("error");
          setMessage(data?.message || "Payment verification failed.");
        }
      } catch {
        setStatus("error");
        setMessage("Network error while verifying payment.");
      }
    };

    verify();
  }, [sessionId]);

  useEffect(() => {
    if (status !== "success") return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(dashboardPath);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, dashboardPath, router]);

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-slate-50/70 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-xs">
        {status === "verifying" && (
          <>
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Loader2 className="size-7 animate-spin" />
            </div>
            <h1 className="mt-5 text-xl font-extrabold text-slate-900">
              Confirming Payment
            </h1>
            <p className="mt-2 text-sm text-slate-500">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="size-8" />
            </div>
            <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
              <Crown className="size-3.5" /> Pro Plan Activated
            </span>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
              Payment Successful!
            </h1>
            <p className="mt-2 text-sm text-slate-500">{message}</p>

            <p className="mt-4 text-xs font-medium text-slate-400">
              Redirecting to your dashboard in{" "}
              <span className="font-bold text-slate-700">{countdown}s</span>...
            </p>

            <Link
              href={dashboardPath}
              className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
            >
              Go to Dashboard Now
              <ArrowRight className="size-4" />
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <AlertCircle className="size-8" />
            </div>
            <h1 className="mt-5 text-xl font-extrabold text-slate-900">
              Verification Issue
            </h1>
            <p className="mt-2 text-sm text-slate-500">{message}</p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
              <Link
                href="/pricing"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-blue-600"
              >
                Back to Pricing
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Dashboard
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[75vh] items-center justify-center">
          <Loader2 className="size-7 animate-spin text-blue-600" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}