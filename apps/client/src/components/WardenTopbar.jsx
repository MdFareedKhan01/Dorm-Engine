import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { fetchAdminOverview } from '../services/api';
import ProfileMenu from './ProfileMenu';
import { getStoredTheme, toggleTheme } from '../utils/theme';
import { useAuth } from '../context/AuthContext';

const items = [
  { to: '/warden/dashboard', label: 'Dashboard' },
  { to: '/warden/students', label: 'Students' },
  { to: '/warden/staff', label: 'Staff' },
  { to: '/warden/rooms', label: 'Rooms' },
  { to: '/warden/room-allocation', label: 'Room Allocation' },
  { to: '/warden/fees', label: 'Fees' },
  { to: '/warden/complaints', label: 'Complaints' },
  { to: '/warden/notices', label: 'Notices' },
  { to: '/warden/maintenance', label: 'Maintenance' },
  { to: '/warden/reports', label: 'Reports' },
  { to: '/warden/settings', label: 'Settings' },
];

export default function WardenTopbar() {
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => getStoredTheme());
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [overview, setOverview] = useState({ recentComplaints: [], recentNotices: [], recentMaintenance: [] });
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchAdminOverview().then(setOverview).catch(() => setOverview({ recentComplaints: [], recentNotices: [], recentMaintenance: [] }));
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const handleClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleThemeToggle = () => {
    setTheme((currentTheme) => toggleTheme(currentTheme));
  };

  const alerts = [
    ...overview.recentComplaints.slice(0, 2).map((item) => ({
      icon: <ReportProblemRoundedIcon fontSize="small" />,
      title: item.subject,
      detail: `${item.studentName} · ${item.roomNumber}`,
    })),
    ...overview.recentNotices.slice(0, 2).map((item) => ({
      icon: <CampaignRoundedIcon fontSize="small" />,
      title: item.title,
      detail: item.type || 'notice',
    })),
  ].slice(0, 4);

  return (
    <header className="topbar warden-topbar">
      <button
        type="button"
        className="mobile-menu-button"
        onClick={() => setDrawerOpen(true)}
        aria-label="Open navigation menu"
      >
        <MenuRoundedIcon />
      </button>

      {drawerOpen ? (
        <div className="mobile-drawer-backdrop" onClick={() => setDrawerOpen(false)}>
          <aside className="mobile-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="mobile-drawer-header">
              <Link to="/" className="sidebar-brand sidebar-brand-link" onClick={() => setDrawerOpen(false)}>
                <div className="brand-mark warden-mark">
                  <CloseRoundedIcon fontSize="small" />
                </div>
                <div>
                  <p className="brand-title">DormEngine</p>
                  <p className="brand-subtitle">Admin Portal</p>
                </div>
              </Link>
              <button type="button" className="mobile-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close navigation menu">
                <CloseRoundedIcon />
              </button>
            </div>
            <nav className="mobile-drawer-nav">
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setDrawerOpen(false)}
                >
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      ) : null}

      <div className="topbar-actions" ref={dropdownRef}>
        <button
          type="button"
          className="icon-button theme-toggle"
          onClick={handleThemeToggle}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
        </button>
        <button type="button" className="icon-button" onClick={() => setOpen((prev) => !prev)}>
          <NotificationsNoneRoundedIcon />
          {(alerts.length || overview.recentMaintenance.length) ? <span className="notify-dot" /> : null}
        </button>
        {open ? (
          <div className="updates-dropdown warden-updates-dropdown">
            <div className="updates-header">Admin Alerts</div>
            {alerts.length ? alerts.map((item, index) => (
              <div key={`${item.title}-${index}`} className="updates-item">
                <div className="updates-item-icon">{item.icon}</div>
                <div>
                  <p>{item.title}</p>
                  <span>{item.detail}</span>
                </div>
              </div>
            )) : <p className="updates-empty">No alerts right now.</p>}
          </div>
        ) : null}
        <div className="warden-profile-block">
          <div className="topbar-profile">
            <div className="profile-avatar small">{getInitials(user?.name)}</div>
            <div>
              <p className="profile-name">{user?.name || 'Admin'}</p>
              <p className="profile-meta">System Administrator</p>
            </div>
          </div>
          <ProfileMenu variant="admin" />
        </div>
      </div>
    </header>
  );
}

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'A';
}
