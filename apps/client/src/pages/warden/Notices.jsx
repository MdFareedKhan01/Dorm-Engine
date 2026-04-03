import { useEffect, useState } from 'react';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import WardenLayout from '../../layouts/WardenLayout';
import { createNotice, fetchNotices } from '../../services/api';

const initialForm = {
  title: '',
  body: '',
  type: 'general',
  targetBlock: 'all',
  badge: 'New',
  accent: 'warm',
};

export default function WardenNotices() {
  const [notices, setNotices] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchNotices().then((data) => setNotices(data.notices || [])).catch(() => setNotices([]));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleCreate = async () => {
    const result = await createNotice(form);
    if (result?.notice) {
      setNotices((currentNotices) => [result.notice, ...currentNotices]);
      setForm(initialForm);
      setOpen(false);
    }
  };

  return (
    <WardenLayout>
      <section className="warden-page">
        <section className="hero-banner admin-hero-banner">
          <div>
            <h1>Notices</h1>
            <p>Publish notices for blocks or the entire campus.</p>
          </div>
          <button type="button" className="secondary-button admin-add-button" onClick={() => setOpen(true)}>
            <AddRoundedIcon fontSize="small" /> Add Notice
          </button>
        </section>

        <div className="cards-stack">
          {notices.map((item) => (
            <article key={item._id || item.title} className="warden-panel light notice-row admin-notice-row">
              <NotificationsRoundedIcon />
              <div>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>

        {open ? (
          <div className="feedback-modal-overlay" onClick={() => setOpen(false)}>
            <div className="feedback-modal admin-modal" onClick={(event) => event.stopPropagation()}>
              <h3>Create Notice</h3>
              <div className="admin-form-grid mt-16">
                {Object.keys(initialForm).map((key) => (
                  <label key={key} className="field">
                    <span>{key}</span>
                    {key === 'type' ? (
                      <select name={key} value={form[key]} onChange={handleChange}>
                        <option value="general">General</option>
                        <option value="emergency">Emergency</option>
                        <option value="policy">Policy</option>
                      </select>
                    ) : (
                      <input name={key} value={form[key]} onChange={handleChange} />
                    )}
                  </label>
                ))}
              </div>
              <div className="modal-actions">
                <button type="button" className="ghost-button" onClick={() => setOpen(false)}>Cancel</button>
                <button type="button" className="primary-button" onClick={handleCreate}>Publish</button>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </WardenLayout>
  );
}
