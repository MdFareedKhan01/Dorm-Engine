import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useAuth } from '../context/AuthContext';

export default function ProfileMenu({ variant = 'student' }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  const handleRetakeTest = () => {
    navigate('/student/personality');
    setOpen(false);
  };

  const handleProfile = () => {
    navigate(variant === 'admin' ? '/warden/settings' : '/student/profile');
    setOpen(false);
  };

  const handleSettings = () => {
    navigate('/warden/settings');
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <div className="profile-menu-wrapper" ref={menuRef}>
      <button
        type="button"
        className="icon-button profile-menu-trigger"
        onClick={() => setOpen(!open)}
        aria-label="Profile menu"
      >
        <PersonRoundedIcon />
      </button>

      {open && (
        <div className="profile-menu-dropdown">
          <div className="profile-menu-header">
            <div className="profile-avatar">{getInitials(user?.name)}</div>
            <div className="profile-menu-identity">
              <p className="profile-name">{user?.name || 'Student'}</p>
              <p className="profile-meta">{user?.email || 'student@dorm.edu'}</p>
              <span className="profile-role-pill">{variant === 'admin' ? 'Admin Access' : 'Student Access'}</span>
            </div>
          </div>

          <div className="profile-menu-body">
            <div className="profile-menu-group">
              <button type="button" className="profile-menu-item" onClick={handleProfile}>
                <BadgeRoundedIcon fontSize="small" />
                <span>{variant === 'admin' ? 'Settings' : 'Profile'}</span>
              </button>

              {variant === 'student' ? (
                <button type="button" className="profile-menu-item" onClick={handleRetakeTest}>
                  <RefreshRoundedIcon fontSize="small" />
                  <span>Retake Tests</span>
                </button>
              ) : (
                <button type="button" className="profile-menu-item" onClick={handleSettings}>
                  <RefreshRoundedIcon fontSize="small" />
                  <span>System Settings</span>
                </button>
              )}
            </div>

            <div className="profile-menu-divider" />

            <div className="profile-menu-group">
              <button type="button" className="profile-menu-item logout" onClick={handleLogout}>
                <LogoutRoundedIcon fontSize="small" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'S';
}
