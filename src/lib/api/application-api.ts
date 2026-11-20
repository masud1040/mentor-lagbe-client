import { authFetch } from "./jwt-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface ApplicationPayload {
  tuitionId: string;
  phone: string;
  message: string;
}

export interface ApplicationFilters {
  applicantId?: string;
  tuitionId?: string;
}

export async function applyForTuitionApi(payload: ApplicationPayload) {
  const res = await authFetch(`${API_URL}/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

export async function fetchApplicationsApi(filters: ApplicationFilters = {}) {
  const params = new URLSearchParams();
  if (filters.applicantId) params.append("applicantId", filters.applicantId);
  if (filters.tuitionId) params.append("tuitionId", filters.tuitionId);

  const queryString = params.toString();
  const url = `${API_URL}/applications${queryString ? `?${queryString}` : ""}`;

  const res = await authFetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch applications");
  return res.json();
}

export async function updateApplicationStatusApi(
  id: string,
  status: "accepted" | "rejected"
) {
  const res = await authFetch(`${API_URL}/applications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

export async function cancelApplicationApi(id: string) {
  const res = await authFetch(`${API_URL}/applications/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  return { ok: res.ok, data };
}