import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    roomNumber: { type: String, required: true },
    block: { type: String, default: '' },
    category: { type: String, default: 'General' },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    mediaUrl: { type: String, default: '' },
    isSpam: { type: Boolean, default: false },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
    assignedTo: { type: String, default: '' },
    mlProcessed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Complaint', complaintSchema);
