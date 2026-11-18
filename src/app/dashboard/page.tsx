import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardMainPage() {
  let session = null;

  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Dashboard Session Error:", error);
  }

  // সেশন না থাকলে রিডাইরেক্ট করার আগে একটু চেক করা ভালো
  if (!session || !session.user) {
    redirect("/sign-in");
  }

  const role = (session.user as { role?: string })?.role || "student";

  // সরাসরি নির্দিষ্ট রোলের ড্যাশবোর্ড পেজে পাঠিয়ে দেওয়া
  if (role === "admin") {
    redirect("/dashboard/admin");
  } else if (role === "mentor") {
    redirect("/dashboard/mentor");
  } else {
    redirect("/dashboard/student");
  }
}