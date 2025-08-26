import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema ({
  category: {
    type: String,
    enum: ['social', 'activity', 'partners'],
    required: true
  },
  name: String,
  code: String,
  reward: Number,
  url: String,
  iconUrl: String,
  max: Number,
  completed: { type: Number, default: 0 },
  goal: Number,
  activity: {
    type: String,
    enum: ['referrals', 'taskCompleted', 'earnings'],
  }
});

export const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
