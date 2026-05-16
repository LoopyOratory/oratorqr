const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || "";
const PAYSTACK_BASE = "https://api.paystack.co";
const APP_URL = process.env.APP_URL || "http://localhost:3000";

interface InitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export async function initializePayment(email: string, amountGHS: number, reference: string, metadata: Record<string, any> = {}) {
  const amountPesewas = amountGHS * 100;
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: amountPesewas,
      currency: "GHS",
      reference,
      callback_url: `${APP_URL}/collection`,
      metadata,
    }),
  });
  const data: InitResponse = await res.json();
  if (!data.status) throw new Error(data.message);
  return data.data;
}

interface VerifyResponse {
  status: boolean;
  data: {
    status: string;
    amount: number;
    reference: string;
    currency: string;
  };
}

export async function verifyPayment(reference: string) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
  });
  const data: VerifyResponse = await res.json();
  return data;
}
