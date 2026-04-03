import mongoose from 'mongoose';

const maintenanceTicketSchema = new mongoose.Schema(
  {
    complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
    assignedTo: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'assigned', 'done'], default: 'pending' },
    dueDate: { type: Date, default: null },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('MaintenanceTicket', maintenanceTicketSchema);
