"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Nav";
import PricingCards from "@/components/pricing/PricingCards";
import { useSession } from "@/lib/auth-client";
import { fetchMyProfileApi } from "@/lib/api/user-api";
import { GraduationCap, ArrowRight, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "Is MentorLagbe free for students?",
    a: "Yes. Students can browse verified tuitions, explore mentors, and apply to posts completely free with no subscription required.",
  },
  {
    q: "What happens when I hit the 2-post limit as a free mentor?",
    a: "Your existing posts remain active. To publish more than 2 tuition posts, simply upgrade to the Pro Mentor plan from your dashboard.",
  },
  {
    q: "How fast is the Pro Mentor plan activated?",
    a: "Immediately. As soon as your Stripe payment completes, your account is automatically verified and unlocked for unlimited posting.",
  },
];

export default function PublicPricingPage() {
  const { data: session } = useSession();
  const userRole = (session?.user as { role?: string } | undefined)?.role || null;
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (userRole !== "mentor") return;
    fetchMyProfileApi()
      .then((profile) => setIsPremium(Boolean(profile?.isPremium)))
      .catch(() => {});
  }, [userRole]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Header */}
      <section className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Simple &amp; Transparent Pricing
          </p>
          <h1 className="mt-2.5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Start teaching for free, upgrade when you grow
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-[15px]">
            Students always use MentorLagbe 100% free. Mentors get 2 free tuition posts and can unlock unlimited listings anytime.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl space-y-12 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Shared Pricing Cards */}
        <PricingCards
          mode="public"
          userRole={userRole}
          isPremium={isPremium}
          proPrice="৳500"
          proBillingLabel="one-time"
        />

        {/* Student Free Banner */}
        <section className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-4 rounded-2xl border border-blue-200/80 bg-blue-50/60 p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Looking for a tutor as a Student?
              </h2>
              <p className="mt-0.5 text-sm text-slate-600">
                Browse verified mentors and apply to any tuition post completely free.
              </p>
            </div>
          </div>

          <Link
            href="/tuitions"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-600"
          >
            Browse Tuitions
            <ArrowRight className="size-3.5" />
          </Link>
        </section>

        {/* Compact FAQ */}
        <section className="mx-auto max-w-4xl">
          <div className="mb-5 flex items-center gap-2">
            <HelpCircle className="size-4 text-blue-600" />
            <h2 className="text-lg font-extrabold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {FAQS.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-slate-200/80 bg-white p-5"
              >
                <h3 className="text-sm font-bold text-slate-900">{item.q}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}