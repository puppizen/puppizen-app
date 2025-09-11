import { NextRequest } from "next/server";

const TELEGRAM_API = 'https://api.telegram.org';
const BOT_TOKEN = process.env.BOT_TOKEN;

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  const response = await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/createInvoiceLink`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: "Daily Reward",
      description: "Claim your daily reward for 20 Stars",
      payload: `Daily rewards for - ${userId}`,
      provider_token: "", // Leave empty for Telegram Stars
      currency: "XTR",
      prices: [{ label: "Daily Reward", amount: 20 }],
      start_parameter: "daily_reward_with_stars"
    })
  });

  const data = await response.json();

  if (!data.ok) {
    return new Response(JSON.stringify({ error: data.description }), { status: 400 });
  }

  return new Response(JSON.stringify({ invoiceLink: data.result }), { status: 200 });
}
