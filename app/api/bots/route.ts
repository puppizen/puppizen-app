// app/api/bots

import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models/user';
import connectDb from '@/lib/mongodb';

const TELEGRAM_API = 'https://api.telegram.org';
const BOT_TOKEN = process.env.BOT_TOKEN;

export async function POST(req: NextRequest) {
  const update = await req.json();

  const preCheckoutQuery = update?.pre_checkout_query;
  // const payment = update?.message?.successful_payment;

  // Precheckoutquery
  if (preCheckoutQuery) {
    const queryId = preCheckoutQuery.id;
    const payload = preCheckoutQuery.invoice_payload;

    // Validate payload format
    const expectedPayloads = [
      "Daily rewards with stars",
      "Reward boaster x2"
    ];
    if (!expectedPayloads.includes(payload)) {
      console.warn("Invalid payload:", payload);

      await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/answerPreCheckoutQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pre_checkout_query_id: queryId,
          ok: false,
          error_message: "Invalid payment. Please try again from the app.",
        }),
      });

      return new Response('Payload rejected', { status: 400 });
    }

    // Approve payment
    await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/answerPreCheckoutQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pre_checkout_query_id: queryId,
        ok: true,
      }),
    });

    return new Response('PreCheckout answered', { status: 200 });
  } 

  const userId = update?.message?.from?.id;
  const username = update?.message?.from?.username ?? `user-${userId}`;
  const messageText = update?.message?.text;
  const chatId = update?.message?.chat?.id;
  
  if (messageText?.startsWith("/start") && chatId) {
    const parts = messageText.split(' ');
    const referralCode = parts.length > 1 ? parts[1] : null;

    const replyText = 
    `🐶 Ready to earn like a good pup?\n\n` +
    `Play Puppizen and earn real rewards 💎\n\n` +
    `💎 Complete Tasks – Quick, simple, and rewarding\n` +
    `💎 Invite Friends – Grow your crew and earn more\n` +
    `💎 Collect Rewards – Treat yourself like a good pup\n\n` +
    `Start wagging your way to the top! 🐾`;

    await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        photo: "https://puppizen.github.io/puppizen/bannerObsolete.png",
        caption: replyText,
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

    // Generate referral code
    const generateRefCode = (length: number = 8): string => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
      let userRefCode = ''
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length)
        userRefCode += chars [randomIndex]
      }
      return userRefCode
    };

    await connectDb();

    let user = await User.findOne({ userId });
    if (!user) {
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
        chatId,
        balance: 10,
        starsBalance: 0,
        taskBooster: 1,
        checkInBooster: 1,
        gameBooster: 1,
        airdrop: 0,
        totalStarsPaid: 0,
        referrals: 0,
        referredUsers: [],
        taskCompleted: 0,
        completedTasks: [],
        verifiedTasks: [],
        claimedTasks: [],
        startedTasks: [],
        refCode,
        referredBy: null,
        lastDailyRewardAt: null,
        adsWatchedToday: 0,
        totalAdsWatched: 0,
        lastAdWatchedAt: null,
        lastClaimedAt: null,
        starsPaidToday: 0,
        lastStarsPaidAt: null,
        lastClaimedAtStars: null,
      });

      const referrer = await User.findOne({ refCode: referralCode });
      if (referrer && !referrer.referredUsers.includes(userId)) {
        referrer.referredUsers.push(userId);
        referrer.referrals += 1;
        referrer.balance += 50;

        await referrer.save();

        user.referredBy = referrer.userId;
        user.balance += 10;
        await user.save();
      }
    }
  }
  
  return NextResponse.json('OK', { status: 200 });
}


// app/api/bots

// import { NextRequest, NextResponse } from 'next/server';
// import { User } from '@/models/user';
// import connectDb from '@/lib/mongodb';

// const TELEGRAM_API = 'https://api.telegram.org';
// const BOT_TOKEN = process.env.BOT_TOKEN;
// const BOT_LINK = "https://t.me/PuppizenBot"

// export async function POST(req: NextRequest) {
//   const update = await req.json();

//   const preCheckoutQuery = update?.pre_checkout_query;
//   // const payment = update?.message?.successful_payment;

//   // Precheckoutquery
//   if (preCheckoutQuery) {
//     const queryId = preCheckoutQuery.id;
//     const payload = preCheckoutQuery.invoice_payload;

