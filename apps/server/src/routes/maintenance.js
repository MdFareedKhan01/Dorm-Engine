import express from 'express';
import MaintenanceTicket from '../models/MaintenanceTicket.js';
import Complaint from '../models/Complaint.js';
import { verifyJWT, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyJWT, async (req, res) => {
  if (req.auth.role === 'admin') {
    const tickets = await MaintenanceTicket.find().sort({ createdAt: -1 });
    return res.json({ tickets });
  }

  const complaints = await Complaint.find({ studentId: req.auth.sub }).select('_id');
  const complaintIds = complaints.map((item) => item._id);
  const tickets = await MaintenanceTicket.find({ complaintId: { $in: complaintIds } }).sort({ createdAt: -1 });
  return res.json({ tickets });
});

router.put('/:id', verifyJWT, requireRole('admin'), async (req, res) => {
  const ticket = await MaintenanceTicket.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!ticket) {
    return res.status(404).json({ message: 'Ticket not found' });
  }
  return res.json({ success: true, ticket });
});

export default router;
