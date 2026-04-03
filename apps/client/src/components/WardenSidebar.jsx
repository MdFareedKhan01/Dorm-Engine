import { NavLink } from 'react-router-dom';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import GroupWorkRoundedIcon from '@mui/icons-material/GroupWorkRounded';
import DoorFrontRoundedIcon from '@mui/icons-material/DoorFrontRounded';
import CallSplitRoundedIcon from '@mui/icons-material/CallSplitRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import EngineeringRoundedIcon from '@mui/icons-material/EngineeringRounded';
import SummarizeRoundedIcon from '@mui/icons-material/SummarizeRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';

const items = [
  { to: '/warden/dashboard', label: 'Dashboard', icon: <DashboardRoundedIcon /> },
  { to: '/warden/students', label: 'Students', icon: <PeopleAltRoundedIcon /> },
  { to: '/warden/staff', label: 'Staff', icon: <GroupWorkRoundedIcon /> },
  { to: '/warden/rooms', label: 'Rooms', icon: <DoorFrontRoundedIcon /> },
  { to: '/warden/room-allocation', label: 'Room Allocation', icon: <CallSplitRoundedIcon /> },
  { to: '/warden/fees', label: 'Fees', icon: <ReceiptLongRoundedIcon /> },
  { to: '/warden/complaints', label: 'Complaints', icon: <ReportProblemRoundedIcon /> },
  { to: '/warden/notices', label: 'Notices', icon: <NotificationsRoundedIcon /> },
  { to: '/warden/maintenance', label: 'Maintenance', icon: <EngineeringRoundedIcon /> },
  { to: '/warden/reports', label: 'Reports', icon: <SummarizeRoundedIcon /> },
  { to: '/warden/settings', label: 'Settings', icon: <SettingsRoundedIcon /> },
];

export default function WardenSidebar() {
  return (
    <aside className="sidebar warden-sidebar">
      <div className="sidebar-brand warden-brand">
        <div className="brand-mark warden-mark">
          <AdminPanelSettingsRoundedIcon fontSize="small" />
        </div>
        <div>
          <p className="brand-title">DormEngine</p>
          <p className="brand-subtitle">Admin Portal</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-label">Admin</div>
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
