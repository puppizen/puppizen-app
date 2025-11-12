// models/User.ts
import { model, Schema, models } from 'mongoose';

const userSchema = new Schema({
  userId: {
    type: Number,
    required: true,
    unique: true
  },
  username: { 
    type: String,
  },
  isBot: {
    type: Boolean,
    default: false
  },
  chatId: {
    type: Number,
    unique: true,
    default: 0
  },
  profile_url: {
    type: String,
  },
  userWallet: {
    type: String,
    default: 0
  },
  balance: { 
    type: Number, 
    default: 10 
  },
  starsBalance: {
    type: Number,
    default: 0
  },
  taskBooster: {
    type: Number,
    default: 1,
  },
  checkInBooster: {
    type: Number,
    default: 1,
  },
  gameBooster: {
    type: Number,
    default: 1,
  },
  gameTicket: {
    type: Number,
    default: 3
  },
  gamesPlayed: {
    type: Number,
    default: 0,
  },
  totalStarsPaid: {
    type: Number,
    default: 0
  },
  airdrop: {
    type: Number,
    default: 0
  },
  referrals: { 
    type: Number, 
    default: 0 
  },
  referredUsers: {
    type: [Number],
    default: []
  },
  referralLink: {
    type: String,
    default: null
  },
  referredBy: { 
    type: Number, 
    default: null 
  }, 
  startedTasks: [{
    taskId: String,
    startedAt: Date
  }],
  verifiedTasks: [String],
  claimedTasks: [String],
  taskCompleted: { 
    type: Number, 
    default: 0 
  },
  completedTasks: [{ 
    type: String 
  }],
  refCode: {
    type: String,
    unique: true
  },
  lastDailyRewardAt: {
    type: Date,
    default: null
  },
  adsWatchedToday: { 
    type: Number, 
    default: 0 
  },
  totalAdsWatched: {
    type: Number,
    default: 0,
  },
  // lastRewardAt: { type: Date, default: null },
  lastAdWatchedAt: { 
    type: Date, 
    default: null 
  },
  lastClaimedAt: { 
    type: Date, 
    default: null 
  },
  starsPaidToday: {
    type: Number,
    default: 0
  },
  lastStarsPaidAt: {
    type: Date,
    default: null
  },
  lastClaimedAtStars: {
    type: Date,
    default: null
  },

  // latestPayment: {
  //   date: Date,
  //   amount: Number,
  //   currency: String,
  //   payload: String,
  //   telegramChargeId: String,
  //   providerChargeId: String
  // }
});

export const User = models.User || model('User', userSchema);
