import express from 'express';
import MessFeedback from '../models/MessFeedback.js';
import { verifyJWT, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyJWT);

router.post('/feedback', requireRole('student'), async (req, res) => {
  const { mealSlot, day, item, rating, review } = req.body;

  if (!mealSlot || !day || !item || !rating) {
    return res.status(400).json({ message: 'Meal slot, day, item and rating are required' });
  }

  const feedback = await MessFeedback.create({
    studentId: req.auth.sub,
    mealSlot,
    day,
    item,
    rating: Number(rating),
    review: review || '',
  });

  return res.status(201).json({ feedback });
});

router.get('/feedback/mine', requireRole('student'), async (req, res) => {
  const feedback = await MessFeedback.find({ studentId: req.auth.sub }).sort({ createdAt: -1 }).limit(20);
  return res.json({ feedback });
});

export default router;
