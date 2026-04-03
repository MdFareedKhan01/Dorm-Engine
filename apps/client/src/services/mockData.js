export const mockUser = {
  id: 'student-1',
  name: 'Aarav Khan',
  email: 'aarav@example.com',
  role: 'student',
  personalityType: 'INTJ',
  preferencesSet: true,
  roomNumber: 'B-204',
};

export const mockAdmin = {
  id: 'admin-1',
  name: 'Warden Admin',
  email: 'admin@dormengine.local',
  role: 'admin',
};

export const mockNotices = [
  {
    id: 'n-1',
    title: 'Water Supply Maintenance',
    body: 'Water supply will be unavailable in Block B from 10:00 AM to 12:00 PM tomorrow.',
    type: 'general',
    targetBlock: 'B',
    createdAt: '2026-04-01T09:00:00.000Z',
  },
  {
    id: 'n-2',
    title: 'Night Curfew Reminder',
    body: 'Curfew starts at 10:30 PM. Entry after that requires prior permission.',
    type: 'policy',
    targetBlock: 'all',
    createdAt: '2026-03-29T16:40:00.000Z',
  },
];

export const mockComplaints = [
  {
    id: 'c-1',
    text: 'Fan in room is making loud noise and stops intermittently.',
    category: 'electrical',
    priority: 'medium',
    status: 'in_progress',
    createdAt: '2026-04-02T10:30:00.000Z',
    roomNumber: 'B-204',
  },
  {
    id: 'c-2',
    text: 'Washroom tap leakage causing water overflow.',
    category: 'plumbing',
    priority: 'high',
    status: 'open',
    createdAt: '2026-04-03T06:10:00.000Z',
    roomNumber: 'B-204',
  },
];

export const mockMaintenance = [
  {
    id: 'm-1',
    complaintId: 'c-1',
    status: 'assigned',
    dueDate: '2026-04-05T12:00:00.000Z',
    assignedTo: 'Electric Team - 2',
    notes: 'Part ordered, replacement pending',
  },
  {
    id: 'm-2',
    complaintId: 'c-2',
    status: 'pending',
    dueDate: '2026-04-04T12:00:00.000Z',
    assignedTo: 'Plumbing Team - 1',
    notes: 'Inspection scheduled',
  },
];

export const mockRooms = [
  {
    id: 'r-1',
    roomNumber: 'B-204',
    block: 'B',
    capacity: 2,
    status: 'occupied',
    compatibilityScore: 87,
    students: ['Aarav Khan', 'Rahul Sharma'],
  },
  {
    id: 'r-2',
    roomNumber: 'A-112',
    block: 'A',
    capacity: 2,
    status: 'empty',
    compatibilityScore: 0,
    students: [],
  },
];

export const mockBestMatch = {
  id: 'student-2',
  name: 'Rahul Sharma',
  personalityType: 'INFJ',
  compatibility: 91,
  preferenceScore: 6,
  matchingPreferences: ['early sleeper', 'quiet study', 'cleanliness', 'vegetarian', 'music: low'],
};
