import express from 'express';
import Notice from '../models/Notice.js';
import { verifyJWT, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyJWT, async (req, res) => {
  const notices = await Notice.find().sort({ createdAt: -1 });
  return res.json({ notices });
});

router.post('/', verifyJWT, requireRole('admin'), async (req, res) => {
  const notice = await Notice.create({
    title: req.body.title,
    body: req.body.body,
    type: req.body.type || 'general',
    targetBlock: req.body.targetBlock || 'all',
    createdBy: req.auth.sub,
    badge: req.body.badge || 'New',
    accent: req.body.accent || 'warm',
  });

  return res.status(201).json({ notice });
});

export default router;
