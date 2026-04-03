import { useNavigate } from 'react-router-dom';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { studentHomeCards } from '../../data/studentFlow';

export default function StudentHome() {
  const navigate = useNavigate();

  return (
    <div className="student-landing">
      <header className="student-landing-header">
        <div className="brand-inline">
          <div className="auth-brand-mark small"><ArrowForwardRoundedIcon fontSize="small" /></div>
          <p className="brand-title large">DormEngine</p>
        </div>
        <h1>Welcome to <strong>Smart Room Allocation</strong></h1>
      </header>

      <section className="step-strip">
        <div className="step-pills">
          <span className="step-pill active">Step 1: Personality Test</span>
          <span className="step-pill">Step 2: Preferences</span>
        </div>
        <div className="progress-bar">
          <span className="progress-fill" style={{ width: '58%' }} />
        </div>
      </section>

      <section className="dual-cards">
        {studentHomeCards.map((card) => (
          <article key={card.key} className="feature-card">
            <div className="feature-illustration">{card.icon}</div>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <button type="button" className="primary-button wide" onClick={() => navigate(card.to)}>
              {card.action}
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
