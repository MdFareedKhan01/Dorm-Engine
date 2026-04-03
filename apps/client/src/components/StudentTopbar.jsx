import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { fetchPersonalUpdates } from '../services/api';
import ProfileMenu from './ProfileMenu';
import { getStoredTheme, toggleTheme } from '../utils/theme';

const items = [
  { to: '/student/dashboard', label: 'Dashboard' },
  { to: '/student/roommate', label: 'Roommate' },
  { to: '/student/mess', label: 'Mess' },
  { to: '/student/notices', label: 'Notices' },
  { to: '/student/complaints', label: 'Complaints' },
  { to: '/student/fees', label: 'Fee Payments' },
];

export default function StudentTopbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [updates, setUpdates] = useState({ notices: [], complaints: [] });
  const [theme, setTheme] = useState(() => getStoredTheme());
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchPersonalUpdates().then(setUpdates).catch(() => setUpdates({ notices: [], complaints: [] }));
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

  const pendingComplaints = updates.complaints.filter((item) => item.status !== 'resolved').slice(0, 3);
  const latestNotices = updates.notices.slice(0, 3);

  const handleThemeToggle = () => {
    setTheme((currentTheme) => toggleTheme(currentTheme));
  };

  return (
    <header className="topbar student-topbar">
      <Link to="/student/dashboard" className="mobile-topbar-brand" aria-label="Go to student dashboard">
        <div className="brand-mark">
          <HomeRoundedIcon fontSize="small" />
        </div>
        <div>
          <p className="brand-title">DormEngine</p>
          <p className="brand-subtitle">Student Portal</p>
        </div>
      </Link>

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
                <div className="brand-mark">
                  <HomeRoundedIcon fontSize="small" />
                </div>
                <div>
                  <p className="brand-title">DormEngine</p>
                  <p className="brand-subtitle">Student Portal</p>
                </div>
              </Link>
              <button type="button" className="mobile-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close navigation menu">
                <CloseRoundedIcon />
              </button>
            </div>
            <div className="mobile-drawer-tools">
              <button
                type="button"
                className="icon-button theme-toggle"
                onClick={handleThemeToggle}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
              </button>
              <button
                type="button"
                className="icon-button"
                onClick={() => {
                  setDrawerOpen(false);
                  navigate('/student/notices');
                }}
                aria-label="Open notices"
              >
                <NotificationsNoneRoundedIcon />
                {(latestNotices.length + pendingComplaints.length) ? <span className="notify-dot" /> : null}
              </button>
              <ProfileMenu />
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
          {(latestNotices.length + pendingComplaints.length) ? <span className="notify-dot" /> : null}
        </button>
        {open ? (
          <div className="updates-dropdown">
            <div className="updates-header">Personal Updates & Notices</div>
            <div className="updates-section-title">Personal Updates</div>
            {pendingComplaints.length ? pendingComplaints.map((item) => (
              <div key={item._id || item.subject} className="updates-item">
                <ReportProblemRoundedIcon fontSize="small" />
                <div>
                  <p>{item.subject}</p>
                  <span>{item.status?.replace('_', ' ') || 'open'}</span>
                </div>
              </div>
            )) : <p className="updates-empty">No personal updates.</p>}

            <div className="updates-section-title">General Notices</div>
            {latestNotices.length ? latestNotices.map((item) => (
              <div key={item._id || item.title} className="updates-item">
                <CampaignRoundedIcon fontSize="small" />
                <div>
                  <p>{item.title}</p>
                  <span>{item.type || 'general'}</span>
                </div>
              </div>
            )) : <p className="updates-empty">No notices available.</p>}
          </div>
        ) : null}
        <ProfileMenu />
      </div>
    </header>
  );
}
