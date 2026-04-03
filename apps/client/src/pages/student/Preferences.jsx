import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { preferenceGroups } from '../../data/studentFlow';
import { useAuth } from '../../context/AuthContext';
import { submitPreferences } from '../../services/api';

export default function Preferences() {
  const navigate = useNavigate();
  const { user, setOnboarded, refreshProfile } = useAuth();
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);

  const choose = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await submitPreferences({ preferences: values });
      await refreshProfile();
      if (user?.role === 'student') {
        setOnboarded();
      }
      navigate('/student/dashboard');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="preferences-page">
      <header className="question-header preferences-header">
        <div className="brand-inline centered">
          <div className="auth-brand-mark small"><HomeRoundedIcon fontSize="small" /></div>
          <p className="brand-title large">DormEngine</p>
        </div>
        <h1>Preference Test</h1>
        <p>Select your lifestyle preferences below</p>
      </header>

      <section className="preferences-card">
        {preferenceGroups.map((group) => (
          <div key={group.key} className="preference-row">
            <div className="preference-label">{group.label}</div>
            <div className="preference-options">
              {group.options.map((option) => {
                const selected = values[group.key] === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={selected ? 'preference-option selected' : 'preference-option'}
                    onClick={() => choose(group.key, option.value)}
                  >
                    {selected && <CheckRoundedIcon fontSize="small" />}
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <button type="button" className="primary-button wide save-preferences" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </section>
    </div>
  );
}
