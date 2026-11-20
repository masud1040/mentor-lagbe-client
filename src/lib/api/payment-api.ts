import { authFetch } from "./jwt-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function createCheckoutSessionApi(
  planName = "Mentor Pro Plan",
  price = 500,
  options?: { successPath?: string; cancelPath?: string }
) {
  const res = await authFetch(`${API_URL}/payments/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      planName,
      price,
      ...(options?.successPath ? { successPath: options.successPath } : {}),
      ...(options?.cancelPath ? { cancelPath: options.cancelPath } : {}),
    }),
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

export async function verifyPaymentSessionApi(sessionId: string) {
  const res = await authFetch(`${API_URL}/payments/verify-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId }),
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

export async function fetchPaymentsApi() {
  const res = await authFetch(`${API_URL}/payments`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch payment history");
  return res.json();
}