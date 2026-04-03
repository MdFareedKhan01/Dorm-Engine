import express from 'express';
import Student from '../models/Student.js';
import Staff from '../models/Staff.js';
import Room from '../models/Room.js';
import Complaint from '../models/Complaint.js';
import Notice from '../models/Notice.js';
import MaintenanceTicket from '../models/MaintenanceTicket.js';
import { feeSummary } from '../data/seed.js';
import { verifyJWT, requireRole } from '../middleware/auth.js';
import { toPublicUser } from '../utils/serialize.js';

const router = express.Router();

function toIsoDate(daysAgo = 0) {
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
}

router.get('/overview', verifyJWT, requireRole('admin'), async (req, res) => {
  const [students, staff, rooms, complaints, notices, tickets] = await Promise.all([
    Student.find().sort({ createdAt: -1 }),
    Staff.find().sort({ createdAt: -1 }),
    Room.find().populate('students', 'name rollNumber program roomNumber').sort({ createdAt: -1 }),
    Complaint.find().populate('studentId', 'name rollNumber program roomNumber').sort({ createdAt: -1 }),
    Notice.find().sort({ createdAt: -1 }),
    MaintenanceTicket.find().populate({ path: 'complaintId', select: 'subject roomNumber block' }).sort({ createdAt: -1 }),
  ]);

  const totalStudents = students.filter((item) => item.role === 'student').length;
  const activeStudents = students.filter((item) => item.role === 'student' && item.isAssigned).length;
  const unassignedStudents = students.filter((item) => item.role === 'student' && !item.isAssigned).length;
  const newAdmissions = students.filter((item) => item.role === 'student' && item.createdAt >= toIsoDate(30)).length;
  const totalStaff = staff.length;
  const busyStaff = staff.filter((item) => Number(item.activeTickets || 0) > 0).length;
  const occupiedRooms = rooms.filter((item) => item.status === 'occupied').length;
  const availableRooms = rooms.filter((item) => item.status === 'empty').length;
  const maintenanceRooms = rooms.filter((item) => item.status === 'maintenance').length;
  const openComplaints = complaints.filter((item) => item.status !== 'resolved').length;
  const pendingTickets = tickets.filter((item) => item.status !== 'done').length;
  const pendingNotices = notices.length;

  const roomOccupancy = {
    occupied: occupiedRooms,
    empty: availableRooms,
    maintenance: maintenanceRooms,
  };

  return res.json({
    stats: {
      totalStudents,
      activeStudents,
      unassignedStudents,
      newAdmissions,
      totalStaff,
      busyStaff,
      occupiedRooms,
      availableRooms,
      maintenanceRooms,
      openComplaints,
      pendingTickets,
      pendingNotices,
      totalRooms: rooms.length,
      feeCollected: feeSummary.totalCollected,
      feePending: feeSummary.pending,
    },
    recentStudents: students.slice(0, 5).map(toPublicUser),
    recentComplaints: complaints.slice(0, 5).map((complaint) => ({
      _id: complaint._id,
      subject: complaint.subject,
      roomNumber: complaint.roomNumber,
      block: complaint.block,
      priority: complaint.priority,
      status: complaint.status,
      studentName: complaint.studentId?.name || 'Student',
      studentRoom: complaint.studentId?.roomNumber || complaint.roomNumber,
      updatedAt: complaint.updatedAt,
      assignedTo: complaint.assignedTo,
    })),
    recentNotices: notices.slice(0, 5),
    recentMaintenance: tickets.slice(0, 5).map((ticket) => ({
      _id: ticket._id,
      status: ticket.status,
      assignedTo: ticket.assignedTo,
      notes: ticket.notes,
      dueDate: ticket.dueDate,
      complaintSubject: ticket.complaintId?.subject || 'Complaint',
      complaintRoom: ticket.complaintId?.roomNumber || '',
      complaintBlock: ticket.complaintId?.block || '',
    })),
    roomOccupancy,
    feeSummary,
  });
});

export default router;
