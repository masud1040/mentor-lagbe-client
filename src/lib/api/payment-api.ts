const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function createCheckoutSessionApi(
  planName = "Mentor Pro Plan",
  price = 500
) {
  const res = await fetch(`${API_URL}/payments/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ planName, price }),
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

export async function verifyPaymentSessionApi(sessionId: string) {
  const res = await fetch(`${API_URL}/payments/verify-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ sessionId }),
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

export async function fetchPaymentsApi() {
  const res = await fetch(`${API_URL}/payments`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch payment history");
  return res.json();
}