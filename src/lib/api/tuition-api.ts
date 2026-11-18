const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface TuitionFilters {
  category?: string;
  isOnline?: string;
  mentorId?: string;
  status?: string;
  adminStatus?: string;
  search?: string;
  limit?: number;
}

// ১. সব টিউশন গেট করা (ফিল্টার, সার্চ ও লিমিট সহ)
export async function fetchTuitions(filters: TuitionFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== "all") {
      params.append(key, String(value));
    }
  });

  const queryString = params.toString();
  const url = `${API_URL}/tuitions${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch tuitions");
  return res.json();
}

// ২. সিঙ্গেল টিউশন ডিটেইলস গেট করা
export async function fetchTuitionById(id: string) {
  const res = await fetch(`${API_URL}/tuitions/${id}`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

// ৩. নতুন টিউশন পোস্ট তৈরি করা (Mentor)
export async function createTuitionApi(postData: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/tuitions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(postData),
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

// ৪. টিউশন আপডেট বা ক্লোজ করা (Mentor)
export async function updateTuitionApi(
  id: string,
  payload: Record<string, unknown>
) {
  const res = await fetch(`${API_URL}/tuitions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

// ৫. এডমিন Approve / Reject / Re-Approve করা
export async function updateTuitionAdminStatusApi(
  id: string,
  adminStatus: "approved" | "rejected" | "pending"
) {
  const res = await fetch(`${API_URL}/admin/tuitions/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ adminStatus }),
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

// ৬. টিউশন ডিলিট করা (Mentor/Admin)
export async function deleteTuitionApi(id: string) {
  const res = await fetch(`${API_URL}/tuitions/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await res.json();
  return { ok: res.ok, data };
}