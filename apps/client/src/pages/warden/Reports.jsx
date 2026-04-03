import { useEffect, useState } from 'react';
import SummarizeRoundedIcon from '@mui/icons-material/SummarizeRounded';
import WardenLayout from '../../layouts/WardenLayout';
import { fetchAdminOverview } from '../../services/api';

export default function WardenReports() {
  const [overview, setOverview] = useState({ stats: {}, roomOccupancy: { occupied: 0, empty: 0, maintenance: 0 } });

  useEffect(() => {
    fetchAdminOverview().then(setOverview).catch(() => setOverview({ stats: {}, roomOccupancy: { occupied: 0, empty: 0, maintenance: 0 } }));
  }, []);

  return (
    <WardenLayout>
      <section className="warden-page">
        <section className="hero-banner admin-hero-banner">
          <div>
            <h1>Reports</h1>
            <p>Room occupancy, complaints, and notice activity summaries.</p>
          </div>
          <SummarizeRoundedIcon className="hero-icon" />
        </section>
        <article className="warden-panel admin-panel report-panel">
          <SummarizeRoundedIcon className="report-icon" />
          <div>
            <h3>Reporting Snapshot</h3>
            <p>{overview.stats.totalStudents || 0} students, {overview.stats.totalStaff || 0} staff, {overview.stats.pendingNotices || 0} notices, and {overview.stats.openComplaints || 0} open complaints are live in the database.</p>
          </div>
        </article>
      </section>
    </WardenLayout>
  );
}
