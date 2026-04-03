import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import GoogleIcon from '@mui/icons-material/Google';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import { useAuth } from '../../context/AuthContext';

export default function AuthPage({ mode = 'login', role = 'student' }) {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [activeMode, setActiveMode] = useState(mode);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isSignup = activeMode === 'signup';
  const isWarden = role === 'admin';

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = isSignup ? await signup(form) : await login(form.email, form.password);
      if (user.role === 'admin') {
        navigate('/warden/dashboard');
      } else if (isSignup) {
        navigate('/student/personality');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Unable to continue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <section className="auth-visual">
        <div className="auth-brand-row">
          <div className="auth-brand-mark"><HomeRoundedIcon fontSize="small" /></div>
          <div>
            <p className="brand-title large">DormEngine</p>
            <p className="brand-subtitle">{isWarden ? 'Warden access' : 'Student portal'}</p>
          </div>
        </div>

        <h1 className="auth-heading">
          {isSignup ? 'Create your smart hostel profile.' : 'Welcome to Smart Room Allocation'}
        </h1>
        <p className="auth-copy">
          {isWarden
            ? 'Manage rooms, complaints, notices, and maintenance from a structured admin workspace.'
            : 'Track personality, preferences, roommate matches, mess schedules, notices, and service requests in one place.'}
        </p>

        <div className="auth-hero-card">
          <div className="auth-hero-icon"><ShieldRoundedIcon /></div>
          <div>
            <p className="auth-hero-title">{isWarden ? 'Admin Grade Control' : 'Student Friendly Flow'}</p>
            <p className="auth-hero-text">
              {isWarden
                ? 'Role-based access, clean queues, and room operations at a glance.'
                : 'A calm, consistent interface that mirrors the prototype screens.'}
            </p>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card-wrap">
          <div className="segmented-tabs">
            <button
              type="button"
              className={activeMode === 'login' ? 'segmented active' : 'segmented'}
              onClick={() => setActiveMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={activeMode === 'signup' ? 'segmented active' : 'segmented'}
              onClick={() => setActiveMode('signup')}
              disabled={isWarden}
            >
              Sign Up
            </button>
          </div>

          <div className="auth-card">
            <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
            <p className="small-muted">
              {isSignup ? 'Join DormEngine and complete your profile.' : 'Sign in to continue your hostel workflow.'}
            </p>

            {error ? <div className="error-box">{error}</div> : null}

            <form className="stack-14 mt-20" onSubmit={handleSubmit}>
              {isSignup ? (
                <label className="field">
                  <span>Full name</span>
                  <div className="input-shell">
                    <LoginRoundedIcon />
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                  </div>
                </label>
              ) : null}

              <label className="field">
                <span>Email</span>
                <div className="input-shell">
                  <MailOutlineRoundedIcon />
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required />
                </div>
              </label>

              <label className="field">
                <span>Password</span>
                <div className="input-shell">
                  <LockRoundedIcon />
                  <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required />
                </div>
              </label>

              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Log In'}
              </button>
            </form>

            <div className="auth-divider"><span>or</span></div>

            <button className="secondary-button" type="button" onClick={() => navigate('/warden/login')}>
              <ShieldRoundedIcon fontSize="small" /> Admin Login
            </button>

            <button className="google-button" type="button">
              <GoogleIcon fontSize="small" /> Sign in with Google
            </button>

            <p className="auth-switch-copy">
              {isSignup ? 'Already have an account?' : 'Need an account?'}{' '}
              {isSignup ? <Link to="/login">Log in</Link> : <Link to="/signup">Sign up</Link>}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
