import { authFetch } from "./jwt-client";

const API_URL =
  typeof window !== "undefined"
    ? "/backend"
    : process.env.NEXT_PUBLIC_API_URL || "https://mentor-lageb-server.vercel.app";

export interface TuitionFilters {
  category?: string;
  isOnline?: string;
  mentorId?: string;
  mentorEmail?: string;
  status?: string;
  adminStatus?: string;
  search?: string;
  minBudget?: number;
  maxBudget?: number;
  page?: number;
  limit?: number;
}

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

export async function fetchTuitionById(id: string) {
  const res = await fetch(`${API_URL}/tuitions/${id}`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export async function createTuitionApi(postData: Record<string, unknown>) {
  const res = await authFetch(`${API_URL}/tuitions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

export async function updateTuitionApi(
  id: string,
  payload: Record<string, unknown>
) {
  const res = await authFetch(`${API_URL}/tuitions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

export async function updateTuitionAdminStatusApi(
  id: string,
  adminStatus: "approved" | "rejected" | "pending"
) {
  const res = await authFetch(`${API_URL}/admin/tuitions/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adminStatus }),
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

export async function deleteTuitionApi(id: string) {
  const res = await authFetch(`${API_URL}/tuitions/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  return { ok: res.ok, data };
}