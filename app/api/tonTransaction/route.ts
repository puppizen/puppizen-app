import { verifyTonTransaction } from "@/utils/verifyTonTransaction";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/user";
import connectDb from "@/lib/mongodb";

const REWARD_AMOUNT = 500;

export async function POST(req: NextRequest) {
  await connectDb();
  const { userId, destinationAddress, expectedAmountNanoTON, approximateTimestamp } = await req.json();

  if (!userId || !destinationAddress || !expectedAmountNanoTON || !approximateTimestamp) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const result = await verifyTonTransaction(destinationAddress, expectedAmountNanoTON, approximateTimestamp);

    if (result.is_success === true) {
      user.balance += REWARD_AMOUNT;
      await user.save();

      return NextResponse.json({
        success: true,
        actualSender: result.actualSender,
        transaction: result.transaction,
      }, { status: 200 });
    }

    return NextResponse.json({ success: false }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// const result = await verifyTonTransaction(
//   'UQCAngnr4rdL1TDFfZipwKArn__G_TH2Rg1QO9wjR3MuzALz',
//   '10000000',
//   Math.floor(Date.now() / 1000)
// );

// console.log('Verified sender:', result.actualSender);
