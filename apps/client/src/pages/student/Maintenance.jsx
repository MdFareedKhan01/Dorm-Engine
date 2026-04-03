import { useEffect, useState } from 'react';
import EngineeringRoundedIcon from '@mui/icons-material/EngineeringRounded';
import { fetchMaintenanceTickets } from '../../services/api';

export default function StudentMaintenance() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchMaintenanceTickets().then((data) => setTickets(data.tickets || [])).catch(() => setTickets([]));
  }, []);

  return (
      <section className="page-panel maintenance-page">
        <div className="panel-title">
          <div>
            <h2>Maintenance</h2>
            <p>Track updates and service status.</p>
          </div>
        </div>
        <div className="status-stack">
          {tickets.map((item) => (
            <article key={item._id || item.title} className="status-card">
              <div className="status-icon"><EngineeringRoundedIcon /></div>
              <div className="status-copy">
                <h3>{item.title || item.notes}</h3>
                <p>{item.body || item.notes}</p>
              </div>
              <div className="notice-badge muted">{(item.status || 'pending').toUpperCase().replace('_', ' ')}</div>
            </article>
          ))}
        </div>
      </section>
  );
}
