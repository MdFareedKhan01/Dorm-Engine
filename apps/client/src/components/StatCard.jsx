export default function StatCard({ label, value, tone = 'neutral' }) {
  return (
    <article className={`stat-card ${tone}`}>
      <p className="small-muted">{label}</p>
      <h3>{value}</h3>
    </article>
  );
}
