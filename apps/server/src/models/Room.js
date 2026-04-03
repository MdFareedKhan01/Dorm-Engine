import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    block: { type: String, required: true },
    capacity: { type: Number, default: 3 },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    status: { type: String, enum: ['occupied', 'empty', 'maintenance'], default: 'empty' },
    compatibilityScore: { type: Number, default: 0 },
    floor: { type: String, default: '3rd' },
    wifi: { type: String, default: 'Available' },
    ac: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Room', roomSchema);
