import express from 'express';
import { verifyJWT } from '../middleware/auth.js';
import { feeSummary } from '../data/seed.js';

const router = express.Router();

router.get('/summary', verifyJWT, async (req, res) => {
  return res.json(feeSummary);
});

export default router;
