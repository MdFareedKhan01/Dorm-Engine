export default function ComplaintCard({ complaint, onStatusChange, isAdmin = false }) {
  return (
    <article className="card complaint-card">
      <div className="row between">
        <h4>{complaint.category || 'general'}</h4>
        <span className={`pill ${complaint.status || 'open'}`}>{complaint.status || 'open'}</span>
      </div>
      <p>{complaint.text}</p>
      <div className="row between mt-12">
        <span className="small-muted">Priority: {complaint.priority || 'medium'}</span>
        {isAdmin && (
          <select
            value={complaint.status || 'open'}
            onChange={(event) => onStatusChange?.(complaint.id, event.target.value)}
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        )}
      </div>
    </article>
  );
}
