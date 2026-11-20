"use client";

import React from "react";
import Link from "next/link";
import { XCircle, ArrowLeft, RotateCcw } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-slate-50/70 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-xs">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <XCircle className="size-8" />
        </div>

        <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900">
          Payment Canceled
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Your Stripe checkout was canceled and no charges were made. You can
          upgrade to Pro anytime from the pricing page.
        </p>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Link
            href="/pricing"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
          >
            <RotateCcw className="size-4" />
            Try Again
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <ArrowLeft className="size-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}