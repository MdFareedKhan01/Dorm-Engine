import { useEffect, useState } from 'react';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import { fetchNotices } from '../../services/api';

export default function StudentNotices() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetchNotices().then((data) => setNotices(data.notices || [])).catch(() => setNotices([]));
  }, []);

  return (
      <section className="page-panel">
        <div className="panel-title">
          <div>
            <h2>Notices</h2>
            <p>Campus updates, reminders, and feedback windows.</p>
          </div>
        </div>
        <div className="notice-list">
          {notices.map((item, index) => (
            <article key={item._id || `${item.title}-${index}`} className={`notice-card ${item.accent || 'warm'}`}>
              <div className="notice-icon">
                <NotificationsRoundedIcon />
              </div>
              <div className="notice-body">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <span className="notice-meta">Posted {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently'}</span>
              </div>
              <div className="notice-badge">{item.badge || 'New'}</div>
            </article>
          ))}
        </div>
      </section>
  );
}
