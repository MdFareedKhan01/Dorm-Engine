import { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import ComplaintCard from '../components/ComplaintCard';
import { createComplaint, fetchComplaintsAll, fetchComplaintsMine, updateComplaintStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Complaints() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [complaints, setComplaints] = useState([]);
  const [text, setText] = useState('');
  const [category, setCategory] = useState('plumbing');

  useEffect(() => {
    const loader = isAdmin ? fetchComplaintsAll : fetchComplaintsMine;
    loader().then((data) => {
      setComplaints(data.complaints || []);
    });
  }, [isAdmin]);

  const submit = async (event) => {
    event.preventDefault();
    if (!text.trim()) return;

    const { complaint } = await createComplaint({ text, category });
    setComplaints((prev) => [complaint, ...prev]);
    setText('');
  };

  const setStatus = async (id, status) => {
    await updateComplaintStatus(id, { status });
    setComplaints((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  return (
    <AppShell title="Complaints">
      {!isAdmin && (
        <form className="card stack-12" onSubmit={submit}>
          <h3>Submit complaint</h3>
          <textarea className="input" rows="4" placeholder="Describe issue" value={text} onChange={(event) => setText(event.target.value)} />
          <select className="input" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="housekeeping">Housekeeping</option>
            <option value="security">Security</option>
            <option value="other">Other</option>
          </select>
          <button type="submit" className="btn">Submit</button>
        </form>
      )}
      <section className="stack-12 mt-20">
        {complaints.map((complaint) => (
          <ComplaintCard
            key={complaint.id}
            complaint={complaint}
            isAdmin={isAdmin}
            onStatusChange={setStatus}
          />
        ))}
      </section>
    </AppShell>
  );
}
