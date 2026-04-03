import { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { fetchMaintenanceTickets } from '../services/api';

export default function Maintenance() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchMaintenanceTickets().then((data) => {
      setTickets(data.tickets || []);
    });
  }, []);

  return (
    <AppShell title="Maintenance Tickets">
      <section className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Assigned to</th>
                <th>Status</th>
                <th>Due date</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>{ticket.assignedTo || '-'}</td>
                  <td><span className={`pill ${ticket.status}`}>{ticket.status}</span></td>
                  <td>{new Date(ticket.dueDate).toLocaleDateString()}</td>
                  <td>{ticket.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
