import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50/70 px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-xs sm:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <SearchX className="size-7" />
        </div>

        <span className="mt-5 inline-block rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600">
          Error 404
        </span>

        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Page Not Found
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-slate-500">
          The page you are looking for doesn&apos;t exist or may have been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
          <Link
            href="/tuitions"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Compass className="size-4" />
            Browse Tuitions
          </Link>
        </div>
      </div>
    </main>
  );
}