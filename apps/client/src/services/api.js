import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('de_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const mapError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'Request failed';
};

export async function signup(payload) {
  const { data } = await http.post('/api/auth/signup', payload);
  return data;
}

export async function login(payload) {
  const { data } = await http.post('/api/auth/login', payload);
  return data;
}

export async function getMyProfile() {
  const { data } = await http.get('/api/students/me');
  return data;
}

export async function fetchAdminOverview() {
  const { data } = await http.get('/api/admin/overview');
  return data;
}

export async function fetchAdminStudents() {
  const { data } = await http.get('/api/students');
  return data;
}

export async function fetchAdminStudentStats() {
  const { data } = await http.get('/api/students/stats');
  return data;
}

export async function createAdminStudent(payload) {
  const { data } = await http.post('/api/students', payload);
  return data;
}

export async function fetchAdminStaff() {
  const { data } = await http.get('/api/staff');
  return data;
}

export async function createAdminStaff(payload) {
  const { data } = await http.post('/api/staff', payload);
  return data;
}

export async function updateAdminStaff(staffId, payload) {
  const { data } = await http.put(`/api/staff/${staffId}`, payload);
  return data;
}

export async function updateMyProfile(payload) {
  const { data } = await http.put('/api/students/me', payload);
  return data;
}

export async function submitPersonality(payload) {
  const { data } = await http.post('/api/students/personality', payload);
  return data;
}

export async function submitPreferences(payload) {
  const { data } = await http.post('/api/students/preferences', payload);
  return data;
}

export async function fetchBestMatch() {
  const { data } = await http.get('/api/students/best-match');
  return data;
}

export async function fetchRoommates() {
  const { data } = await http.get('/api/students/roommates');
  return data;
}

export async function submitRoommateFeedback(payload) {
  const { data } = await http.post('/api/students/roommate-feedback', payload);
  return data;
}

export async function confirmRoommate(payload) {
  const { data } = await http.post('/api/students/confirm-room', payload);
  return data;
}

export async function fetchRooms() {
  const { data } = await http.get('/api/rooms');
  return data;
}

export async function fetchRoomStats() {
  const { data } = await http.get('/api/rooms/stats');
  return data;
}

export async function fetchComplaintsMine() {
  const { data } = await http.get('/api/complaints/mine');
  return data;
}

export async function fetchComplaintsAll(params = {}) {
  const { data } = await http.get('/api/complaints', { params });
  return data;
}

export async function createComplaint(payload) {
  const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
  const { data } = await http.post('/api/complaints', payload, isFormData ? {
    headers: { 'Content-Type': 'multipart/form-data' },
  } : undefined);
  return data;
}

export async function updateComplaintStatus(complaintId, payload) {
  const { data } = await http.put(`/api/complaints/${complaintId}/status`, payload);
  return data;
}

export async function fetchMaintenanceTickets() {
  const { data } = await http.get('/api/maintenance');
  return data;
}

export async function fetchNotices() {
  const { data } = await http.get('/api/notices');
  return data;
}

export async function fetchPersonalUpdates() {
  const [noticesResponse, complaintsResponse] = await Promise.all([
    http.get('/api/notices'),
    http.get('/api/complaints/mine'),
  ]);

  return {
    notices: noticesResponse.data?.notices || [],
    complaints: complaintsResponse.data?.complaints || [],
  };
}

export async function createNotice(payload) {
  const { data } = await http.post('/api/notices', payload);
  return data;
}

export async function fetchFeesSummary() {
  const { data } = await http.get('/api/fees/summary');
  return data;
}

export async function createMessFeedback(payload) {
  const { data } = await http.post('/api/mess/feedback', payload);
  return data;
}

export async function fetchMyMessFeedback() {
  const { data } = await http.get('/api/mess/feedback/mine');
  return data;
}

export { mapError };
