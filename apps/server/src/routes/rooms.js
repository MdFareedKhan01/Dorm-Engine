import express from 'express';
import Room from '../models/Room.js';
import { verifyJWT, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyJWT, requireRole('admin'), async (req, res) => {
  const rooms = await Room.find().populate('students', 'name email rollNumber program roomNumber personalityType');
  return res.json({ rooms });
});

router.get('/stats', verifyJWT, requireRole('admin'), async (req, res) => {
  const [occupied, empty, maintenance] = await Promise.all([
    Room.countDocuments({ status: 'occupied' }),
    Room.countDocuments({ status: 'empty' }),
    Room.countDocuments({ status: 'maintenance' }),
  ]);

  return res.json({ occupied, empty, maintenance });
});

router.put('/:id/status', verifyJWT, requireRole('admin'), async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }
  return res.json({ success: true, room });
});

export default router;
