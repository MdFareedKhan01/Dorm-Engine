import { useAuth } from '../context/AuthContext';

export default function Topbar({ title }) {
  const { user } = useAuth();

  return (
    <header className="topbar">
      <div>
        <h1 className="page-title">{title}</h1>
        <p className="small-muted">Welcome back, {user?.name || 'Student'}</p>
      </div>
    </header>
  );
}
