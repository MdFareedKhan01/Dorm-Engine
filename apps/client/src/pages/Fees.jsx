import { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { fetchFeesSummary } from '../services/api';

export default function Fees() {
  const [summary, setSummary] = useState({ totalCollected: 0, pending: 0, monthly: [] });

  useEffect(() => {
    fetchFeesSummary().then((data) => {
      setSummary(data);
    });
  }, []);

  return (
    <AppShell title="Fees">
      <section className="grid-2">
        <article className="card">
          <p className="small-muted">Total collected</p>
          <h3 className="mt-8">INR {summary.totalCollected.toLocaleString()}</h3>
        </article>
        <article className="card">
          <p className="small-muted">Pending amount</p>
          <h3 className="mt-8">INR {summary.pending.toLocaleString()}</h3>
        </article>
      </section>
      <section className="card mt-20">
        <h3>Monthly collection</h3>
        <div className="stack-12 mt-12">
          {summary.monthly.map((item) => (
            <div key={item.month} className="row between monthly-row">
              <span>{item.month}</span>
              <strong>INR {item.amount.toLocaleString()}</strong>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
