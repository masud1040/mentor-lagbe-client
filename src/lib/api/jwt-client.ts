const JWT_STORAGE_KEY = "mentorlagbe_jwt";

let pendingTokenRequest: Promise<string | null> | null = null;

export function getStoredJwt(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(JWT_STORAGE_KEY);
}

export function clearJwtToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(JWT_STORAGE_KEY);
}

export async function syncJwtToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  if (!pendingTokenRequest) {
    pendingTokenRequest = (async () => {
      try {
        const res = await fetch("/api/jwt", {
          method: "POST",
          credentials: "include",
        });

        if (!res.ok) {
          clearJwtToken();
          return null;
        }

        const data = await res.json();
        if (data?.token) {
          localStorage.setItem(JWT_STORAGE_KEY, data.token);
          return data.token as string;
        }
        return null;
      } catch {
        return null;
      } finally {
        pendingTokenRequest = null;
      }
    })();
  }

  return pendingTokenRequest;
}

export async function authFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  let token = getStoredJwt();
  if (!token) {
    token = await syncJwtToken();
  }

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    const refreshedToken = await syncJwtToken();
    if (refreshedToken) {
      headers.set("Authorization", `Bearer ${refreshedToken}`);
      res = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });
    }
  }

  return res;
}
