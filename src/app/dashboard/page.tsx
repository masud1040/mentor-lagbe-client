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
    console.error("Dashboard Redirect Error:", error);
  }

  // Jodi session na thake, sign-in e pathabe
  if (!session || !session.user) {
    redirect("/sign-in");
  }

  const role = session.user.role || "student";

  // Role onujayi specific dashboard URL-e redirect korbe
  if (role === "admin") {
    redirect("/dashboard/admin");
  } else if (role === "mentor") {
    redirect("/dashboard/mentor");
  } else {
    redirect("/dashboard/student");
  }
}