import { NextResponse } from "next/server";

const TELEGRAM_API = 'https://api.telegram.org';
const BOT_TOKEN = process.env.BOT_TOKEN;

export async function POST() {
  const response = await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/createInvoiceLink`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: "Reward Boaster x3",
      description: "reward boaster x3",
      payload: "Reward boaster x3",
      provider_token: "", // Leave empty for Telegram Stars
      currency: "XTR",
      prices: [{ label: "Reward Boaster x3", amount: 300 }],
      start_parameter: "reward_boasterx3"
    })
  });

  const data = await response.json();

  if (!data.ok) {
    return NextResponse.json(({ error: data.description }), { status: 400 });
  }

  return NextResponse.json(({ invoiceLink: data.result }), { status: 200 });
}
