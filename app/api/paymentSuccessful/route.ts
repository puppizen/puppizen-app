// app/api/paymentSuccessful

import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models/user';
import connectDb from '@/lib/mongodb'; 

// const TELEGRAM_API = 'https://api.telegram.org';
// const BOT_TOKEN = process.env.BOT_TOKEN;
const REQUIRED_STARS = 10;

export async function POST(req: NextRequest) {
  await connectDb();
  const { userId } = await req.json();

  console.log("Received payment request for user:", userId);

  if (!userId) {
    return new Response('Invalid Telegram user', { status: 400 });
  }

  const user = await User.findOne({ userId });
  const referrer = user?.referredBy ? await User.findOne({ userId: user.referredBy }) : null;

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // const chatId = user.chatId;
  const today = new Date().toDateString();
  const lastStarsPaidAt = new Date(user.lastStarsPaidAt).toDateString();

  if (user.starsPaidToday === REQUIRED_STARS && lastStarsPaidAt === today) {
    return NextResponse.json({ error: 'You already spent stars today!', status: 403 })
  }

  // Stars payment
  user.lastStarsPaidAt = today;
  user.starsPaidToday = REQUIRED_STARS;
  user.totalStarsPaid += REQUIRED_STARS;

  await user.save();

  const REFERRAL_PERCENTAGE = 0.1
  const refReward = REQUIRED_STARS * REFERRAL_PERCENTAGE;
  if (referrer) {
    referrer.starsBalance += refReward;
    await referrer.save()
  }

  // Send confirmation message
  // await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/sendMessage`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     chat_id: chatId,
  //     text: `🎉 You've successfully sent ${REQUIRED_STARS} stars, claim your daily rewards!`,
  //     reply_markup: {
  //       inline_keyboard: [
  //         [
  //           {
  //             text: 'Claim reward',
  //             url: 'https://t.me/PuppizenBot/earn'
  //           }
  //         ],
  //       ]
  //     }
  //   }),
  // });


  return NextResponse.json({ starsPaidToday: REQUIRED_STARS });
}
