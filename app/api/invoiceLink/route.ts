import { NextResponse } from 'next/server';

const TELEGRAM_API = 'https://api.telegram.org';
const BOT_TOKEN = process.env.BOT_TOKEN;

export async function GET() {
  const response = await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/createInvoiceLink`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: "Daily Reward",
      description: "Claim your daily reward for 5 Stars",
      payload: "daily_reward_with_stars",
      provider_token: "", // Leave empty for Telegram Stars
      currency: "XTR",
      prices: [{ label: "Daily Reward", amount: 5 }],
      start_parameter: "daily_reward_with_stars"
    })
  });

  const data = await response.json();

  if (!data.ok) {
    return NextResponse.json(JSON.stringify({ error: data.description }), { status: 400 });
  }

  return NextResponse.json({ status: "Invoice link created"});
}