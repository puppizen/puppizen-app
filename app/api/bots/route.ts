import { User } from '@/models/user';
import { NextResponse, NextRequest } from 'next/server';
import connectDb from '@/lib/mongodb';

const TELEGRAM_API = 'https://api.telegram.org';
const BOT_TOKEN = process.env.BOT_TOKEN;

// Generate referral code
const generateRefCode = (length: number = 6): string => {
  const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789'
  let userRefCode = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    userRefCode += chars [randomIndex]
  }
  return userRefCode
};

async function fetchTelegramProfilePic(userId: number): Promise<string | null> {
  try {
    const res = await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/getUserProfilePhotos?user_id=${userId}`);
    const data = await res.json();

    if (data.ok && data.result.total_count > 0) {
      const fileId = data.result.photos[0][0].file_id;

      const fileRes = await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
      const fileData = await fileRes.json();

      if (fileData.ok) {
        const filePath = fileData.result.file_path;
        // Return proxy URL instead of Telegram's direct link
        return `/api/proxy-image?filePath=${encodeURIComponent(filePath)}`;
      }
    }
  } catch (error) {
    console.error('Error fetching Telegram profile photo:', error);
  }

  return null;
}

export async function POST(req: NextRequest) {
  await connectDb();

  const body = await req.json();
  const userId = Number(body.userId);
  const username = body.username ?? 'Anonymous';
  const profile_url = body.profile_url || await fetchTelegramProfilePic(userId);
  const isBot = Boolean(body.is_bot);
  const chatId = body?.message?.chat?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Telegram user ID is required' }, { status: 400 });
  } 

  if (isBot) {
    return NextResponse.json({ error: 'Bots are not allowed' }, { status: 400 });
  }

  let user = await User.findOne({ userId });
  
  if (!user) {
    // Ensure referral code is unique
    let refCode = '';
    let isUnique = false;

    while (!isUnique) {
      refCode = generateRefCode();
      const existingUser = await User.findOne({ refCode });
      if (!existingUser) isUnique = true
    }

    user = await User.create({
      userId,
      username,
      profile_url,
      isBot,
      chatId,
      balance: 100,
      referrals: 0,
      referredUsers: [],
      taskCompleted: 0,
      completedTasks: [],
      verifiedTasks: [],
      claimedTasks: [],
      startedTasks: [],
      refCode,
    });
  }  

  // Check if it's a /start command
  const messageText = body?.message?.text;

  if (messageText === '/start' && chatId) {
    const replyText = `🐶 *Ready to earn like a good pup?*\n\n` +
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

  return NextResponse.json({
    userId: user.userId,
    user: user.username,
    balance: user.balance,
    profile_url: user.profile_url,
    referrals: user.referrals,
    referredUsers: user.referredUsers,
    taskCompleted: user.taskCompleted,
    completedTasks: user.completedTasks,
    verifiedTasks: user.verifiedTasks,
    claimedTasks: user.claimedTasks,
    startedTasks: user.startedTasks,
    refCode: user.refCode,
  });
}