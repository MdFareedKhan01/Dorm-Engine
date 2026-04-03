import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { useEffect, useRef, useState } from 'react';
import { fetchPersonalUpdates } from '../services/api';
import ProfileMenu from './ProfileMenu';
import { getStoredTheme, toggleTheme } from '../utils/theme';

export default function StudentTopbar() {
  const [open, setOpen] = useState(false);
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
