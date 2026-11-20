const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface UserFilters {
  role?: string;
  search?: string;
  limit?: number;
}

export async function fetchUsersApi(filters: UserFilters = {}) {
  const params = new URLSearchParams();
  if (filters.role && filters.role !== "all") params.append("role", filters.role);
  if (filters.search) params.append("search", filters.search);
  if (filters.limit) params.append("limit", String(filters.limit));

  const queryString = params.toString();
  const url = `${API_URL}/users${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function updateUserRoleApi(
  id: string,
  role: "student" | "mentor" | "admin"
) {
  const res = await fetch(`${API_URL}/users/${id}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ role }),
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

export async function toggleUserBanApi(id: string, banned: boolean) {
  const res = await fetch(`${API_URL}/users/${id}/ban`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ banned }),
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

export interface ProfileUpdatePayload {
  name?: string;
  image?: string;
  bio?: string;
  gender?: string;
  location?: string;
  education?: string;
  currentOccupation?: string;
  cvUrl?: string;
  expertSubjects?: string[];
  studentClass?: string;
  institution?: string;
}

export async function fetchMyProfileApi() {
  const res = await fetch(`${API_URL}/users/me`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

export async function updateMyProfileApi(payload: ProfileUpdatePayload) {
  const res = await fetch(`${API_URL}/users/me/profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

export async function fetchMentorsApi(
  filters: { search?: string; subject?: string; sort?: string; limit?: number } = {}
) {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.subject && filters.subject !== "all")
    params.append("subject", filters.subject);
  if (filters.sort) params.append("sort", filters.sort);
  if (filters.limit) params.append("limit", String(filters.limit));

  const query = params.toString();
  const res = await fetch(`${API_URL}/mentors${query ? `?${query}` : ""}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch mentors");
  return res.json();
}

export async function fetchMentorByIdApi(id: string) {
  const res = await fetch(`${API_URL}/mentors/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}