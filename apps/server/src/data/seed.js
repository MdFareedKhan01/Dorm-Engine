const studentNames = [
  'Rahul Sharma',
  'Meera Nair',
  'Arjun Kumar',
  'Priya Shah',
  'Karan Mehta',
  'Ananya Iyer',
  'Rohan Verma',
  'Sneha Patil',
  'Aditya Rao',
  'Nisha Kapoor',
  'Kabir Singh',
  'Tanya Das',
  'Vivek Joshi',
  'Sana Khan',
  'Ishaan Gupta',
  'Pooja Menon',
  'Dev Malhotra',
  'Neha Sethi',
  'Aman Chawla',
  'Fatima Ali',
  'Harsh Bansal',
  'Ritika Mehra',
  'Om Prakash',
  'Simran Kaur',
  'Mihir Jain',
];

const programCycle = [
  'B.Tech Computer Science',
  'B.Tech Electronics',
  'B.Tech Information Technology',
  'BBA',
  'BCA',
];

const blockCycle = ['Block C', 'Block C', 'Block A'];
const roomAssignmentCycle = ['304', '305', '112'];
const personalityCycle = [2, 1, 0, -1, -2, 1, 2, 0, -1, 1, 2, -2, 0, 1, -1, 2];
const yearCycle = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

function makePreferences(index) {
  const food = index % 2 === 0 ? 'veg' : 'non-veg';
  const time = index % 3 === 0 ? 'morning' : 'night';
  const room = index % 4 === 0 ? 'ac' : 'non-ac';
  const study = index % 2 === 0 ? 'solo' : 'group';
  const social = index % 3 === 0 ? 'outgoing' : 'reserved';

  return { food, time, room, study, social };
}

function makePersonality(index) {
  return Array.from({ length: 16 }, (_, step) => personalityCycle[(index + step) % personalityCycle.length]);
}

export const seedRooms = [
  { roomNumber: '304', block: 'C', capacity: 3, status: 'occupied', floor: '3rd', wifi: 'Available', ac: true },
  { roomNumber: '305', block: 'C', capacity: 3, status: 'occupied', floor: '3rd', wifi: 'Available', ac: true },
  { roomNumber: '112', block: 'A', capacity: 3, status: 'occupied', floor: '1st', wifi: 'Available', ac: true },
  { roomNumber: '201', block: 'B', capacity: 3, status: 'maintenance', floor: '2nd', wifi: 'Available', ac: false },
  { roomNumber: '410', block: 'D', capacity: 3, status: 'empty', floor: '4th', wifi: 'Available', ac: true },
];

export const seedStaff = [
  { name: 'Faizan Ali', role: 'maintenance', department: 'Plumber', activeTickets: 5, email: 'faizan@dormengine.com' },
  { name: 'Ahmad Khan', role: 'maintenance', department: 'Electrician', activeTickets: 3, email: 'ahmad@dormengine.com' },
  { name: 'Sarah Kim', role: 'maintenance', department: 'Sweeper', activeTickets: 4, email: 'sarah@dormengine.com' },
  { name: 'Ravi Iyer', role: 'maintenance', department: 'Mess Worker', activeTickets: 6, email: 'ravi@dormengine.com' },
  { name: 'Naveen Das', role: 'maintenance', department: 'Security Guard', activeTickets: 2, email: 'naveen@dormengine.com' },
];

export const seedNotices = [
  {
    title: 'Mess menu updated for exam week',
    body: 'Breakfast and dinner timings have been revised for the upcoming exam window.',
    type: 'general',
    targetBlock: 'all',
    badge: 'New',
    accent: 'warm',
  },
  {
    title: 'Water shutdown in Block B',
    body: 'Maintenance work will take place tomorrow from 10 AM to 1 PM.',
    type: 'emergency',
    targetBlock: 'B',
    badge: 'Urgent',
    accent: 'status',
  },
  {
    title: 'Hostel quiet hours reminder',
    body: 'Please maintain silence after 10 PM across all blocks.',
    type: 'policy',
    targetBlock: 'all',
    badge: 'Policy',
    accent: 'feedback',
  },
  {
    title: 'Room allocation review session',
    body: 'Warden office will review pending room allocations every Friday afternoon.',
    type: 'general',
    targetBlock: 'all',
    badge: 'Update',
    accent: 'warm',
  },
  {
    title: 'Library night access extended',
    body: 'Library hours are extended till 11 PM during mid-semester week.',
    type: 'policy',
    targetBlock: 'all',
    badge: 'Info',
    accent: 'feedback',
  },
];

