"use client";

import React, { useEffect, useMemo, useState } from "react";
import { fetchPaymentsApi } from "@/lib/api/payment-api";
import {
  Banknote,
  Receipt,
  TrendingUp,
  Users,
  Search,
  Download,
  CheckCircle2,
  Loader2,
  FileSpreadsheet,
  Copy,
  Check,
} from "lucide-react";

interface PaymentRecord {
  _id: string;
  userId: string;
  userEmail: string;
  planName: string;
  amount: number;
  currency?: string;
  stripeSessionId: string;
  status: string;
  createdAt: string;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(amount: number, currency?: string) {
  const curr = (currency || "bdt").toUpperCase();
  if (curr === "BDT") return `৳${Number(amount || 0).toLocaleString()}`;
  return `$${Number(amount || 0).toLocaleString()}`;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);
      try {
        const data = await fetchPaymentsApi();
        setPayments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch admin payments:", error);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  // Revenue & KPI Metrics
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let totalRevenue = 0;
    let monthlyRevenue = 0;
    const uniqueMentors = new Set<string>();

    payments.forEach((p) => {
      const amt = Number(p.amount || 0);
      totalRevenue += amt;

      if (p.userId || p.userEmail) {
        uniqueMentors.add(p.userId || p.userEmail);
      }

      if (p.createdAt) {
        const d = new Date(p.createdAt);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          monthlyRevenue += amt;
        }
      }
    });

    return {
      totalRevenue,
      monthlyRevenue,
      totalTransactions: payments.length,
      proMentorsCount: uniqueMentors.size,
    };
  }, [payments]);

  // Search Filter
  const filteredPayments = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return payments;

    return payments.filter((p) => {
      const receipt = `ml-${p._id.slice(-6).toLowerCase()}`;
      return (
        (p.userEmail || "").toLowerCase().includes(q) ||
        (p.planName || "").toLowerCase().includes(q) ||
        (p.stripeSessionId || "").toLowerCase().includes(q) ||
        receipt.includes(q)
      );
    });
  }, [payments, search]);

  const handleCopySession = async (id: string, sessionId: string) => {
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // Clipboard fallback ignored
    }
  };

  // Export Filtered Payments to CSV
  const handleExportCsv = () => {
    if (filteredPayments.length === 0) return;

    const headers = [
      "Receipt No",
      "Mentor Email",
      "Plan Name",
      "Amount",
      "Currency",
      "Status",
      "Stripe Session ID",
      "Date",
    ];

    const rows = filteredPayments.map((p) => [
      `ML-${p._id.slice(-6).toUpperCase()}`,
      p.userEmail || "",
      p.planName || "Mentor Pro Plan",
      String(p.amount || 0),
      (p.currency || "BDT").toUpperCase(),
      p.status || "paid",
      p.stripeSessionId || "",
      p.createdAt ? new Date(p.createdAt).toISOString() : "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mentorlagbe-payments-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            <Receipt className="size-3.5 text-blue-600" /> Financial Overview
          </span>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Payments &amp; Revenue
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track Pro Mentor upgrades, total platform earnings, and Stripe transactions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          disabled={filteredPayments.length === 0}
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
        >
          <Download className="size-3.5" />
          Export CSV
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Total Revenue
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Banknote className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 tabular-nums">
            ৳{stats.totalRevenue.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] font-medium text-slate-400">
            All-time verified earnings
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              This Month
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 tabular-nums">
            ৳{stats.monthlyRevenue.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] font-medium text-slate-400">
            Current month revenue
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Paid Transactions
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <Receipt className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 tabular-nums">
            {stats.totalTransactions}
          </p>
          <p className="mt-1 text-[11px] font-medium text-slate-400">
            Completed Stripe checkouts
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Pro Mentors
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Users className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 tabular-nums">
            {stats.proMentorsCount}
          </p>
          <p className="mt-1 text-[11px] font-medium text-slate-400">
            Unique upgraded accounts
          </p>
        </div>
      </div>

      {/* Transactions Table Card */}
      <section className="rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        {/* Toolbar */}
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Transaction History
            </h2>
            <p className="text-xs text-slate-500">
              Showing {filteredPayments.length} of {payments.length} records
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search email, receipt, session..."
              className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-3 text-xs font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-6 animate-spin text-blue-600" />
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <FileSpreadsheet className="size-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-800">
              {payments.length === 0
                ? "No payments recorded yet"
                : "No matching transactions"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {payments.length === 0
                ? "Once mentors upgrade to Pro, their Stripe payments will appear here."
                : "Try searching with a different email or receipt number."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3">Receipt</th>
                  <th className="px-4 py-3">Mentor</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Stripe Session</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((payment) => {
                  const receiptCode = `ML-${payment._id.slice(-6).toUpperCase()}`;
                  const isCopied = copiedId === payment._id;

                  return (
                    <tr
                      key={payment._id}
                      className="transition-colors hover:bg-slate-50/60"
                    >
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-700">
                        #{receiptCode}
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-900">
                          {payment.userEmail || "Unknown"}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-xs font-medium text-slate-600">
                        {payment.planName || "Mentor Pro Plan"}
                      </td>

                      <td className="px-4 py-4 text-xs font-medium text-slate-600 tabular-nums">
                        {formatDate(payment.createdAt)}
                      </td>

                      <td className="px-4 py-4 font-bold text-slate-900 tabular-nums">
                        {formatAmount(payment.amount, payment.currency)}
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="size-3.5" />
                          Paid
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            handleCopySession(
                              payment._id,
                              payment.stripeSessionId || ""
                            )
                          }
                          title="Copy Stripe Session ID"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-mono text-[11px] font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                        >
                          <span>
                            {(payment.stripeSessionId || "").slice(0, 14)}...
                          </span>
                          {isCopied ? (
                            <Check className="size-3 text-emerald-600" />
                          ) : (
                            <Copy className="size-3 text-slate-400" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}