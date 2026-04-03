import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const studentLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/personality', label: 'Personality' },
  { to: '/preferences', label: 'Preferences' },
  { to: '/best-match', label: 'Best Match' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/complaints', label: 'Complaints' },
  { to: '/maintenance', label: 'Maintenance' },
  { to: '/notices', label: 'Notices' },
  { to: '/fees', label: 'Fees' },
];

const adminLinks = [
  { to: '/admin', label: 'Admin Dashboard' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/complaints', label: 'Complaints' },
  { to: '/maintenance', label: 'Maintenance' },
  { to: '/notices', label: 'Notices' },
  { to: '/fees', label: 'Fees' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className="sidebar">
      <div className="brand">DormEngine</div>
      <nav className="side-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p className="small-muted">{user?.name || 'Guest'}</p>
        <button className="btn ghost" type="button" onClick={logout}>
          Logout
        </button>
      </div>
    </aside>
  );
}