export const seedComplaints = [
  {
    studentEmail: 'rahul.sharma@dormengine.com',
    roomNumber: '304',
    block: 'C',
    category: 'Electrical',
    subject: 'AC not cooling properly',
    description: 'AC in Room 304 is not maintaining temperature. Needs inspection.',
    status: 'open',
    priority: 'high',
    assignedTo: 'Electrical Team',
    mlProcessed: true,
    isSpam: false,
  },
  {
    studentEmail: 'meera.nair@dormengine.com',
    roomNumber: '305',
    block: 'C',
    category: 'Plumbing',
    subject: 'Water leakage under sink',
    description: 'Leak below the sink is causing a wet floor in Block C.',
    status: 'in_progress',
    priority: 'medium',
    assignedTo: 'Plumbing Team',
    mlProcessed: true,
    isSpam: false,
  },
  {
    studentEmail: 'arjun.kumar@dormengine.com',
    roomNumber: '112',
    block: 'A',
    category: 'Housekeeping',
    subject: 'Corridor not cleaned',
    description: 'Common corridor near room 112 has not been cleaned today.',
    status: 'open',
    priority: 'low',
    assignedTo: '',
    mlProcessed: true,
    isSpam: false,
  },
  {
    studentEmail: 'priya.shah@dormengine.com',
    roomNumber: '201',
    block: 'B',
    category: 'Security',
    subject: 'Gate light flickering',
    description: 'Security gate lights near Block B are flickering at night.',
    status: 'resolved',
    priority: 'medium',
    assignedTo: 'Security Team',
    mlProcessed: true,
    isSpam: false,
  },
  {
    studentEmail: 'karan.mehta@dormengine.com',
    roomNumber: '410',
    block: 'D',
    category: 'General',
    subject: 'WiFi disconnecting frequently',
    description: 'Connectivity drops every evening in Block D common area.',
    status: 'open',
    priority: 'medium',
    assignedTo: '',
    mlProcessed: true,
    isSpam: false,
  },
];

export const seedMaintenance = [
  { complaintSubject: 'AC not cooling properly', status: 'assigned', notes: 'Check leak under sink', dueDate: new Date(), assignedTo: 'Maintenance Team' },
  { complaintSubject: 'Water leakage under sink', status: 'pending', notes: 'Replace corridor light fitting', dueDate: new Date(), assignedTo: '' },
  { complaintSubject: 'Corridor not cleaned', status: 'assigned', notes: 'Deep clean corridor before evening', dueDate: new Date(), assignedTo: 'Housekeeping Team' },
  { complaintSubject: 'Gate light flickering', status: 'done', notes: 'Replace faulty bulb at gate', dueDate: new Date(), assignedTo: 'Security Team' },
  { complaintSubject: 'WiFi disconnecting frequently', status: 'pending', notes: 'Inspect router load on Block D', dueDate: new Date(), assignedTo: '' },
];

export const seedStudents = studentNames.map((name, index) => {
  const roomNumber = index < 9 ? roomAssignmentCycle[Math.floor(index / 3)] : '';
  const block = index < 9 ? blockCycle[Math.floor(index / 3)] : `Block ${['C', 'B', 'A', 'D'][index % 4]}`;
  const emailName = name.toLowerCase().replace(/[^a-z]+/g, '.').replace(/^\.|\.$/g, '');

  return {
    name,
    email: `${emailName}@dormengine.com`,
    password: 'Seed@12345',
    rollNumber: `STU${String(1001 + index).padStart(4, '0')}`,
    program: programCycle[index % programCycle.length],
    year: yearCycle[index % yearCycle.length],
    block,
    roomNumber,
    role: 'student',
    personalityAnswers: makePersonality(index),
    personalityType: ['INFJ', 'INTP', 'ESTJ', 'ENFP', 'ISFJ'][index % 5],
    preferences: makePreferences(index),
    isAssigned: index < 9,
    feeStatus: index % 4 === 0 ? 'pending' : 'paid',
    profileComplete: true,
  };
});

export const feeSummary = {
  totalCollected: 438000,
  pending: 52000,
  monthly: [
    { month: 'Nov', amount: 70000, paid: true },
    { month: 'Dec', amount: 72000, paid: true },
    { month: 'Jan', amount: 68000, paid: true },
    { month: 'Feb', amount: 76000, paid: true },
    { month: 'Mar', amount: 76000, paid: false },
    { month: 'Apr', amount: 76000, paid: false },
  ],
};
