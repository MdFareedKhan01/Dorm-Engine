import { useEffect, useMemo, useState } from 'react';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import WardenLayout from '../../layouts/WardenLayout';
import { fetchFeesSummary } from '../../services/api';

export default function WardenFees() {
  const [summary, setSummary] = useState({ totalCollected: 0, pending: 0, monthly: [] });

  useEffect(() => {
    fetchFeesSummary().then(setSummary).catch(() => setSummary({ totalCollected: 0, pending: 0, monthly: [] }));
  }, []);

  const barMax = useMemo(() => Math.max(...(summary.monthly || []).map((item) => item.amount || 0), 1), [summary.monthly]);

  return (
    <WardenLayout>
      <section className="warden-page">
        <section className="hero-banner admin-hero-banner">
          <div>
            <h1>Fees</h1>
            <p>Track fee collection, pending amounts, and monthly trends.</p>
          </div>
          <PaymentsRoundedIcon className="hero-icon" />
        </section>

        <div className="fees-summary-grid">
          <article className="fee-summary-card paid">
            <div className="fee-card-icon"><PaymentsRoundedIcon /></div>
            <div>
              <p className="fee-card-label">Total Collected</p>
              <strong className="fee-card-amount">${Number(summary.totalCollected || 0).toLocaleString()}</strong>
              <span className="fee-card-detail">Live fee collection from the database</span>
            </div>
          </article>
          <article className="fee-summary-card pending">
            <div className="fee-card-icon"><TrendingUpRoundedIcon /></div>
            <div>
              <p className="fee-card-label">Pending</p>
              <strong className="fee-card-amount">${Number(summary.pending || 0).toLocaleString()}</strong>
              <span className="fee-card-detail">Students with unpaid dues</span>
            </div>
          </article>
          <article className="fee-summary-card avg">
            <div className="fee-card-icon"><TrendingUpRoundedIcon /></div>
            <div>
              <p className="fee-card-label">Monthly average</p>
              <strong className="fee-card-amount">${Math.round((summary.totalCollected || 0) / Math.max((summary.monthly || []).length, 1)).toLocaleString()}</strong>
              <span className="fee-card-detail">Across the current tracked months</span>
            </div>
          </article>
        </div>

        <article className="warden-panel admin-panel">
          <h3>Monthly Collection Graph</h3>
          <div className="bar-chart large mt-16">
            {(summary.monthly || []).map((item) => (
              <div key={item.month} className="bar-column">
                <div className={`bar ${item.paid ? 'paid' : 'pending'}`} style={{ height: `${Math.max(26, (item.amount / barMax) * 100)}%` }} />
                <span>{item.month}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </WardenLayout>
  );
}
