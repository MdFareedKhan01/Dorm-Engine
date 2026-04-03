import bcrypt from 'bcryptjs';
import Student from './models/Student.js';
import Staff from './models/Staff.js';
import Room from './models/Room.js';
import Notice from './models/Notice.js';
import Complaint from './models/Complaint.js';
import MaintenanceTicket from './models/MaintenanceTicket.js';
import { seedStudents, seedStaff, seedRooms, seedNotices, seedComplaints, seedMaintenance } from './data/seed.js';

const ADMIN_EMAIL = 'admin@dormengine.com';
const ADMIN_PASSWORD = 'Admin@12345';

async function upsertStudent(student) {
  const hashedPassword = await bcrypt.hash(student.password || 'Student@12345', 10);
  const payload = { ...student, password: hashedPassword };
  await Student.updateOne(
    { email: student.email },
    { $setOnInsert: payload },
    { upsert: true }
  );
}

async function upsertStaff(member) {
  await Staff.updateOne(
    { email: member.email },
    { $setOnInsert: member },
    { upsert: true }
  );
}

export async function seedDatabase() {
  const hashedAdmin = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await Student.updateOne(
    { email: ADMIN_EMAIL },
    {
      $setOnInsert: {
        name: 'Dorm Admin',
        email: ADMIN_EMAIL,
        password: hashedAdmin,
        role: 'admin',
        rollNumber: 'ADMIN001',
        program: 'Administration',
        year: 'Staff',
        profileComplete: true,
      },
    },
    { upsert: true }
  );

  for (const student of seedStudents) {
    await upsertStudent(student);
  }

  for (const member of seedStaff) {
    await upsertStaff(member);
  }

  const allStudents = await Student.find({ role: 'student' }).sort({ createdAt: 1 });
  const studentByEmail = new Map(allStudents.map((student) => [student.email, student]));

  for (const room of seedRooms) {
    const assignedStudents = allStudents
      .filter((student) => student.roomNumber === room.roomNumber)
      .map((student) => student._id);

    const status = room.status === 'maintenance'
      ? 'maintenance'
      : assignedStudents.length >= room.capacity
        ? 'occupied'
        : assignedStudents.length > 0
          ? 'occupied'
          : 'empty';

    await Room.updateOne(
      { roomNumber: room.roomNumber },
      {
        $set: {
          ...room,
          status,
          students: assignedStudents,
        },
      },
      { upsert: true }
    );
  }

  for (const notice of seedNotices) {
    await Notice.updateOne(
      { title: notice.title },
      { $setOnInsert: notice },
      { upsert: true }
    );
  }

  for (const complaintSeed of seedComplaints) {
    const student = studentByEmail.get(complaintSeed.studentEmail);
    if (!student) {
      continue;
    }

    const payload = {
      studentId: student._id,
      roomNumber: complaintSeed.roomNumber,
      block: complaintSeed.block,
      category: complaintSeed.category,
      subject: complaintSeed.subject,
      description: complaintSeed.description,
      mediaUrl: complaintSeed.mediaUrl || '',
      isSpam: complaintSeed.isSpam || false,
      priority: complaintSeed.priority,
      status: complaintSeed.status,
      assignedTo: complaintSeed.assignedTo || '',
      mlProcessed: complaintSeed.mlProcessed || true,
    };

    await Complaint.updateOne(
      { roomNumber: complaintSeed.roomNumber, subject: complaintSeed.subject },
      { $setOnInsert: payload },
      { upsert: true }
    );
  }

  const complaints = await Complaint.find().sort({ createdAt: 1 });
  const complaintBySubject = new Map(complaints.map((complaint) => [complaint.subject, complaint]));

  for (const ticketSeed of seedMaintenance) {
    const complaint = complaintBySubject.get(ticketSeed.complaintSubject);
    if (!complaint) {
      continue;
    }

    await MaintenanceTicket.updateOne(
      { complaintId: complaint._id },
      {
        $setOnInsert: {
          complaintId: complaint._id,
          assignedTo: ticketSeed.assignedTo,
          status: ticketSeed.status,
          dueDate: ticketSeed.dueDate,
          notes: ticketSeed.notes,
        },
      },
      { upsert: true }
    );
  }
}

export { ADMIN_EMAIL, ADMIN_PASSWORD };
