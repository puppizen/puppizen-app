import { User } from '@/models/user';
import connectDb from '@/lib/mongodb';
import { NextResponse } from 'next/server';

const TELEGRAM_API = 'https://api.telegram.org';
const BOT_TOKEN = process.env.BOT_TOKEN!;

export async function GET() {
  await connectDb();

  const users = await User.find({ chatId: { $exists: true, $ne: null } });

  for (const user of users) {
    const replyText = 
    `👋 Hey ${user.username || 'there'}! \n\n` +
    `New tasks and rewards 💎 are waiting for you in Puppizen 🐾 \n\n` +
    `With each completed task, you're climbing higher toward success \n` +
    `Complete more task, claim rewards and wag your way to the top 🐾`;

    await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: user.chatId,
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

  return NextResponse.json({ status: 'Broadcast sent to all users' });
}