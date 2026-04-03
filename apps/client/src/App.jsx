import { Navigate, Route, Routes } from 'react-router-dom';
import RoleGate from './components/RoleGate';
import AuthPage from './pages/auth/AuthPage';
import StudentPersonality from './pages/student/Personality';
import StudentPreferences from './pages/student/Preferences';
import StudentDashboard from './pages/student/Dashboard';
import StudentRoommate from './pages/student/Roommate';
import StudentNotices from './pages/student/Notices';
import StudentComplaints from './pages/student/Complaints';
import StudentMess from './pages/student/Mess';
import StudentFees from './pages/student/Fees';
import StudentProfile from './pages/student/Profile';
import StudentLayout from './layouts/StudentLayout';
import WardenDashboard from './pages/warden/Dashboard';
import WardenStudents from './pages/warden/Students';
import WardenStaff from './pages/warden/Staff';
import WardenRooms from './pages/warden/Rooms';
import WardenAllocation from './pages/warden/Allocation';
import WardenFees from './pages/warden/Fees';
import WardenComplaints from './pages/warden/Complaints';
import WardenNotices from './pages/warden/Notices';
import WardenMaintenance from './pages/warden/Maintenance';
import WardenReports from './pages/warden/Reports';
import WardenSettings from './pages/warden/Settings';
import NotFound from './pages/NotFound';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="center-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? (user.role === 'admin' ? <Navigate to="/warden/dashboard" replace /> : <Navigate to="/student/dashboard" replace />) : <Navigate to="/login" replace />} />
      <Route path="/dashboard" element={<Navigate to={user ? (user.role === 'admin' ? '/warden/dashboard' : '/student/dashboard') : '/login'} replace />} />
      <Route path="/login" element={<AuthPage mode="login" role="student" />} />
      <Route path="/signup" element={<AuthPage mode="signup" role="student" />} />
      <Route path="/warden/login" element={<AuthPage mode="login" role="admin" />} />

      <Route path="/student/home" element={<Navigate to="/student/dashboard" replace />} />
      <Route path="/student/personality" element={<RoleGate allow={['student']}><StudentPersonality /></RoleGate>} />
      <Route path="/student/preferences" element={<RoleGate allow={['student']}><StudentPreferences /></RoleGate>} />

      <Route path="/student" element={<RoleGate allow={['student']}><StudentLayout /></RoleGate>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="roommate" element={<StudentRoommate />} />
        <Route path="notices" element={<StudentNotices />} />
        <Route path="complaints" element={<StudentComplaints />} />
        <Route path="mess" element={<StudentMess />} />
        <Route path="fees" element={<StudentFees />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      <Route path="/warden/dashboard" element={<RoleGate allow={['admin']}><WardenDashboard /></RoleGate>} />
      <Route path="/warden/students" element={<RoleGate allow={['admin']}><WardenStudents /></RoleGate>} />
      <Route path="/warden/staff" element={<RoleGate allow={['admin']}><WardenStaff /></RoleGate>} />
      <Route path="/warden/rooms" element={<RoleGate allow={['admin']}><WardenRooms /></RoleGate>} />
      <Route path="/warden/room-allocation" element={<RoleGate allow={['admin']}><WardenAllocation /></RoleGate>} />
      <Route path="/warden/fees" element={<RoleGate allow={['admin']}><WardenFees /></RoleGate>} />
      <Route path="/warden/complaints" element={<RoleGate allow={['admin']}><WardenComplaints /></RoleGate>} />
      <Route path="/warden/notices" element={<RoleGate allow={['admin']}><WardenNotices /></RoleGate>} />
      <Route path="/warden/maintenance" element={<RoleGate allow={['admin']}><WardenMaintenance /></RoleGate>} />
      <Route path="/warden/reports" element={<RoleGate allow={['admin']}><WardenReports /></RoleGate>} />
      <Route path="/warden/settings" element={<RoleGate allow={['admin']}><WardenSettings /></RoleGate>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
