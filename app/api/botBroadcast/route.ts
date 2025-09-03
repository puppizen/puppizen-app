import { User } from '@/models/user';
import connectDb from '@/lib/mongodb';
import { NextResponse } from 'next/server';

const TELEGRAM_API = 'https://api.telegram.org';
const BOT_TOKEN = process.env.BOT_TOKEN!;

export async function GET() {
  await connectDb();

  const users = await User.find({ chatId: { $exists: true, $ne: null } });

  for (const user of users) {
    await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: user.chatId,
        text: `👋 Hey ${user.username || 'there'}! New tasks and rewards are waiting for you in Puppizen 🐾`,
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Earn More', url: 'https://t.me/PuppizenBot/earn' },
              { text: 'Invite Friends', url: 'https://t.me/puppizen' }
            ]
          ]
        }
      }),
    });
  }

  return NextResponse.json({ status: 'Broadcast sent to all users' });
}