import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { submitPreferences } from '../services/api';

const fields = [
  { name: 'food', label: 'Food', options: ['vegetarian', 'eggetarian', 'non-vegetarian'] },
  { name: 'sleep_time', label: 'Sleep time', options: ['before 10pm', '10pm-12am', 'after 12am'] },
  { name: 'study_hours', label: 'Study hours', options: ['early morning', 'afternoon', 'late night'] },
  { name: 'music', label: 'Music', options: ['no music', 'headphones only', 'low speaker'] },
  { name: 'guests', label: 'Guests', options: ['rarely', 'sometimes', 'often'] },
  { name: 'cleanliness', label: 'Cleanliness', options: ['basic', 'moderate', 'strict'] },
  { name: 'ac_pref', label: 'AC preference', options: ['cool', 'moderate', 'off'] },
];

export default function Preference() {
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const setOption = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    await submitPreferences(form);
    setSaving(false);
    navigate('/best-match');
  };

  return (
    <AppShell title="Lifestyle Preferences">
      <form className="card stack-16" onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.name}>
            <p>{field.label}</p>
            <div className="option-row mt-8">
              {field.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={form[field.name] === option ? 'btn option selected' : 'btn option'}
                  onClick={() => setOption(field.name, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button className="btn mt-8" type="submit" disabled={saving}>
          {saving ? 'Saving preferences...' : 'Save preferences'}
        </button>
      </form>
    </AppShell>
  );
}
