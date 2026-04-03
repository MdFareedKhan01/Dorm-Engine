import mongoose from 'mongoose';

const roommateFeedbackSchema = new mongoose.Schema(
  {
    fromStudentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    toStudentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    roomNumber: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    note: { type: String, default: '', trim: true, maxlength: 280 },
  },
  { timestamps: true }
);

roommateFeedbackSchema.index({ fromStudentId: 1, toStudentId: 1 }, { unique: true });

export default mongoose.model('RoommateFeedback', roommateFeedbackSchema);