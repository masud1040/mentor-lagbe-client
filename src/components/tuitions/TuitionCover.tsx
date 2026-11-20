"use client";

import React, { useState } from "react";
import { BookOpen, Monitor, GraduationCap, Layers } from "lucide-react";

interface TuitionCoverProps {
  image?: string | null;
  category?: string;
  subject?: string;
  isOnline?: boolean;
  className?: string;
}

const CATEGORY_STYLES: Record<
  string,
  { bg: string; accent: string; label: string }
> = {
  primary: {
    bg: "bg-amber-50/90",
    accent: "text-amber-700 border-amber-200/70 bg-white/80",
    label: "Primary",
  },
  jsc: {
    bg: "bg-emerald-50/90",
    accent: "text-emerald-700 border-emerald-200/70 bg-white/80",
    label: "JSC",
  },
  ssc: {
    bg: "bg-blue-50/90",
    accent: "text-blue-700 border-blue-200/70 bg-white/80",
    label: "SSC",
  },
  hsc: {
    bg: "bg-indigo-50/90",
    accent: "text-indigo-700 border-indigo-200/70 bg-white/80",
    label: "HSC",
  },
  admission: {
    bg: "bg-slate-100",
    accent: "text-slate-800 border-slate-200 bg-white/90",
    label: "Admission",
  },
};

export default function TuitionCover({
  image,
  category = "hsc",
  subject = "Tuition",
  isOnline = false,
  className = "",
}: TuitionCoverProps) {
  const [imgError, setImgError] = useState(false);
  const key = category.toLowerCase();
  const theme = CATEGORY_STYLES[key] || {
    bg: "bg-slate-100",
    accent: "text-slate-700 border-slate-200 bg-white/80",
    label: category.toUpperCase(),
  };

  const hasValidImage = Boolean(image && image.trim().length > 0 && !imgError);

  return (
    <div
      className={`relative aspect-[16/10] w-full overflow-hidden border-b border-slate-100 ${className}`}
    >
      {hasValidImage ? (
        <img
          src={image!.trim()}
          alt={subject}
          onError={() => setImgError(true)}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      ) : (
        <div
          className={`relative flex size-full flex-col justify-between p-4 ${theme.bg}`}
          style={{
            backgroundImage:
              "radial-gradient(rgba(15, 23, 42, 0.06) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${theme.accent}`}
            >
              <Layers className="size-3" />
              {theme.label}
            </span>

            {isOnline && (
              <span className="inline-flex items-center gap-1 rounded-md border border-slate-200/80 bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                <Monitor className="size-3 text-blue-600" />
                Online
              </span>
            )}
          </div>

          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Subject Focus
              </p>
              <p className="truncate text-base font-extrabold tracking-tight text-slate-800">
                {subject}
              </p>
            </div>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/80 bg-white/70 text-slate-600 shadow-2xs">
              {key === "admission" ? (
                <GraduationCap className="size-4" />
              ) : (
                <BookOpen className="size-4" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}