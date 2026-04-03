import { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { createNotice, fetchNotices } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Notices() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState({ title: '', body: '', type: 'general', targetBlock: 'all' });

  useEffect(() => {
    fetchNotices().then((data) => {
      setNotices(data.notices || []);
    });
  }, []);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const { notice } = await createNotice(form);
    setNotices((prev) => [notice, ...prev]);
    setForm({ title: '', body: '', type: 'general', targetBlock: 'all' });
  };

  return (
    <AppShell title="Notices">
      {isAdmin && (
        <form className="card stack-12" onSubmit={submit}>
          <h3>Create notice</h3>
          <input className="input" name="title" placeholder="Title" value={form.title} onChange={onChange} required />
          <textarea className="input" name="body" rows="3" placeholder="Message" value={form.body} onChange={onChange} required />
          <div className="grid-2">
            <select className="input" name="type" value={form.type} onChange={onChange}>
              <option value="general">General</option>
              <option value="emergency">Emergency</option>
              <option value="policy">Policy</option>
            </select>
            <input className="input" name="targetBlock" placeholder="Target block (or all)" value={form.targetBlock} onChange={onChange} />
          </div>
          <button className="btn" type="submit">Publish</button>
        </form>
      )}
      <section className="stack-12 mt-20">
        {notices.map((notice) => (
          <article key={notice.id} className="card">
            <div className="row between">
              <h4>{notice.title}</h4>
              <span className="pill neutral">{notice.type}</span>
            </div>
            <p className="mt-8">{notice.body}</p>
            <p className="small-muted mt-8">Block: {notice.targetBlock || 'all'} | {new Date(notice.createdAt).toLocaleString()}</p>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
