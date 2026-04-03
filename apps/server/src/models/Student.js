import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    rollNumber: { type: String, default: '' },
    program: { type: String, default: 'B.Tech Computer Science' },
    year: { type: String, default: '3rd Year' },
    personalityAnswers: { type: [Number], default: [] },
    personalityType: { type: String, default: '' },
    preferences: { type: Object, default: {} },
    block: { type: String, default: 'Block C' },
    roomNumber: { type: String, default: '' },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },
    isAssigned: { type: Boolean, default: false },
    profileComplete: { type: Boolean, default: false },
    feeStatus: { type: String, enum: ['paid', 'pending'], default: 'paid' },
    matchedWith: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null },
    feedbackRating: { type: Number, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Student', studentSchema);
