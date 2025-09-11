// app/api/bots

import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models/user';
import connectDb from '@/lib/mongodb'; 

const TELEGRAM_API = 'https://api.telegram.org';
const BOT_TOKEN = process.env.BOT_TOKEN;
const REQUIRED_STARS = 5

export async function POST(req: NextRequest) {
  await connectDb();
  const { userId } = await req.json();

  if (!userId) {
    return new Response('Invalid Telegram user', { status: 400 });
  }

  const user = await User.findOne({ userId });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const chatId = user.chatId;
  const today = new Date().toDateString();
  const lastStarsPaidAt = new Date(user.lastStarsPaidAt).toDateString();

  if (user.starsPaidToday === REQUIRED_STARS && lastStarsPaidAt === today) {
    return NextResponse.json({ error: 'You already spent stars today!', status: 403 })
  }

  // Stars payment
  await User.updateOne(
    { userId },
    {
      $set: {
        lastStarsPaidAt: today,
        starsPaidToday: REQUIRED_STARS,
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
      text: `🎉 You've successfully sent ${REQUIRED_STARS} stars, claim your daily rewards!`,
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


  return NextResponse.json({ starsPaidToday: REQUIRED_STARS });
}
