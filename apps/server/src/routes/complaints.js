import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Complaint from '../models/Complaint.js';
import MaintenanceTicket from '../models/MaintenanceTicket.js';
import { verifyJWT, requireRole } from '../middleware/auth.js';

const router = express.Router();

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const uploadDir = path.resolve(currentDir, '../../uploads/complaints');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeExt = path.extname(file.originalname || '').toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype?.startsWith('image/')) {
      return cb(new Error('Only image uploads are allowed'));
    }
    return cb(null, true);
  },
});

const spamKeywords = ['lottery', 'bitcoin', 'free money', 'subscribe'];
const priorityKeywords = [
  { key: 'urgent', value: 'high' },
  { key: 'fire', value: 'high' },
  { key: 'water', value: 'medium' },
  { key: 'light', value: 'medium' },
  { key: 'wifi', value: 'medium' },
  { key: 'fan', value: 'low' },
];

function classifyComplaint(text = '') {
  const lower = text.toLowerCase();
  const isSpam = spamKeywords.some((keyword) => lower.includes(keyword));
  if (isSpam) {
    return { isSpam: true, priority: 'low', category: 'General' };
  }

  const priority = priorityKeywords.find((item) => lower.includes(item.key))?.value || 'medium';
  let category = 'General';
  if (lower.includes('water') || lower.includes('pipe') || lower.includes('sink')) category = 'Plumbing';
  else if (lower.includes('light') || lower.includes('fan') || lower.includes('socket') || lower.includes('ac')) category = 'Electrical';
  else if (lower.includes('clean') || lower.includes('sweeping')) category = 'Housekeeping';
  else if (lower.includes('security') || lower.includes('gate')) category = 'Security';

  return { isSpam: false, priority, category };
}

router.use(verifyJWT);

router.post('/', upload.single('media'), async (req, res) => {
  const text = `${req.body.subject || ''} ${req.body.description || ''}`;
  const classification = classifyComplaint(text);
  const uploadedMediaUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/complaints/${req.file.filename}` : '';

  const complaint = await Complaint.create({
    studentId: req.auth.sub,
    roomNumber: req.body.roomNumber || '',
    block: req.body.block || '',
    category: req.body.category || classification.category,
    subject: req.body.subject,
    description: req.body.description,
    mediaUrl: uploadedMediaUrl || req.body.mediaUrl || '',
    isSpam: classification.isSpam,
    priority: req.body.priority || classification.priority,
    status: classification.isSpam ? 'resolved' : 'open',
    mlProcessed: true,
  });

  if (!classification.isSpam) {
    await MaintenanceTicket.create({
      complaintId: complaint._id,
      assignedTo: '',
      status: 'pending',
      notes: complaint.subject,
    });
  }

  return res.status(201).json({ complaint });
});

router.get('/mine', async (req, res) => {
  const complaints = await Complaint.find({ studentId: req.auth.sub }).sort({ createdAt: -1 });
  return res.json({ complaints });
});

router.get('/', requireRole('admin'), async (req, res) => {
  const query = {};
  if (req.query.status) query.status = req.query.status;
  if (req.query.priority) query.priority = req.query.priority;
  const complaints = await Complaint.find(query).populate('studentId', 'name email').sort({ createdAt: -1 });
  return res.json({ complaints });
});

router.put('/:id/status', requireRole('admin'), async (req, res) => {
  const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!complaint) {
    return res.status(404).json({ message: 'Complaint not found' });
  }
  return res.json({ success: true, complaint });
});

router.put('/:id/assign', requireRole('admin'), async (req, res) => {
  const complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    { assignedTo: req.body.assignedTo || '', status: req.body.status || 'in_progress' },
    { new: true }
  );
  if (!complaint) {
    return res.status(404).json({ message: 'Complaint not found' });
  }
  return res.json({ success: true, complaint });
});

export default router;
