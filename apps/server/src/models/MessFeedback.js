import mongoose from 'mongoose';

const messFeedbackSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    mealSlot: { type: String, required: true },
    day: { type: String, required: true },
    item: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    review: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('MessFeedback', messFeedbackSchema);
