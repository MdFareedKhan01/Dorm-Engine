import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import { toPublicUser } from '../utils/serialize.js';

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    { sub: String(user._id), role: user.role, email: user.email },
    process.env.JWT_SECRET || 'dorm-engine-secret',
    { expiresIn: '7d' }
  );
}

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await Student.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const count = await Student.countDocuments({ role: 'student' });
    const user = await Student.create({
      name,
      email,
      password: hashedPassword,
      role: 'student',
      rollNumber: `STU${String(count + 1001).padStart(4, '0')}`,
      profileComplete: false,
    });

    return res.status(201).json({ token: createToken(user), user: toPublicUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await Student.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    return res.json({ token: createToken(user), user: toPublicUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
