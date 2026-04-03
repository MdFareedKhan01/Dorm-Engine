import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <section className="auth-hero">
        <p className="kicker">DormEngine</p>
        <h1>Hostel operations, roommate matching, and student support in one place.</h1>
        <p className="small-muted">
          Student login example: any email/password. Admin login example: email containing "admin".
        </p>
      </section>
      <section className="auth-card">
        <h2>Login</h2>
        {error ? <p className="error">{error}</p> : null}
        <form onSubmit={handleSubmit} className="stack-12">
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="small-muted mt-12">
          New user? <Link to="/signup">Create account</Link>
        </p>
      </section>
    </div>
  );
}
