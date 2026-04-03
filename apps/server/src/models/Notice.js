import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: { type: String, enum: ['general', 'emergency', 'policy'], default: 'general' },
    targetBlock: { type: String, default: 'all' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null },
    badge: { type: String, default: 'New' },
    accent: { type: String, default: 'warm' },
  },
  { timestamps: true }
);

export default mongoose.model('Notice', noticeSchema);
