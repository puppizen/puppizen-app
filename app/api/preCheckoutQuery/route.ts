import type { NextRequest } from 'next/server';

const TELEGRAM_API = 'https://api.telegram.org';
const BOT_TOKEN = process.env.BOT_TOKEN;

export async function POST(req: NextRequest) {
  const update = await req.json();
  const preCheckoutQuery = update?.pre_checkout_query;

  if (preCheckoutQuery) {
    const queryId = preCheckoutQuery.id;
    const payload = preCheckoutQuery.invoice_payload;
    // const userId = preCheckoutQuery.from?.id;

    // Validate payload format
    const expectedPayload = "Daily rewards with stars";
    if (payload === expectedPayload) {

      // Approve payment
      await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/answerPreCheckoutQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pre_checkout_query_id: queryId,
          ok: true,
        }),
      });
    } else {
      console.warn("Invalid payload:", payload);

      await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/answerPreCheckoutQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pre_checkout_query_id: queryId,
          ok: false,
          error_message: "Invalid payment. Please try again from the app.",
        }),
      });

      return new Response('Payload rejected', { status: 400 });
    }

    return new Response('PreCheckout answered', { status: 200 });
  }

  return new Response('OK', { status: 200 });
}