import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { confirmRoommate, fetchBestMatch } from '../services/api';

export default function BestMatch() {
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBestMatch().then((data) => {
      setMatch(data.match);
      setLoading(false);
    });
  }, []);

  const confirm = async () => {
    if (!match) return;
    setSaving(true);
    await confirmRoommate({ roommateId: match.id });
    setSaving(false);
    navigate('/rooms');
  };

  if (loading) {
    return <AppShell title="Best Match"><div className="card">Loading match...</div></AppShell>;
  }

  return (
    <AppShell title="Best Roommate Match">
      <section className="card">
        <h3>{match.name}</h3>
        <p className="small-muted">Personality: {match.personalityType}</p>
        <div className="grid-2 mt-20">
          <article className="mini-card">
            <p className="small-muted">Compatibility</p>
            <h4>{match.compatibility}%</h4>
          </article>
          <article className="mini-card">
            <p className="small-muted">Preference score</p>
            <h4>{match.preferenceScore}/7</h4>
          </article>
        </div>
        <p className="mt-20">Matching preferences</p>
        <div className="chips mt-8">
          {match.matchingPreferences?.map((item) => (
            <span key={item} className="chip">{item}</span>
          ))}
        </div>
        <div className="row gap-10 mt-20">
          <button className="btn" type="button" onClick={confirm} disabled={saving}>
            {saving ? 'Confirming...' : 'Confirm roommate'}
          </button>
          <button className="btn ghost" type="button" onClick={() => window.location.reload()}>
            Try another
          </button>
        </div>
      </section>
    </AppShell>
  );
}
