// app/api/bots

import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models/user';

const TELEGRAM_API = 'https://api.telegram.org';
const BOT_TOKEN = process.env.BOT_TOKEN;

export async function POST(req: NextRequest) {
  const update = await req.json();

  // Check if it's a /start command
  const userId = update?.message?.from?.id;
  const username = update?.message?.from?.username ?? 'Anonymous';
  const messageText = update?.message?.text;
  const chatId = update?.message?.chat?.id;
  const preCheckoutQuery = update?.pre_checkout_query;

  // Precheckoutquery
  if (preCheckoutQuery) {
    const queryId = preCheckoutQuery.id;
    const payload = preCheckoutQuery.invoice_payload;
    const userId = preCheckoutQuery.from?.id;

    // Validate payload format
    const expectedPayload = `Daily rewards for - ${userId}`;
    if (payload !== expectedPayload) {
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

    // Approve payment
    await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/answerPreCheckoutQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pre_checkout_query_id: queryId,
        ok: true,
      }),
    });

    return new Response('PreCheckout answered', { status: 200 });
  }

  if (!userId || !chatId) {
    return new Response('Invalid Telegram user', { status: 400 });
  }

  // for /start command
  if (messageText === '/start' && chatId) {
    await User.updateOne(
      { userId },
      {
        $set: {
          userId,
          chatId,
          username,
        },
      },
      { upsert: true }
    );

    const replyText = 
    `🐶 Ready to earn like a good pup?\n\n` +
    `Play Puppizen and earn real rewards 💎\n\n` +
    `💎 Complete Tasks – Quick, simple, and rewarding\n` +
    `💎 Invite Friends – Grow your crew and earn more\n` +
    `💎 Collect Rewards – Treat yourself like a good pup\n\n` +
    `Start wagging your way to the top! 🐾`;

    await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: replyText,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Earn Puppizen',
                url: 'https://t.me/PuppizenBot/earn'
              }
            ],
            [
              {
                text: 'Telegram Community',
                url: 'https://t.me/puppizen'
              }
            ],
            [
              {
                text: 'X Community',
                url: 'https://x.com/puppizen'
              }
            ]
          ]
        }
      }),
    });
  }
  
  return NextResponse.json('OK', { status: 200 });
}