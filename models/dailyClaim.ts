// models/dailyClaim.ts
import { model, Schema, models } from 'mongoose';

const dailyClaimSchema = new Schema({
  userId: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  reward: { 
    type: Number, 
    required: true 
  },
});

export const DailyClaim = models.DailyClaim || model('DailyClaim', dailyClaimSchema);