//     // Validate payload format
//     const expectedPayload = "Daily rewards with stars";
//     if (payload !== expectedPayload) {
//       console.warn("Invalid payload:", payload);

//       await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/answerPreCheckoutQuery`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           pre_checkout_query_id: queryId,
//           ok: false,
//           error_message: "Invalid payment. Please try again from the app.",
//         }),
//       });

//       return new Response('Payload rejected', { status: 400 });
//     }

//     // Approve payment
//     await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/answerPreCheckoutQuery`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         pre_checkout_query_id: queryId,
//         ok: true,
//       }),
//     });

//     return new Response('PreCheckout answered', { status: 200 });
//   } 

//   const userId = update?.message?.from?.id;
//   const username = update?.message?.from?.username ?? `user-${userId}`;
//   const messageText = update?.message?.text;
//   const chatId = update?.message?.chat?.id;
  
//   if (messageText?.startsWith('/start') && chatId) {
//     const parts = messageText.split(' ');
//     const referralCode = parts.length > 1 ? parts[1] : null;

//     const replyText = 
//     `🐶 Ready to earn like a good pup?\n\n` +
//     `Play Puppizen and earn real rewards 💎\n\n` +
//     `💎 Complete Tasks – Quick, simple, and rewarding\n` +
//     `💎 Invite Friends – Grow your crew and earn more\n` +
//     `💎 Collect Rewards – Treat yourself like a good pup\n\n` +
//     `Start wagging your way to the top! 🐾`;

//     await fetch(`${TELEGRAM_API}/bot${BOT_TOKEN}/sendPhoto`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         chat_id: chatId,
//         photo: "https://puppizen.github.io/puppizen/banner.png",
//         caption: replyText,
//         parse_mode: 'Markdown',
//         reply_markup: {
//           inline_keyboard: [
//             [
//               {
//                 text: 'Earn Puppizen',
//                 url: 'https://t.me/PuppizenBot/earn'
//               }
//             ],
//             [
//               {
//                 text: 'Telegram Community',
//                 url: 'https://t.me/puppizen'
//               }
//             ],
//             [
//               {
//                 text: 'X Community',
//                 url: 'https://x.com/puppizen'
//               }
//             ]
//           ]
//         }
//       }),
//     });

//     // Generate referral code
//     const generateRefCode = (length: number = 6): string => {
//       const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789'
//       let userRefCode = ''
//       for (let i = 0; i < length; i++) {
//         const randomIndex = Math.floor(Math.random() * chars.length)
//         userRefCode += chars [randomIndex]
//       }
//       return userRefCode
//     };

//     await connectDb();

//     let user = await User.findOne({ userId });
//     if (!user) {
//       let refCode = '';
//       let isUnique = false;

//       while (!isUnique) {
//         refCode = generateRefCode();
//         const existingUser = await User.findOne({ refCode });
//         if (!existingUser) isUnique = true
//       }

//       const referralLink = `${BOT_LINK}?start=${refCode}`;

//       let referredBy = null

//       if (referralCode) {
//         const referrer = await User.findOne({ refCode: referralCode });

//         if (referrer) {
//           referredBy = referrer.userId
//         }
//       }

//       user = await User.create({
//         userId,
//         username,
//         chatId,
//         balance: 10,
//         starsBalance: 0,
//         airdrop: 0,
//         totalStarsPaid: 0,
//         referrals: 0,
//         referredUsers: [],
//         taskCompleted: 0,
//         completedTasks: [],
//         verifiedTasks: [],
//         claimedTasks: [],
//         startedTasks: [],
//         referredBy,
//         refCode,
//         referralLink,
//         lastDailyRewardAt: null,
//         adsWatchedToday: 0,
//         totalAdsWatched: 0,
//         lastAdWatchedAt: null,
//         lastClaimedAt: null,
//         starsPaidToday: 0,
//         lastStarsPaidAt: null,
//         lastClaimedAtStars: null,
//       });

//       if (referredBy) {
//         await User.updateOne(
//           { userId: referredBy },
//           {
//             $inc: { referrals: 1 },
//             $push: { referredUsers: userId }
//           }
//         );
//       }

//       console.log("Telegram update:", JSON.stringify(update, null, 2));
//     }
//   }
  
//   return NextResponse.json('OK', { status: 200 });
// }
