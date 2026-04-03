import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import { agreementOptions, personalityQuestions } from '../../data/studentFlow';
import { submitPersonality } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Personality() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(Array(personalityQuestions.length).fill(null));
  const [submitting, setSubmitting] = useState(false);

  const progress = useMemo(() => Math.round(((step + 1) / personalityQuestions.length) * 100), [step]);

  const currentAnswer = answers[step];

  const selectAnswer = (value) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = value;
      return next;
    });
  };

  const handleNext = async () => {
    if (step < personalityQuestions.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }
    setSubmitting(true);
    try {
      await submitPersonality({ answers });
      await refreshProfile();
    } finally {
      setSubmitting(false);
    }
    navigate('/student/preferences');
  };

  return (
    <div className="question-page">
      <header className="question-header">
        <div className="brand-inline centered">
          <div className="auth-brand-mark small"><CheckCircleRoundedIcon fontSize="small" /></div>
          <p className="brand-title large">DormEngine</p>
        </div>
        <h1>Personality Test</h1>
        <p>Answer the following 10 questions to discover your personality type.</p>
      </header>

      <div className="question-progress">
        <div className="question-progress-track">
          <span className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-count">{step + 1}/{personalityQuestions.length}</span>
      </div>

      <section className="question-card">
        <p className="question-number">{step + 1}. </p>
        <h2>{personalityQuestions[step]}</h2>

        <div className="options-row">
          {agreementOptions.map((option) => {
            const selected = currentAnswer === option.value;
            return (
              <button
                key={option.value}
                type="button"
                className={selected ? 'option-button selected' : 'option-button'}
                onClick={() => selectAnswer(option.value)}
              >
                {selected ? <CheckCircleRoundedIcon fontSize="small" /> : <RadioButtonUncheckedRoundedIcon fontSize="small" />}
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>

        <div className="question-footer">
          <div className="mini-progress-wrap">
            <span>Step {step + 1} of {personalityQuestions.length}</span>
            <div className="mini-progress">
              <span className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <button type="button" className="primary-button compact" onClick={handleNext} disabled={submitting}>
            {step === personalityQuestions.length - 1 ? (submitting ? 'Saving...' : 'Finish') : 'Next'}
          </button>
        </div>
      </section>
    </div>
  );
}
