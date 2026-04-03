import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleGate({ allow, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="center-screen"><div className="spinner" /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allow && !allow.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/warden/dashboard' : '/student/dashboard'} replace />;
  }

  return children;
}
