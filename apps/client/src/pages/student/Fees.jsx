import { useEffect, useState } from 'react';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { fetchFeesSummary } from '../../services/api';

export default function StudentFees() {
  const [summary, setSummary] = useState({ totalCollected: 0, pending: 0, monthly: [] });

  useEffect(() => {
    fetchFeesSummary().then((data) => setSummary(data)).catch(() => setSummary({ totalCollected: 0, pending: 0, monthly: [] }));
  }, []);

  const feeRows = summary.monthly || [];
  const totalCollected = summary.totalCollected || 0;
  const totalDue = summary.pending || 0;
  const paidMonths = feeRows.filter((row) => row.paid).length;

  return (
      <section className="page-panel fees-page">
        <div className="panel-title between" style={{ marginBottom: '24px' }}>
          <div>
            <h2>Fee Payments</h2>
            <p>Track your hostel fee payments and dues</p>
          </div>
        </div>

        <div className="fees-summary-grid">
          <article className="fee-summary-card paid">
            <div className="fee-card-icon">
              <CheckCircleRoundedIcon style={{ fontSize: '32px' }} />
            </div>
            <div>
              <p className="fee-card-label">Total Paid</p>
              <strong className="fee-card-amount">₹{(totalCollected / 100000).toFixed(2)}L</strong>
              <span className="fee-card-detail">{paidMonths} months</span>
            </div>
          </article>

          <article className="fee-summary-card pending">
            <div className="fee-card-icon">
              <WarningRoundedIcon style={{ fontSize: '32px' }} />
            </div>
            <div>
              <p className="fee-card-label">Amount Due</p>
              <strong className="fee-card-amount">₹{totalDue.toLocaleString()}</strong>
              <span className="fee-card-detail">Pending dues</span>
            </div>
          </article>

          <article className="fee-summary-card avg">
            <div className="fee-card-icon">
              <TrendingUpRoundedIcon style={{ fontSize: '32px' }} />
            </div>
            <div>
              <p className="fee-card-label">Average/Month</p>
              <strong className="fee-card-amount">₹{feeRows.length ? Math.round(totalCollected / feeRows.length).toLocaleString() : '0'}</strong>
              <span className="fee-card-detail">Live summary</span>
            </div>
          </article>
        </div>

        <div className="fee-history-card">
          <h3 style={{ margin: '0 0 20px', color: 'var(--heading)' }}>Payment History</h3>
          <div className="fee-table">
            {feeRows.map((row) => (
              <div key={row.month} className={`fee-row ${row.paid ? 'paid' : 'pending'}`}>
                <div className="fee-month-col">
                  <span className="fee-month">{row.month}</span>
                  <span className={`fee-status ${row.paid ? 'paid' : 'pending'}`}>
                    {row.paid ? 'Paid' : 'Pending'}
                  </span>
                </div>
                <div className="fee-amount-col">
                  <strong>₹{row.amount.toLocaleString()}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  );
}
