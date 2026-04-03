import express from 'express';
import Staff from '../models/Staff.js';
import { verifyJWT, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyJWT, requireRole('admin'), async (req, res) => {
  const staff = await Staff.find().sort({ createdAt: -1 });
  return res.json({ staff });
});

router.post('/', verifyJWT, requireRole('admin'), async (req, res) => {
  const staff = await Staff.create({
    name: req.body.name,
    role: req.body.role || 'maintenance',
    department: req.body.department || '',
    activeTickets: Number(req.body.activeTickets || 0),
    email: req.body.email || '',
  });

  return res.status(201).json({ staff });
});

router.put('/:id', verifyJWT, requireRole('admin'), async (req, res) => {
  const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!staff) {
    return res.status(404).json({ message: 'Staff member not found' });
  }
  return res.json({ success: true, staff });
});

export default router;
