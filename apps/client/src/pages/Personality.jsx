import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { submitPersonality } from '../services/api';

const questions = [
  'I feel energized in social gatherings.',
  'I prefer concrete facts over abstract ideas.',
  'I make decisions more with logic than emotion.',
  'I prefer planning over spontaneity.',
  'I enjoy meeting new people regularly.',
  'I trust practical experience over theories.',
  'I prioritize fairness over harmony in conflict.',
  'I prefer having a fixed schedule each day.',
  'I speak before thinking everything through.',
  'I am more detail-oriented than big-picture oriented.',
  'I am direct when giving feedback.',
  'I dislike last-minute plan changes.',
  'I gain motivation from group activities.',
  'I notice specifics quickly around me.',
  'I can separate emotions from decisions.',
  'I prefer clear structure in daily routines.',
];

const dimensions = ['E/I', 'S/N', 'T/F', 'J/P'];

function toMbti(answers) {
  const sums = [0, 0, 0, 0];
  answers.forEach((value, index) => {
    sums[index % 4] += value;
  });

  return [
    sums[0] >= 0 ? 'E' : 'I',
    sums[1] >= 0 ? 'S' : 'N',
    sums[2] >= 0 ? 'T' : 'F',
    sums[3] >= 0 ? 'J' : 'P',
  ].join('');
}

export default function Personality() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(Array(questions.length).fill(0));
  const [index, setIndex] = useState(0);
  const [saving, setSaving] = useState(false);

  const progress = useMemo(() => Math.round(((index + 1) / questions.length) * 100), [index]);

  const handleScore = (score) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = score;
      return next;
    });
  };

  const handleNext = async () => {
    if (index < questions.length - 1) {
      setIndex((prev) => prev + 1);
      return;
    }

    const personalityType = toMbti(answers);
    setSaving(true);
    await submitPersonality({ answers, personalityType });
    setSaving(false);
    navigate('/preferences');
  };

  return (
    <AppShell title="Personality Test">
      <section className="card">
        <p className="small-muted">Question {index + 1} of {questions.length}</p>
        <div className="progress mt-12">
          <span style={{ width: `${progress}%` }} />
        </div>
        <h3 className="mt-20">{questions[index]}</h3>
        <p className="small-muted mt-8">Dimension: {dimensions[index % 4]}</p>
        <div className="grid-5 mt-20">
          {[-2, -1, 0, 1, 2].map((value) => (
            <button
              type="button"
              key={value}
              className={answers[index] === value ? 'btn score selected' : 'btn score'}
              onClick={() => handleScore(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="row between mt-20">
          <button type="button" className="btn ghost" onClick={() => setIndex((prev) => Math.max(prev - 1, 0))}>
            Previous
          </button>
          <button type="button" className="btn" onClick={handleNext} disabled={saving}>
            {index === questions.length - 1 ? (saving ? 'Saving...' : 'Submit') : 'Next'}
          </button>
        </div>
      </section>
    </AppShell>
  );
}
