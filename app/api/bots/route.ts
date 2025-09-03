import type { NextRequest } from 'next/server';

const TELEGRAM_API = 'https://api.telegram.org';
const BOT_TOKEN = process.env.BOT_TOKEN;

export async function POST(req: NextRequest) {

  const update = await req.json();

  // Check if it's a /start command
  const messageText = update?.message?.text;
  const chatId = update?.message?.chat?.id;

  if (messageText === '/start' && chatId) {
    const replyText = `🐶 *Ready to earn like a good pup?*\n\n` +
    `Play *Puppizen* and earn real rewards 💎\n\n` +
    `💎 *Complete Tasks* – Quick, simple, and rewarding\n` +
    `💎 *Invite Friends* – Grow your crew and earn more\n` +
    `💎 *Collect Rewards* – Treat yourself like a good pup\n\n` +
    `Start wagging your way to the top! 🐾`;

    await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: replyText,
      }),
    });
  }

  return new Response('OK', { status: 200 });
}