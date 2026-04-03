import { useEffect, useMemo, useState } from 'react';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import DoorFrontRoundedIcon from '@mui/icons-material/DoorFrontRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import { useNavigate } from 'react-router-dom';
import WardenLayout from '../../layouts/WardenLayout';
import { fetchAdminOverview } from '../../services/api';

export default function WardenDashboard() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState({
    stats: {},
    recentComplaints: [],
    recentNotices: [],
    recentMaintenance: [],
    roomOccupancy: { occupied: 0, empty: 0, maintenance: 0 },
    feeSummary: { totalCollected: 0, pending: 0, monthly: [] },
  });

  useEffect(() => {
    fetchAdminOverview().then(setOverview).catch(() => setOverview({
      stats: {},
      recentComplaints: [],
      recentNotices: [],
      recentMaintenance: [],
      roomOccupancy: { occupied: 0, empty: 0, maintenance: 0 },
      feeSummary: { totalCollected: 0, pending: 0, monthly: [] },
    }));
  }, []);

  const statCards = useMemo(() => ([
    { label: 'Total Students', value: overview.stats.totalStudents || 0, detail: `${overview.stats.activeStudents || 0} active students` },
    { label: 'Total Staff', value: overview.stats.totalStaff || 0, detail: `${overview.stats.busyStaff || 0} currently busy` },
    { label: 'Occupied Rooms', value: overview.stats.occupiedRooms || 0, detail: `Out of ${overview.stats.totalRooms || 0} rooms` },
    { label: 'Available Rooms', value: overview.stats.availableRooms || 0, detail: 'Immediate occupancy' },
    { label: 'Fee Collection', value: `$${Number(overview.stats.feeCollected || 0).toLocaleString()}`, detail: 'Total collected this month' },
    { label: 'Pending Complaints', value: overview.stats.openComplaints || 0, detail: 'Issues needing attention' },
  ]), [overview.stats]);

  const occupancyTotal = overview.roomOccupancy.occupied + overview.roomOccupancy.empty + overview.roomOccupancy.maintenance || 1;
  const occupiedPct = Math.round((overview.roomOccupancy.occupied / occupancyTotal) * 100);
  const emptyPct = Math.round((overview.roomOccupancy.empty / occupancyTotal) * 100);
  const monthlyBars = overview.feeSummary.monthly || [];

  return (
    <WardenLayout>
      <section className="warden-page">
        <section className="hero-banner admin-hero-banner">
          <div>
            <h1>Good morning, Admin!</h1>
            <p>All hostel operations are running live. Review occupancy, complaints, and service activity here.</p>
          </div>
          <div className="hero-room-pill">{overview.stats.pendingNotices || 0} notices live</div>
          <DoorFrontRoundedIcon className="hero-icon" />
        </section>

        <div className="warden-stats-grid admin-stats-grid">
          {statCards.map((stat) => (
            <article key={stat.label} className="warden-stat-card admin-stat-card">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <small>{stat.detail}</small>
            </article>
          ))}
        </div>

        <div className="warden-split admin-split">
          <article className="warden-panel admin-panel">
            <div className="card-header">
              <h3>Recent Complaints</h3>
              <button type="button" className="text-button" onClick={() => navigate('/warden/complaints')}>
                View all <ArrowForwardRoundedIcon fontSize="inherit" />
              </button>
            </div>
            <div className="cards-stack mt-16">
              {overview.recentComplaints.map((item) => (
                <article key={item._id} className="notice-row admin-feed-row">
                  <WarningAmberRoundedIcon className="feed-icon high" />
                  <div className="feed-copy">
                    <strong>{item.subject}</strong>
                    <p>{item.studentName} · Room {item.roomNumber}</p>
                  </div>
                  <span className={`status-tag ${item.priority}`}>{item.priority}</span>
                </article>
              ))}
            </div>
          </article>

          <article className="warden-panel admin-panel">
            <h3>Room Occupancy Overview</h3>
            <div className="ring-chart" style={{ background: `conic-gradient(var(--brand) 0 ${occupiedPct}%, #d6d6d6 ${occupiedPct}% ${occupiedPct + emptyPct}%, #b7dfc0 ${occupiedPct + emptyPct}% 100%)` }}>
              <div className="ring-chart-core">
                <strong>{occupiedPct}%</strong>
                <span>Occupied</span>
              </div>
            </div>
            <div className="legend-row">
              <span><i className="legend-dot occupied" />Occupied</span>
              <span><i className="legend-dot empty" />Empty</span>
              <span><i className="legend-dot maintenance" />Maintenance</span>
            </div>
            <div className="mini-stat-row">
              <span>{overview.roomOccupancy.occupied} occupied</span>
              <span>{overview.roomOccupancy.empty} empty</span>
              <span>{overview.roomOccupancy.maintenance} maintenance</span>
            </div>
          </article>
        </div>

        <div className="warden-split admin-bottom-split">
          <article className="warden-panel admin-panel">
            <h3>Fee Collection Graph</h3>
            <div className="bar-chart">
              {monthlyBars.map((item) => (
                <div key={item.month} className="bar-column">
                  <div className="bar" style={{ height: `${Math.max(28, Math.min(100, Math.round((item.amount / 80000) * 100)))}%` }} />
                  <span>{item.month}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="warden-panel admin-panel">
            <div className="card-header">
              <h3>Recent Activity</h3>
              <button type="button" className="text-button" onClick={() => navigate('/warden/reports')}>
                Reports <ArrowForwardRoundedIcon fontSize="inherit" />
              </button>
            </div>
            <div className="activity-list mt-16">
              {[...overview.recentMaintenance.map((item) => `Ticket: ${item.notes}`), ...overview.recentNotices.map((item) => `Notice: ${item.title}`)]
                .slice(0, 5)
                .map((item, index) => (
                  <div key={`${item}-${index}`} className="activity-item">{item}</div>
                ))}
            </div>
            <div className="quick-actions-grid admin-quick-actions mt-16">
              <button type="button" className="action-card" onClick={() => navigate('/warden/students')}>
                <div className="action-icon accent-blue">▣</div>
                <h4>Students</h4>
                <p>Review live student records</p>
                <span>Open <ArrowForwardRoundedIcon fontSize="inherit" /></span>
              </button>
              <button type="button" className="action-card" onClick={() => navigate('/warden/room-allocation')}>
                <div className="action-icon accent-gold">◫</div>
                <h4>Allocate Room</h4>
                <p>Check pending allocations</p>
                <span>Open <ArrowForwardRoundedIcon fontSize="inherit" /></span>
              </button>
            </div>
          </article>
        </div>
      </section>
    </WardenLayout>
  );
}
