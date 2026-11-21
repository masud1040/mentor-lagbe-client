import React from "react";
import { GraduationCap } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[75vh] w-full flex-col items-center justify-center bg-slate-50/50 px-4">
      <div className="relative flex items-center justify-center">
        <div className="size-16 animate-spin rounded-full border-[3px] border-slate-200 border-t-blue-600" />
        <div className="absolute flex size-10 items-center justify-center rounded-full bg-white shadow-xs">
          <GraduationCap className="size-5 text-slate-900" />
        </div>
      </div>

      <p className="mt-5 text-sm font-bold tracking-tight text-slate-900">
        Mentor<span className="text-blue-600">Lagbe</span>
      </p>
      <p className="mt-1 text-xs font-medium text-slate-400">
        Loading your workspace...
      </p>
    </div>
  );
}