import { useEffect, useState } from 'react';
import EngineeringRoundedIcon from '@mui/icons-material/EngineeringRounded';
import WardenLayout from '../../layouts/WardenLayout';
import { fetchMaintenanceTickets } from '../../services/api';

export default function WardenMaintenance() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchMaintenanceTickets().then((data) => setTickets(data.tickets || [])).catch(() => setTickets([]));
  }, []);

  return (
    <WardenLayout>
      <section className="warden-page">
        <section className="hero-banner admin-hero-banner">
          <div>
            <h1>Maintenance</h1>
            <p>Track service requests and resolution progress.</p>
          </div>
          <EngineeringRoundedIcon className="hero-icon" />
        </section>
        <div className="cards-stack">
          {tickets.map((item) => (
            <article key={item._id} className="warden-panel light notice-row admin-notice-row">
              <EngineeringRoundedIcon />
              <div>
                <strong>{item.notes}</strong>
                <p>Status: {item.status} · Due: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'No due date'}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </WardenLayout>
  );
}
