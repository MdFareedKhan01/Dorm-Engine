import express from 'express';
import bcrypt from 'bcryptjs';
import Student from '../models/Student.js';
import Room from '../models/Room.js';
import RoommateFeedback from '../models/RoommateFeedback.js';
import { verifyJWT } from '../middleware/auth.js';
import { buildPersonalityType, pickBestMatch } from '../utils/matching.js';
import { buildRoomNumber, toPublicUser } from '../utils/serialize.js';

const router = express.Router();
const MIN_STUDENTS_FOR_ALLOCATION = 22;
const ROOM_CAPACITY = 3;

router.use(verifyJWT);

router.get('/', async (req, res) => {
  if (req.auth.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const students = await Student.find({ role: 'student' }).sort({ createdAt: -1 });
  return res.json({ students: students.map(toPublicUser) });
});

router.get('/stats', async (req, res) => {
  if (req.auth.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const [totalStudents, assignedStudents, newAdmissions, activeProfiles] = await Promise.all([
    Student.countDocuments({ role: 'student' }),
    Student.countDocuments({ role: 'student', isAssigned: true }),
    Student.countDocuments({ role: 'student', createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
    Student.countDocuments({ role: 'student', profileComplete: true }),
  ]);

  return res.json({
    totalStudents,
    assignedStudents,
    unassignedStudents: totalStudents - assignedStudents,
    newAdmissions,
    activeProfiles,
  });
});

router.post('/', async (req, res) => {
  if (req.auth.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const hashedPassword = await bcrypt.hash(req.body.password || 'Student@12345', 10);
  const student = await Student.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    rollNumber: req.body.rollNumber || '',
    program: req.body.program || 'B.Tech Computer Science',
    year: req.body.year || '1st Year',
    block: req.body.block || 'Block C',
    roomNumber: req.body.roomNumber || '',
    role: 'student',
    personalityAnswers: req.body.personalityAnswers || [],
    personalityType: req.body.personalityType || '',
    preferences: req.body.preferences || {},
    isAssigned: Boolean(req.body.isAssigned),
    profileComplete: Boolean(req.body.profileComplete),
  });

  return res.status(201).json({ student: toPublicUser(student) });
});

router.get('/me', async (req, res) => {
  const user = await Student.findById(req.auth.sub);
  if (!user) {
    return res.status(404).json({ message: 'Student not found' });
  }
  return res.json({ user: toPublicUser(user) });
});

router.put('/me', async (req, res) => {
  const user = await Student.findById(req.auth.sub);
  if (!user) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const allowed = ['name', 'program', 'year', 'block', 'roomNumber'];
  allowed.forEach((field) => {
    if (typeof req.body[field] !== 'undefined') {
      user[field] = req.body[field];
    }
  });

  await user.save();
  return res.json({ success: true, user: toPublicUser(user) });
});

router.post('/personality', async (req, res) => {
  const user = await Student.findById(req.auth.sub);
  if (!user) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const answers = Array.isArray(req.body.answers) ? req.body.answers.map(Number) : [];
  user.personalityAnswers = answers;
  user.personalityType = req.body.personalityType || buildPersonalityType(answers);
  await user.save();

  return res.json({ success: true, personalityType: user.personalityType, user: toPublicUser(user) });
});

router.post('/preferences', async (req, res) => {
  const user = await Student.findById(req.auth.sub);
  if (!user) {
    return res.status(404).json({ message: 'Student not found' });
  }

  user.preferences = req.body.preferences || req.body;
  user.profileComplete = true;
  await user.save();

  return res.json({ success: true, preferences: user.preferences, user: toPublicUser(user) });
});

router.get('/best-match', async (req, res) => {
  const user = await Student.findById(req.auth.sub);
  if (!user) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const totalEligibleStudents = await Student.countDocuments({ role: 'student', profileComplete: true });
  if (totalEligibleStudents < MIN_STUDENTS_FOR_ALLOCATION) {
    return res.json({
      match: null,
      allocationInProgress: true,
      totalEligibleStudents,
      minimumRequired: MIN_STUDENTS_FOR_ALLOCATION,
      roomCapacity: ROOM_CAPACITY,
      message: `Allocation is in process. ${MIN_STUDENTS_FOR_ALLOCATION - totalEligibleStudents} more student(s) needed.`,
    });
  }

  const candidates = await Student.find({
    _id: { $ne: user._id },
    role: 'student',
    profileComplete: true,
    isAssigned: false,
  }).lean();

  const match = pickBestMatch(user, candidates);
  if (!match) {
    return res.json({ match: null });
  }

  return res.json({
    match: {
      _id: match.student._id,
      name: match.student.name,
      program: match.student.program,
      personalityType: match.student.personalityType,
      compatibility: Math.round(match.compatibility),
      preferenceScore: match.preferenceScore,
      matchingPreferences: Object.entries(match.student.preferences || {}).map(([key, value]) => `${key}: ${value}`),
    },
    allocationInProgress: false,
    totalEligibleStudents,
    minimumRequired: MIN_STUDENTS_FOR_ALLOCATION,
    roomCapacity: ROOM_CAPACITY,
  });
});

router.get('/roommates', async (req, res) => {
  const user = await Student.findById(req.auth.sub);
  if (!user) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const room = await Room.findOne({ roomNumber: user.roomNumber, block: user.block || 'Block C' })
    .populate('students', 'name email program personalityType preferences roomNumber block')
    .lean();

  const fallbackStudents = await Student.find({ roomNumber: user.roomNumber, role: 'student' })
    .select('name email program personalityType preferences roomNumber block')
    .lean();

  const studentsInRoom = (room?.students?.length ? room.students : fallbackStudents)
    .filter(Boolean)
    .slice(0, ROOM_CAPACITY);

  const roommateIds = studentsInRoom
    .map((student) => String(student._id))
    .filter((id) => id !== String(user._id));

  const feedbackDocs = await RoommateFeedback.find({
    fromStudentId: user._id,
    toStudentId: { $in: roommateIds },
  }).lean();

  const feedbackByTarget = Object.fromEntries(feedbackDocs.map((entry) => [
    String(entry.toStudentId),
    { rating: entry.rating, note: entry.note },
  ]));

  return res.json({
    currentStudentId: String(user._id),
    room: {
      roomNumber: user.roomNumber || room?.roomNumber || '',
      block: user.block || room?.block || 'Block C',
      floor: room?.floor || '3rd',
      capacity: room?.capacity || ROOM_CAPACITY,
      wifi: room?.wifi || 'Available',
      ac: room?.ac ? 'Active' : 'Not available',
    },
    roommates: studentsInRoom.map((student) => ({
      _id: student._id,
      name: student.name,
      email: student.email || '',
      program: student.program,
      personalityType: student.personalityType || 'N/A',
      preferenceCount: Object.keys(student.preferences || {}).length,
      isSelf: String(student._id) === String(user._id),
      feedback: feedbackByTarget[String(student._id)] || null,
    })),
  });
});

router.post('/confirm-room', async (req, res) => {
  const user = await Student.findById(req.auth.sub);
  if (!user) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const totalEligibleStudents = await Student.countDocuments({ role: 'student', profileComplete: true });
  if (totalEligibleStudents < MIN_STUDENTS_FOR_ALLOCATION) {
    return res.status(409).json({
      message: 'Allocation is in process',
      allocationInProgress: true,
      totalEligibleStudents,
      minimumRequired: MIN_STUDENTS_FOR_ALLOCATION,
      roomCapacity: ROOM_CAPACITY,
    });
  }

  const otherStudentId = req.body.matchStudentId || null;
  const block = user.block || 'Block C';
  let room = null;
  const existingRooms = await Room.find({ block, status: { $ne: 'maintenance' } }).sort({ createdAt: 1 });
  room = existingRooms.find((item) => (item.students?.length || 0) < ROOM_CAPACITY) || null;

  if (!room) {
    const nextIndex = (await Room.countDocuments({ block })) + 1;
    room = await Room.create({
      roomNumber: user.roomNumber || buildRoomNumber(block.replace('Block ', ''), nextIndex),
      block,
      capacity: ROOM_CAPACITY,
      status: 'occupied',
      students: [user._id],
      compatibilityScore: 91,
    });
  }

  if (!room.students.some((studentId) => String(studentId) === String(user._id))) {
    room.students.push(user._id);
  }

  if (otherStudentId && room.students.length < ROOM_CAPACITY && !room.students.some((studentId) => String(studentId) === String(otherStudentId))) {
    room.students.push(otherStudentId);
  }

  room.status = 'occupied';
  await room.save();

  user.isAssigned = true;
  user.roomId = room._id;
  user.roomNumber = room.roomNumber;
  await user.save();

  if (otherStudentId) {
    await Student.findByIdAndUpdate(otherStudentId, {
      isAssigned: true,
      roomId: room._id,
      roomNumber: room.roomNumber,
    });
  }

  return res.json({
    success: true,
    room: {
      roomNumber: room.roomNumber,
      block: room.block,
      status: room.status,
      capacity: room.capacity,
    },
  });
});

router.post('/feedback', async (req, res) => {
  const user = await Student.findById(req.auth.sub);
  if (!user) {
    return res.status(404).json({ message: 'Student not found' });
  }

  user.feedbackRating = Number(req.body.rating || 0);
  await user.save();
  return res.json({ success: true });
});

router.post('/roommate-feedback', async (req, res) => {
  const user = await Student.findById(req.auth.sub);
  if (!user) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const toStudentId = req.body.toStudentId;
  const rating = Number(req.body.rating || 0);
  const note = typeof req.body.note === 'string' ? req.body.note.trim() : '';

  if (!toStudentId || toStudentId === String(user._id)) {
    return res.status(400).json({ message: 'Invalid roommate target' });
  }

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  const targetStudent = await Student.findById(toStudentId);
  if (!targetStudent) {
    return res.status(404).json({ message: 'Roommate not found' });
  }

  if (!user.roomNumber || user.roomNumber !== targetStudent.roomNumber) {
    return res.status(400).json({ message: 'Feedback can only be submitted for your roommates' });
  }

  const feedback = await RoommateFeedback.findOneAndUpdate(
    { fromStudentId: user._id, toStudentId },
    {
      $set: {
        roomNumber: user.roomNumber,
        rating,
        note,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return res.status(201).json({
    success: true,
    feedback: {
      toStudentId: feedback.toStudentId,
      rating: feedback.rating,
      note: feedback.note,
    },
  });
});

export default router;
