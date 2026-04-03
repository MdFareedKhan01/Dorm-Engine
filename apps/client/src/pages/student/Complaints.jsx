import { useEffect, useState } from 'react';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import { createComplaint, fetchComplaintsMine } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const categoryOptions = ['Maintenance & Repairs', 'Housekeeping', 'Electrical', 'Security'];

export default function StudentComplaints() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Maintenance & Repairs');
  const [form, setForm] = useState({ roomNumber: user?.roomNumber || '304', block: user?.block || 'Block C', subject: '', description: '' });
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');

  useEffect(() => {
    fetchComplaintsMine().then((data) => {
      setComplaints(data.complaints || []);
      setLoading(false);
    }).catch(() => {
      setComplaints([]);
      setLoading(false);
    });
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setMediaFile(file);
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
      setMediaPreview('');
    }
    if (file) {
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('category', selectedCategory);
      payload.append('roomNumber', form.roomNumber);
      payload.append('block', form.block);
      payload.append('subject', form.subject);
      payload.append('description', form.description);
      if (mediaFile) {
        payload.append('media', mediaFile);
      }

      await createComplaint(payload);
      const updated = await fetchComplaintsMine();
      setComplaints(updated.complaints || []);
      setForm((prev) => ({ ...prev, subject: '', description: '' }));
      setMediaFile(null);
      if (mediaPreview) {
        URL.revokeObjectURL(mediaPreview);
      }
      setMediaPreview('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-panel complaints-layout">
      <div className="panel-title between">
        <div>
          <h2>Complaints & Requests</h2>
          <p>Track your complaints and submit a new request.</p>
        </div>
        <div className="filter-row">
          {['All', 'Open', 'Pending', 'Resolved'].map((label, index) => (
            <span key={label} className={index === 0 ? 'pill-tab active' : 'pill-tab'}>{label}</span>
          ))}
        </div>
      </div>

      <div className="complaints-grid">
        <div className="complaint-list">
          <div className="complaint-section-label">Past Requests ({complaints.length || 0})</div>
          {loading ? (
            <div className="info-card">Loading complaints...</div>
          ) : complaints.length ? complaints.map((item, index) => (
            <article key={item._id || `${item.subject}-${index}`} className="complaint-item">
              <div className="complaint-icon"><ReportProblemRoundedIcon /></div>
              <div className="complaint-copy">
                <h3>{item.subject}</h3>
                <p>{item.description}</p>
                {item.mediaUrl ? (
                  <a href={item.mediaUrl} target="_blank" rel="noreferrer" className="complaint-media-link">
                    <img src={item.mediaUrl} alt="Complaint evidence" className="complaint-media-thumb" />
                    <span>Open attachment</span>
                  </a>
                ) : null}
                <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently submitted'}</span>
              </div>
              <div className={`complaint-status ${item.status === 'resolved' ? 'resolved' : 'pending'}`}>{item.status.replace('_', ' ')}</div>
            </article>
          )) : <div className="info-card">No complaints yet.</div>}
        </div>

        <form className="request-form" onSubmit={handleSubmit}>
          <div className="complaint-section-label">Submit New Request</div>
          <label>
            <span>Category</span>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              {categoryOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <div className="split-row">
            <label>
              <span>Room Number</span>
              <input name="roomNumber" value={form.roomNumber} onChange={handleChange} />
            </label>
            <label>
              <span>Block</span>
              <input name="block" value={form.block} onChange={handleChange} />
            </label>
          </div>
          <label>
            <span>Subject</span>
            <input name="subject" value={form.subject} onChange={handleChange} placeholder="Brief title for your complaint" required />
          </label>
          <label>
            <span>Description</span>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the issue in detail." rows={9} required />
          </label>
          <label>
            <span>Upload Photo (optional)</span>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
          {mediaPreview ? (
            <div className="upload-preview-wrap">
              <img src={mediaPreview} alt="Preview" className="upload-preview-image" />
            </div>
          ) : null}
          <button type="submit" className="primary-button wide" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Complaint'}</button>
        </form>
      </div>
    </section>
  );
}
