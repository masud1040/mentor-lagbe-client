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

// ১. Student: Tuition-e apply kora
export async function applyForTuitionApi(payload: ApplicationPayload) {
  const res = await fetch(`${API_URL}/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

// ২. Applications list get kora (Mentor: tuitionId diye, Student: applicantId diye)
export async function fetchApplicationsApi(filters: ApplicationFilters = {}) {
  const params = new URLSearchParams();
  if (filters.applicantId) params.append("applicantId", filters.applicantId);
  if (filters.tuitionId) params.append("tuitionId", filters.tuitionId);

  const queryString = params.toString();
  const url = `${API_URL}/applications${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch applications");
  return res.json();
}

// ৩. Mentor/Admin: Application Accept ba Reject kora
export async function updateApplicationStatusApi(
  id: string,
  status: "accepted" | "rejected"
) {
  const res = await fetch(`${API_URL}/applications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  return { ok: res.ok, data };
}