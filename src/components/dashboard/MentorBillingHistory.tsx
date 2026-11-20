"use client";

import React, { useEffect, useState } from "react";
import { fetchPaymentsApi } from "@/lib/api/payment-api";
import {
  Receipt,
  Download,
  CheckCircle2,
  Loader2,
  FileText,
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

export default function MentorBillingHistory() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);
      try {
        const data = await fetchPaymentsApi();
        setPayments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load billing history:", error);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  // Generate & Download / Save as PDF Payment Slip
  const handleDownloadSlip = (payment: PaymentRecord) => {
    const invoiceNo = `ML-${payment._id.slice(-6).toUpperCase()}`;
    const formattedDate = formatDate(payment.createdAt);
    const formattedAmount = formatAmount(payment.amount, payment.currency);

    const slipHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Payment Slip - ${invoiceNo}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #f8fafc;
            color: #0f172a;
            padding: 40px 20px;
          }
          .slip {
            max-width: 620px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 36px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 22px;
            margin-bottom: 24px;
          }
          .brand { font-size: 22px; font-weight: 800; letter-spacing: -0.4px; }
          .brand span { color: #2563eb; }
          .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
          .badge {
            display: inline-block;
            background: #ecfdf5;
            color: #047857;
            border: 1px solid #a7f3d0;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 4px 10px;
            border-radius: 999px;
          }
          .meta {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 26px;
          }
          .meta-label { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600; letter-spacing: 0.4px; }
          .meta-value { font-size: 14px; font-weight: 600; margin-top: 4px; color: #0f172a; word-break: break-all; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
          }
          th {
            text-align: left;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            color: #64748b;
            border-bottom: 1px solid #e2e8f0;
            padding: 10px 0;
          }
          th.right, td.right { text-align: right; }
          td {
            padding: 14px 0;
            font-size: 14px;
            border-bottom: 1px solid #f1f5f9;
          }
          .total-row td {
            border-bottom: none;
            padding-top: 16px;
            font-size: 16px;
            font-weight: 800;
          }
          .footer {
            margin-top: 28px;
            padding-top: 18px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #64748b;
            display: flex;
            justify-content: space-between;
          }
          @media print {
            body { background: #ffffff; padding: 0; }
            .slip { border: none; padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="slip">
          <div class="header">
            <div>
              <div class="brand">Mentor<span>Lagbe</span></div>
              <div class="subtitle">Official Payment Receipt</div>
            </div>
            <span class="badge">Paid</span>
          </div>

          <div class="meta">
            <div>
              <div class="meta-label">Receipt Number</div>
              <div class="meta-value">${invoiceNo}</div>
            </div>
            <div>
              <div class="meta-label">Payment Date</div>
              <div class="meta-value">${formattedDate}</div>
            </div>
            <div>
              <div class="meta-label">Billed To</div>
              <div class="meta-value">${payment.userEmail || "Mentor Account"}</div>
            </div>
            <div>
              <div class="meta-label">Transaction ID</div>
              <div class="meta-value">${payment.stripeSessionId.slice(0, 24)}...</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th class="right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>${payment.planName || "Mentor Pro Plan"}</strong>
                  <div style="font-size:12px;color:#64748b;margin-top:3px;">
                    Unlimited tuition posts & verified Pro Mentor badge
                  </div>
                </td>
                <td class="right" style="font-weight:600;">${formattedAmount}</td>
              </tr>
              <tr class="total-row">
                <td>Total Paid</td>
                <td class="right">${formattedAmount}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            <span>Verified via Stripe Checkout</span>
            <span>mentorlagbe.com</span>
          </div>
        </div>
        <script>
          window.onload = function () {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank", "width=760,height=840");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(slipHtml);
      printWindow.document.close();
    }
  };

  return (
    <section className="mt-10 rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      {/* Header */}
      <div className="flex flex-col justify-between gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <Receipt className="size-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Billing &amp; Payment History
            </h2>
            <p className="text-xs text-slate-500">
              View your past upgrades and download official payment slips.
            </p>
          </div>
        </div>

        {!loading && payments.length > 0 && (
          <span className="self-start rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 tabular-nums sm:self-auto">
            {payments.length} {payments.length === 1 ? "Receipt" : "Receipts"}
          </span>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-blue-600" />
        </div>
      ) : payments.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <FileText className="size-5" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-800">
            No payments yet
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Your payment receipts and downloadable slips will appear here once you upgrade to Pro.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-3">Plan &amp; Receipt</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-6 py-3 text-right">Payment Slip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((payment) => {
                const receiptCode = `ML-${payment._id.slice(-6).toUpperCase()}`;

                return (
                  <tr
                    key={payment._id}
                    className="transition-colors hover:bg-slate-50/60"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">
                        {payment.planName || "Mentor Pro Plan"}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Receipt #{receiptCode}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-xs font-medium text-slate-600 tabular-nums">
                      {formatDate(payment.createdAt)}
                    </td>

                    <td className="px-4 py-4 font-semibold text-slate-900 tabular-nums">
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
                        onClick={() => handleDownloadSlip(payment)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                      >
                        <Download className="size-3.5 text-slate-500" />
                        Download Slip
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
  );
}