import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  feedback: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  userAgent: { type: String },
  ip: { type: String },
});

export default mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema); 