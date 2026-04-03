export const onboardingSteps = [
  { key: 'personality', label: 'Step 1: Personality Test' },
  { key: 'preferences', label: 'Step 2: Preferences' },
];

export const personalityQuestions = [
  'I feel energized after spending time with a group.',
  'I enjoy being the center of attention.',
  'I prefer discussing ideas out loud.',
  'I actively seek social interaction.',
  'I prefer practical facts over abstract theories.',
  'I focus on details more than big picture ideas.',
  'I trust experience over intuition.',
  'I prefer step-by-step instructions.',
  'I make decisions based on logic.',
  'I stay calm when giving direct feedback.',
];

export const agreementOptions = [
  { value: 2, label: 'Strongly Agree' },
  { value: 1, label: 'Agree' },
  { value: 0, label: 'Neutral' },
  { value: -1, label: 'Disagree' },
  { value: -2, label: 'Strongly Disagree' },
];

export const preferenceGroups = [
  {
    key: 'food',
    label: 'Food Preference',
    options: [
      { value: 'veg', label: 'Veg' },
      { value: 'non-veg', label: 'Non-Veg' },
    ],
  },
  {
    key: 'time',
    label: 'Preferred Time',
    options: [
      { value: 'morning', label: 'Morning' },
      { value: 'night', label: 'Night' },
    ],
  },
  {
    key: 'room',
    label: 'Room Type',
    options: [
      { value: 'ac', label: 'AC' },
      { value: 'non-ac', label: 'Non-AC' },
    ],
  },
  {
    key: 'study',
    label: 'Study Style',
    options: [
      { value: 'group', label: 'Group' },
      { value: 'solo', label: 'Solo' },
    ],
  },
  {
    key: 'social',
    label: 'Social Preference',
    options: [
      { value: 'outgoing', label: 'Outgoing' },
      { value: 'reserved', label: 'Reserved' },
    ],
  },
];

export const studentHomeCards = [
  {
    key: 'personality',
    title: 'Discover Your Own Personality',
    description:
      'Answer a short set of questions to understand your preferences, strengths, and compatibility. This helps us allocate rooms where you will feel comfortable and thrive during your stay.',
    icon: '📝',
    action: 'Start Personality Test',
    to: '/student/personality',
  },
  {
    key: 'preferences',
    title: 'Select Your Room Preferences',
    description:
      'Choose your preferred room type, food preferences, study time preferences, music choices, amenities, and lifestyle options. We match these with your profile to suggest the best fit for you.',
    icon: '🛏️',
    action: 'Set Preferences',
    to: '/student/preferences',
  },
];

export const messMenu = [
  { slot: 'Breakfast', days: ['Idli-Vada', 'Paneer', 'Vada Pav', 'Chicken Changezi', 'Chicken 65', 'Chicken 65', 'Chicken 65'] },
  { slot: 'Lunch', days: ['Chicken', 'Paneer', 'Rajma', 'Paneer', 'Chicken', 'Chicken', 'Paneer'] },
  { slot: 'Dinner', days: ['Biryani', 'Biryani', 'Paneer', 'Afghani Chicken', 'Chicken', 'Rajma', 'Murg Musallam'] },
];

export const notices = [
  {
    title: 'WiFi Router Upgrade In Progress',
    body: 'Upgrade work is being done to improve WiFi connectivity. Expect intermittent network outages.',
    badge: 'IN PROGRESS',
    accent: 'status',
  },
  {
    title: 'Fire Drill Scheduled for Tomorrow',
    body: 'A mandatory fire drill will be conducted tomorrow at 11 AM. Please participate accordingly.',
    badge: 'REMINDER',
    accent: 'warm',
  },
  {
    title: 'Dining Hall Timings Change',
    body: 'Mid-semester exams hall will open at 8 AM instead of 7 AM this week due to administrative reasons.',
    badge: 'REMINDER',
    accent: 'warm',
  },
  {
    title: 'Roommate Feedback Window',
    body: 'Your roommate was assigned according to your preferences. Submit feedback after two weeks to improve future matches.',
    badge: 'FEEDBACK',
    accent: 'feedback',
  },
];

export const complaintSamples = [
  {
    title: 'AC Not Cooling Properly',
    body: 'AC in room 204 is not maintaining temperature 25°C even at max setting.',
    status: 'Pending',
    date: 'Submitted Mar 10, 2023',
  },
  {
    title: 'Water Leakage in Bathroom',
    body: 'Pipe under the sink was leaking and has been fixed within 24 hours.',
    status: 'Pending',
    date: 'Submitted Feb 6, 2023',
  },
  {
    title: 'Corridor Light Flickering',
    body: 'The tube light near room 304 entry flickers at night causing inconvenience.',
    status: 'Resolved',
    date: 'Submitted Jan 22, 2023',
  },
  {
    title: 'WiFi Disconnecting Frequently',
    body: 'WiFi drops every 30-40 minutes on the C-Wing 3rd floor.',
    status: 'Resolved',
    date: 'Submitted Mar 20, 2023',
  },
  {
    title: 'Broken Bed Frame',
    body: 'Sub: AC in Room 201 not maintaining temperature 25°C.',
    status: 'Resolved',
    date: 'Submitted Jan 15, 2023',
  },
  {
    title: 'Pest Control Needed',
    body: 'AC in Room 201 not maintaining temperature 25°C.',
    status: 'Pending',
    date: 'Submitted Mar 10, 2023',
  },
];

export const roomSummary = {
  roomNumber: '306',
  roomLabel: 'Block C-3rd Floor-AC-3-sharing',
  roommates: ['RS', 'PM'],
  roommatesText: 'Rohan S. & Prateek M.',
  wifi: 'WiFi connected',
  checkIn: 'Check-in: Aug 2023',
  status: 'Active',
};
