import React from "react";
import { FileText, Users, CreditCard, Sparkles, CheckCircle2 } from "lucide-react";

export default function MentorDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-[2rem] bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-xl shadow-blue-600/10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Mentor Dashboard</h1>
            <p className="mt-2 text-[15px] font-medium text-blue-100">
              Manage your tuition posts, connect with students, and grow your career.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 backdrop-blur-md border border-white/20">
            <Sparkles className="size-5 text-yellow-300" />
            <span className="text-[14px] font-bold">Free Plan (2/2 Posts)</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-semibold text-slate-500">Total Posts</span>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FileText size={22} />
            </div>
          </div>
          <h3 className="mt-4 text-3xl font-extrabold text-slate-900">2</h3>
          <p className="mt-1 text-[13px] font-medium text-slate-400">Max limit for free tier</p>
        </div>

        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-semibold text-slate-500">Student Requests</span>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Users size={22} />
            </div>
          </div>
          <h3 className="mt-4 text-3xl font-extrabold text-slate-900">0</h3>
          <p className="mt-1 text-[13px] font-medium text-slate-400">Pending connections</p>
        </div>

        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-semibold text-slate-500">Subscription Status</span>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <CreditCard size={22} />
            </div>
          </div>
          <h3 className="mt-4 text-2xl font-extrabold text-slate-900">Standard</h3>
          <p className="mt-1 text-[13px] font-medium text-slate-400">Upgrade for unlimited posts</p>
        </div>

      </div>
    </div>
  );
}