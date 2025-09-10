// app/api/bots

import type { NextRequest } from 'next/server';
import { User } from '@/models/user';

const TELEGRAM_API = 'https://api.telegram.org';
const BOT_TOKEN = process.env.BOT_TOKEN;

export async function POST(req: NextRequest) {
  const update = await req.json();

  // Check if it's a /start command
  const userId = update?.message?.from?.id;
  const username = update?.message?.from?.username ?? 'Anonymous';
  const isBot = update?.message?.from?.is_bot ?? false;
  const messageText = update?.message?.text;
  const chatId = update?.message?.chat?.id;

  const payment = update?.message?.successful_payment;
  const preCheckoutQuery = update?.pre_checkout_query;

  if (!userId || !chatId || isBot) {
    return new Response('Invalid Telegram user', { status: 400 });
  }

  await User.updateOne(
    { userId },
    {
      $set: {
        userId,
        chatId,
        username,
        isBot,
      },
    },
    { upsert: true }
  );

  if (messageText === '/start' && chatId) {
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

  // pre check-out query
  if (preCheckoutQuery) {
    const queryId = preCheckoutQuery.id;

    await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/answerPreCheckoutQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pre_checkout_query_id: queryId,
        ok: true // or false if you want to reject the payment
      }),
    });

    return new Response('PreCheckout answered', { status: 200 });
  }

  // Stars payment
  if (payment) {
    const payload = payment?.invoice_payload;

    if (payload === `daily reward for - ${userId}`) {
      // Update user reward status in DB
      await User.updateOne(
        { userId },
        {
          $set: {
            lastStarsPaymentAt: new Date(),
          },
          $inc: {
            starsSpent: 5,
          },
        },
        { upsert: true }
      );

      // Send confirmation message
      await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🎉 You've successfully sent 5 stars, claim your daily rewards!`,
          reply_markup: {
            inline_keyboard: [
              [
              {
                text: 'Claim rewards',
                url: 'https://t.me/PuppizenBot/earn'
              }
            ],
            ]
          }
        }),
      });
    }
  }


  return new Response('OK', { status: 200 });
}
