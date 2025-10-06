import { NextResponse } from "next/server";

const TELEGRAM_API = 'https://api.telegram.org';
const BOT_TOKEN = process.env.BOT_TOKEN;

export async function POST() {
  const response = await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/createInvoiceLink`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: "Task Reward Boaster x2",
      description: "Task Reward Boaster x2",
      payload: "Task Reward Boaster x2",
      provider_token: "", // Leave empty for Telegram Stars
      currency: "XTR",
      prices: [{ label: "Task Reward Boaster x2", amount: 200 }],
      start_parameter: "task_reward_boasterx2"
    })
  });

  const data = await response.json();

  if (!data.ok) {
    return NextResponse.json(({ error: data.description }), { status: 400 });
  }

  return NextResponse.json(({ invoiceLink: data.result }), { status: 200 });
}
