import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { useEffect, useRef, useState } from 'react';
import ProfileMenu from './ProfileMenu';
import { fetchAdminOverview } from '../services/api';
import { getStoredTheme, toggleTheme } from '../utils/theme';
import { useAuth } from '../context/AuthContext';

export default function WardenTopbar() {
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => getStoredTheme());
  const [open, setOpen] = useState(false);
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
