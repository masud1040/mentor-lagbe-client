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