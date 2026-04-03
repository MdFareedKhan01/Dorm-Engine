import { useEffect, useMemo, useState } from 'react';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import EngineeringRoundedIcon from '@mui/icons-material/EngineeringRounded';
import WardenLayout from '../../layouts/WardenLayout';
import { fetchComplaintsAll, updateComplaintStatus } from '../../services/api';

export default function WardenComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    fetchComplaintsAll().then((data) => setComplaints(data.complaints || [])).catch(() => setComplaints([]));
  }, []);

  const filteredComplaints = useMemo(() => complaints.filter((item) => {
    const statusMatch = statusFilter === 'all' || item.status === statusFilter;
    const priorityMatch = priorityFilter === 'all' || item.priority === priorityFilter;
    return statusMatch && priorityMatch;
  }), [complaints, statusFilter, priorityFilter]);

  const markResolved = async (complaintId) => {
    const result = await updateComplaintStatus(complaintId, { status: 'resolved' });
    if (result?.complaint) {
      setComplaints((currentComplaints) => currentComplaints.map((item) => (item._id === complaintId ? result.complaint : item)));
    }
  };

  return (
    <WardenLayout>
      <section className="warden-page">
        <section className="hero-banner admin-hero-banner">
          <div>
            <h1>Complaints</h1>
            <p>Manage and resolve student complaints with live status updates.</p>
          </div>
          <ReportProblemRoundedIcon className="hero-icon" />
        </section>

        <div className="filter-row admin-filter-row">
          {['all', 'open', 'in_progress', 'resolved'].map((status) => (
            <button key={status} type="button" className={`pill-tab ${statusFilter === status ? 'active' : ''}`} onClick={() => setStatusFilter(status)}>
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="filter-row admin-filter-row mt-12">
          {['all', 'high', 'medium', 'low'].map((priority) => (
            <button key={priority} type="button" className={`pill-tab ${priorityFilter === priority ? 'active' : ''}`} onClick={() => setPriorityFilter(priority)}>
              {priority} priority
            </button>
          ))}
        </div>

        <div className="admin-complaints-grid mt-16">
          {filteredComplaints.map((complaint) => (
            <article key={complaint._id} className="admin-complaint-card">
              <div className="card-header">
                <h3>{complaint.subject}</h3>
                <span className={`status-tag ${complaint.priority}`}>{complaint.priority}</span>
              </div>
              <p>Student: {complaint.studentId?.name || 'Student'} · Room {complaint.roomNumber}</p>
              <p>{complaint.description}</p>
              {complaint.mediaUrl ? (
                <a href={complaint.mediaUrl} target="_blank" rel="noreferrer" className="complaint-media-link">
                  <img src={complaint.mediaUrl} alt="Complaint attachment" className="complaint-media-thumb" />
                  <span>Open attachment</span>
                </a>
              ) : null}
              <div className="staff-meta-row mt-16">
                <span className={`status-tag ${complaint.status}`}>{complaint.status}</span>
                <button type="button" className="text-button" onClick={() => markResolved(complaint._id)}>
                  <CheckCircleRoundedIcon fontSize="inherit" /> Mark resolved
                </button>
                <button type="button" className="text-button">
                  <EngineeringRoundedIcon fontSize="inherit" /> Assign staff
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </WardenLayout>
  );
}
