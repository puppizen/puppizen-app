import { User } from '@/models/user';
import connectDb from '@/lib/mongodb';

const TELEGRAM_API = 'https://api.telegram.org';
const BOT_TOKEN = process.env.BOT_TOKEN!;

async function sendBroadcast() {
  await connectDb();
  const usersWithChatId = await User.find({ chatId: { $exists: true } });

  for (const user of usersWithChatId) {
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
}

// ⏱️ Run every 20 seconds
setInterval(() => {
  sendBroadcast().catch(console.error);
}, 20 * 1000);