// app/api/bots

import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models/user';
import connectDb from '@/lib/mongodb'; 

const TELEGRAM_API = 'https://api.telegram.org';
const BOT_TOKEN = process.env.BOT_TOKEN;

export async function POST(req: NextRequest) {
  await connectDb();
  const { update, userId } = await req.json();

  const payment = update?.message?.successful_payment;

  if (!userId) {
    return new Response('Invalid Telegram user', { status: 400 });
  }

  const user = await User.findOne({ userId });
  const chatId = user.chatId;

  // Stars payment
  if (payment) {
    console.log('Payment received:', {
      userId,
      amount: payment.total_amount,
      payload: payment.invoice_payload,
      chargeId: payment.telegram_payment_charge_id
    });

    const payload = payment?.invoice_payload;

    if (payload === `Daily reward for - ${userId}`) {
      const today = new Date().toDateString();
      const total_amount = payment.total_amount / 100
      // Update user reward status in DB
      await User.updateOne(
        { userId },
        {
          $set: {
            lastStarsPaidAt: today,
            starsPaidToday: total_amount,
          }
        },
        { upsert: true }
      );

      // Send confirmation message
      await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🎉 You've successfully sent ${total_amount} stars, claim your daily rewards!`,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Claim reward',
                  url: 'https://t.me/PuppizenBot/earn'
                }
              ],
            ]
          }
        }),
      });
    }
  }


  return NextResponse.json('OK', { status: 200 });
}
