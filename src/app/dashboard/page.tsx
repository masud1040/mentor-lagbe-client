"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function DashboardMainPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/sign-in?from=dashboard-home");
      return;
    }

    const role = (session.user as { role?: string })?.role || "student";

    if (role === "admin") {
      router.replace("/dashboard/admin");
    } else if (role === "mentor") {
      router.replace("/dashboard/mentor");
    } else {
      router.replace("/dashboard/student");
    }
  }, [session, isPending, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}