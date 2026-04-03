import { useEffect, useMemo, useState } from 'react';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import { messMenu } from '../../data/studentFlow';
import { createMessFeedback } from '../../services/api';
import { getCurrentMealState, weekdayLabels } from '../../utils/messSchedule';

export default function StudentMess() {
  const [now, setNow] = useState(() => new Date());
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [rating, setRating] = useState(4);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  const liveMeal = useMemo(() => getCurrentMealState(now), [now]);
  const activeMealLabel = liveMeal.mealSlot ? `${liveMeal.mealSlot} · ${weekdayLabels[liveMeal.dayIndex]}` : 'No meal available right now';

  const openFeedback = (slot, day, item) => {
    if (liveMeal.mealSlot !== slot || liveMeal.dayIndex !== day) {
      return;
    }
    setSelectedMeal({ slot, day, item });
    setRating(4);
    setReview('');
  };

  const closeFeedback = () => setSelectedMeal(null);

  const submitFeedback = async () => {
    if (!selectedMeal) return;
    setSubmitting(true);
    try {
      await createMessFeedback({
        mealSlot: selectedMeal.slot,
        day: selectedMeal.day,
        item: selectedMeal.item,
        rating,
        review,
      });
      closeFeedback();
    } finally {
      setSubmitting(false);
    }
  };

  const isRateableMeal = (slot, dayIndex) => liveMeal.mealSlot === slot && liveMeal.dayIndex === dayIndex;

  return (
      <section className="page-panel mess-page">
        <div className="panel-title between">
          <div>
            <h2>My Mess Menu</h2>
            <p>Only the current meal is open for feedback. Everything else stays locked.</p>
          </div>
          <button
            type="button"
            className="secondary-button"
            style={{ width: 'auto' }}
            disabled={!liveMeal.mealSlot}
            onClick={() => liveMeal.mealSlot && openFeedback(liveMeal.mealSlot, liveMeal.dayIndex, messMenu.find((row) => row.slot === liveMeal.mealSlot)?.days[liveMeal.dayIndex])}
          >
            {liveMeal.mealSlot ? `Rate ${liveMeal.mealSlot}` : 'Feedback Locked'}
          </button>
        </div>

        <div className="mess-status-banner">
          <div>
            <span className="tiny-chip">Live mess status</span>
            <h3>{activeMealLabel}</h3>
            <p>{liveMeal.dayLabel} · {liveMeal.timeLabel}</p>
          </div>
          <div className="mess-status-pill">
            {liveMeal.mealSlot ? 'Open for feedback' : 'Feedback opens during meal hours'}
          </div>
        </div>

        <div className="mess-grid">
          <div className="meal-board">
            <div className="meal-calendar-header">
              <div className="meal-head-corner">Meal</div>
              {weekdayLabels.map((day, index) => (
                <div key={day} className={`meal-head-cell ${liveMeal.dayIndex === index ? 'active' : ''}`}>
                  {day}
                </div>
              ))}
            </div>
            {messMenu.map((row) => (
              <div key={row.slot} className={`meal-row ${liveMeal.mealSlot === row.slot ? 'active' : ''}`}>
                <div className="meal-slot">{row.slot}</div>
                {row.days.map((meal, index) => (
                  <button
                    key={`${row.slot}-${index}`}
                    type="button"
                    className={`meal-cell ${isRateableMeal(row.slot, index) ? 'active' : ''}`}
                    disabled={!isRateableMeal(row.slot, index)}
                    onClick={() => openFeedback(row.slot, index, meal)}
                  >
                    <RestaurantMenuRoundedIcon className="meal-icon" />
                    <span>{meal}</span>
                    <small className="meal-feedback-link">{isRateableMeal(row.slot, index) ? 'Review this meal' : 'Locked'}</small>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {selectedMeal ? (
          <div className="feedback-modal-overlay" onClick={closeFeedback}>
            <div className="feedback-modal" onClick={(event) => event.stopPropagation()}>
              <h3>Mess Feedback</h3>
              <p>{selectedMeal.slot} · {weekdayLabels[selectedMeal.day]}</p>
              <p className="small-muted">{selectedMeal.item}</p>

              <label className="field mt-12">
                <span>Rating</span>
                <select value={rating} onChange={(event) => setRating(Number(event.target.value))}>
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Very Poor</option>
                </select>
              </label>

              <label className="field mt-12">
                <span>Review</span>
                <textarea rows={4} value={review} onChange={(event) => setReview(event.target.value)} placeholder="Share your feedback about taste, quality, and hygiene." />
              </label>

              <div className="modal-actions">
                <button type="button" className="ghost-button" onClick={closeFeedback}>Cancel</button>
                <button type="button" className="primary-button" onClick={submitFeedback} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </section>
  );
}
