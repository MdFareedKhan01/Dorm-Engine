import { Link, NavLink } from 'react-router-dom';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

const items = [
  { to: '/student/dashboard', label: 'Dashboard', icon: <DashboardRoundedIcon /> },
  { to: '/student/roommate', label: 'Roommate', icon: <GroupRoundedIcon /> },
  { to: '/student/mess', label: 'Mess', icon: <RestaurantMenuRoundedIcon /> },
  { to: '/student/notices', label: 'Notices', icon: <NotificationsRoundedIcon /> },
  { to: '/student/complaints', label: 'Complaints', icon: <ReportProblemRoundedIcon /> },
  { to: '/student/fees', label: 'Fee Payments', icon: <ReceiptLongRoundedIcon /> },
];

export default function StudentSidebar() {
  return (
    <aside className="sidebar student-sidebar">
      <Link to="/" className="sidebar-brand sidebar-brand-link" aria-label="Go to home page">
        <div className="brand-mark">
          <HomeRoundedIcon fontSize="small" />
        </div>
        <div>
          <p className="brand-title">DormEngine</p>
          <p className="brand-subtitle">Student Portal</p>
        </div>
      </Link>

      <nav className="sidebar-nav">
        <div className="nav-label">Student</div>
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
