import { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import StatCard from '../components/StatCard';
import { fetchComplaintsMine, fetchMaintenanceTickets, fetchNotices, fetchRooms } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ room: '-', complaints: 0, notices: 0, maintenance: 0 });

  useEffect(() => {
    async function load() {
      const [roomData, complaintData, noticeData, maintenanceData] = await Promise.all([
        fetchRooms(),
        fetchComplaintsMine(),
        fetchNotices(),
        fetchMaintenanceTickets(),
      ]);

      setStats({
        room: roomData.rooms?.[0]?.roomNumber || 'Unassigned',
        complaints: complaintData.complaints?.length || 0,
        notices: noticeData.notices?.length || 0,
        maintenance: maintenanceData.tickets?.length || 0,
      });
    }

    load();
  }, []);

  return (
    <AppShell title="Student Dashboard">
      <section className="grid-4">
        <StatCard label="Current room" value={stats.room} tone="accent" />
        <StatCard label="Open complaints" value={stats.complaints} />
        <StatCard label="Notices" value={stats.notices} />
        <StatCard label="Maintenance tickets" value={stats.maintenance} />
      </section>
      <section className="card mt-20">
        <h3>Next Actions</h3>
        <ul className="list mt-12">
          <li>Complete personality test and preferences for better matching.</li>
          <li>Track complaints and maintenance updates in real time.</li>
          <li>Check notices daily for policy and emergency announcements.</li>
        </ul>
      </section>
    </AppShell>
  );
}
