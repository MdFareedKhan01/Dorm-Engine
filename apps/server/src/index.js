import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import Student from './models/Student.js';
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';
import roomRoutes from './routes/rooms.js';
import complaintRoutes from './routes/complaints.js';
import noticeRoutes from './routes/notices.js';
import maintenanceRoutes from './routes/maintenance.js';
import staffRoutes from './routes/staff.js';
import adminRoutes from './routes/admin.js';
import feeRoutes from './routes/fees.js';
import messRoutes from './routes/mess.js';
import { seedDatabase, ADMIN_EMAIL, ADMIN_PASSWORD } from './seed.js';

const currentFile = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFile);

dotenv.config({ path: resolve(currentDir, '../.env') });

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(resolve(currentDir, '../uploads')));

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await seedDatabase();
    const users = await Student.find({}, 'name email role roomNumber block isAssigned').sort({ createdAt: 1 }).lean();
    console.table(users.map((user) => ({
      name: user.name,
      email: user.email,
      role: user.role,
      room: user.roomNumber || '-',
      block: user.block || '-',
      assigned: user.isAssigned ? 'yes' : 'no',
    })));
    console.log(`Seeded admin login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'DormEngine API running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/mess', messRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});