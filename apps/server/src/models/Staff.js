import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, enum: ['maintenance', 'warden', 'admin'], default: 'maintenance' },
    department: { type: String, default: '' },
    activeTickets: { type: Number, default: 0 },
    email: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Staff', staffSchema);
