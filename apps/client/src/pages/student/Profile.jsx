import { useMemo, useState } from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { useAuth } from '../../context/AuthContext';

export default function StudentProfile() {
  const { user, saveProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    program: user?.program || '',
    year: user?.year || '',
    block: user?.block || '',
    roomNumber: user?.roomNumber || '',
  });

  const preferenceEntries = useMemo(() => Object.entries(user?.preferences || {}), [user?.preferences]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveProfile(form);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="page-panel">
      <div className="panel-title between">
        <div>
          <h2>Profile</h2>
          <p>Manage your details and review your test outcomes.</p>
        </div>
        <button type="button" className="secondary-button" style={{ width: 'auto', minWidth: '160px' }} onClick={() => setEditing((prev) => !prev)}>
          <EditRoundedIcon fontSize="small" /> {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="dashboard-row" style={{ marginTop: '16px' }}>
        <article className="info-card profile-card">
          <div className="card-header">
            <h2>Personal Details</h2>
            <span className="tiny-chip">Live from DB</span>
          </div>

          <div className="stack-14 mt-16">
            <label className="field">
              <span>Name</span>
              <input className="profile-input" name="name" value={form.name} onChange={handleChange} disabled={!editing} />
            </label>
            <label className="field">
              <span>Program</span>
              <input className="profile-input" name="program" value={form.program} onChange={handleChange} disabled={!editing} />
            </label>
            <label className="field">
              <span>Year</span>
              <input className="profile-input" name="year" value={form.year} onChange={handleChange} disabled={!editing} />
            </label>
            <div className="split-row">
              <label className="field">
                <span>Block</span>
                <input className="profile-input" name="block" value={form.block} onChange={handleChange} disabled={!editing} />
              </label>
              <label className="field">
                <span>Room Number</span>
                <input className="profile-input" name="roomNumber" value={form.roomNumber} onChange={handleChange} disabled={!editing} />
              </label>
            </div>
          </div>

          {editing ? (
            <button type="button" className="primary-button mt-16" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          ) : null}
        </article>

        <article className="info-card">
          <div className="card-header">
            <h2>Test Outcomes</h2>
            <span className="tiny-chip">Personality + Preferences</span>
          </div>

          <div className="theme-note mt-16">
            <div>
              <h3>Theme controls moved to the topbar</h3>
              <p>Use the sun and moon icon in the header to switch the entire app between light and dark mode.</p>
            </div>
          </div>

          <div className="status-stack mt-16">
            <div className="status-card">
              <div className="status-icon"><PsychologyRoundedIcon /></div>
              <div className="status-copy">
                <h3>Personality Result</h3>
                <p>Your MBTI type from the personality test.</p>
              </div>
              <div className="notice-badge">{user?.personalityType || 'Not taken yet'}</div>
            </div>

            <div className="status-card">
              <div className="status-icon"><TuneRoundedIcon /></div>
              <div className="status-copy">
                <h3>Preference Summary</h3>
                <p>Current saved lifestyle preferences.</p>
                <div className="chips-wrap mt-8">
                  {preferenceEntries.length ? preferenceEntries.map(([key, value]) => (
                    <span key={`${key}-${value}`} className="tiny-chip">{key}: {String(value)}</span>
                  )) : <span className="tiny-chip">No preferences saved</span>}
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
