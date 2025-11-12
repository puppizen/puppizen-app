// app/api/user/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { User } from '@/models/user';
import connectDb from '@/lib/mongodb';

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
  const profile_url = body.profile_url || await fetchTelegramProfilePic(userId);
  const userWallet = body.walletAddress

  console.log('Incoming request...');
  console.log('userId:', userId);

  if (!userId) {
    return NextResponse.json({ error: 'Telegram user ID is required' }, { status: 400 });
  } 

  const user = await User.findOne({ userId });

   if (user) {
    const refCode = user.refCode;
    const BOT_LINK = "https://t.me/PuppizenBot";
    const referralLink = `${BOT_LINK}?start=${refCode}`;
    
    await User.updateOne(
      {userId},
      {
        $set: {
          referralLink,
          profile_url,
          userWallet,
        }
      }
    )
   }

  return NextResponse.json({status: "OK"  });
}