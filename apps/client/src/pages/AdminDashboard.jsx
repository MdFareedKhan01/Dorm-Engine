import { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import StatCard from '../components/StatCard';
import { fetchComplaintsAll, fetchFeesSummary, fetchRoomStats } from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ occupied: 0, empty: 0, maintenance: 0, complaints: 0, fees: 0 });

  useEffect(() => {
    async function load() {
      const [roomStats, complaintData, feeData] = await Promise.all([
        fetchRoomStats(),
        fetchComplaintsAll(),
        fetchFeesSummary(),
      ]);

      setStats({
        occupied: roomStats.occupied || 0,
        empty: roomStats.empty || 0,
        maintenance: roomStats.maintenance || 0,
        complaints: complaintData.complaints?.length || 0,
        fees: feeData.totalCollected || 0,
      });
    }

    load();
  }, []);

  return (
    <AppShell title="Admin Dashboard">
      <section className="grid-5">
        <StatCard label="Occupied rooms" value={stats.occupied} tone="accent" />
        <StatCard label="Empty rooms" value={stats.empty} />
        <StatCard label="Maintenance rooms" value={stats.maintenance} />
        <StatCard label="Pending complaints" value={stats.complaints} />
        <StatCard label="Fees collected" value={`INR ${stats.fees.toLocaleString()}`} />
      </section>
      <section className="card mt-20">
        <h3>Admin Priorities</h3>
        <ul className="list mt-12">
          <li>Review high-priority complaints and assign tickets.</li>
          <li>Post notices for policy and emergency updates.</li>
          <li>Monitor occupancy and fee summary trends.</li>
        </ul>
      </section>
    </AppShell>
  );
}
