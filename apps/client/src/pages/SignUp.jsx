import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(form);
      navigate('/personality');
    } catch (err) {
      setError(err.message || 'Unable to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <section className="auth-hero">
        <p className="kicker">DormEngine</p>
        <h1>Create your student profile and start your matching journey.</h1>
      </section>
      <section className="auth-card">
        <h2>Sign Up</h2>
        {error ? <p className="error">{error}</p> : null}
        <form onSubmit={handleSubmit} className="stack-12">
          <input className="input" name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
          <input className="input" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input className="input" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="small-muted mt-12">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </section>
    </div>
  );
}
