// app/api/user/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { User } from '@/models/user';
import connectDb from '@/lib/mongodb';

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

const TELEGRAM_API = 'https://api.telegram.org';
const BOT_TOKEN = process.env.BOT_TOKEN;

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

export async function POST(request: NextRequest) {
  await connectDb();

  const body = await request.json();
  const userId = Number(body.userId);
  const username = body.username ?? 'Anonymous';
  const profile_url = body.profile_url || await fetchTelegramProfilePic(userId);
  const isBot = Boolean(body.is_bot);

  console.log('Incoming request...');
  console.log('userId:', userId);
  console.log('username:', username);

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
      chatId: 0,
      balance: 10,
      starsBalance: 0,
      totalStarsPaid: 0,
      referrals: 0,
      referredUsers: [],
      taskCompleted: 0,
      completedTasks: [],
      verifiedTasks: [],
      claimedTasks: [],
      startedTasks: [],
      refCode,
      lastDailyRewardAt: null,
      adsWatchedToday: 0,
      lastAdWatchedAt: null,
      lastClaimedAt: null,
      starsPaidToday: 0,
      lastStarsPaidAt: null,
      lastClaimedAtStars: null,
    });
  } else if (user) {
    user = await User.updateOne(
      {userId},
      {
        $set: {
          profile_url
        }
      }
    )
  }

  return NextResponse.json({status: "OK"  });
}


// // // app/api/daily-claim/route.ts
// // import { NextRequest, NextResponse } from 'next/server';
// // import connectDb from '@/lib/mongodb';
// // import { DailyClaim } from '@/models/dailyClaim';
// // import { User } from '@/models/user';

// // export async function POST(request: NextRequest) {
// //   await connectDb();

// //   const { userId, reward } = await request.json();
// //   const today = new Date();
// //   today.setHours(0, 0, 0, 0); // Normalize to midnight

// //   const existingClaim = await DailyClaim.findOne({ userId, date: today });
// //   if (existingClaim) {
// //     return NextResponse.json({ error: 'Already claimed today' }, { status: 400 });
// //   }

// //   const user = await User.findOne({ userId });
// //   if (!user) {
// //     return NextResponse.json({ error: 'User not found' }, { status: 404 });
// //   }

// //   user.balance += reward;
// //   await user.save();

// //   const claim = new DailyClaim({ userId, date: today, reward });
// //   await claim.save();

// //   return NextResponse.json({
// //     success: true,
// //     balance: Number(user.balance).toFixed(3),
// //   });
// // }