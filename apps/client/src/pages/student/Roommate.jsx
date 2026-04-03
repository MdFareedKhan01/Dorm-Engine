import { useEffect, useMemo, useState } from 'react';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import WifiRoundedIcon from '@mui/icons-material/WifiRounded';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import { fetchRoommates, submitRoommateFeedback } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'R';
}

function toTraitChips(personalityType = '') {
  if (!personalityType) {
    return ['Roommate', 'Shared Space'];
  }
  const map = {
    I: 'Quiet Focus',
    E: 'Social Energy',
    N: 'Big Picture',
    S: 'Practical',
    F: 'Empathetic',
    T: 'Logical',
    J: 'Structured',
    P: 'Flexible',
  };
  return personalityType
    .split('')
    .map((letter) => map[letter])
    .filter(Boolean)
    .slice(0, 3);
}

export default function Roommate() {
  const { user } = useAuth();
  const [roomInfo, setRoomInfo] = useState({
    roomNumber: '304',
    block: 'Block C',
    floor: '3rd',
    capacity: 3,
    wifi: 'Available',
    ac: 'Active',
  });
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackState, setFeedbackState] = useState({});
  const [currentStudentId, setCurrentStudentId] = useState('');

  useEffect(() => {
    let mounted = true;
    fetchRoommates()
      .then((data) => {
        if (!mounted) return;
        setRoomInfo(data.room || {});

        const normalized = (data.roommates || []).map((student) => {
          const isSelfById = data.currentStudentId && String(student._id) === String(data.currentStudentId);
          const isSelfByAuth = user?._id && String(student._id) === String(user._id);
          const isSelfByEmail = user?.email && student.email && String(student.email).toLowerCase() === String(user.email).toLowerCase();
          return {
            ...student,
            isSelf: Boolean(student.isSelf || isSelfById || isSelfByAuth || isSelfByEmail),
          };
        });

        normalized.sort((a, b) => {
          if (a.isSelf && !b.isSelf) return -1;
          if (!a.isSelf && b.isSelf) return 1;
          return 0;
        });

        setCurrentStudentId(data.currentStudentId || user?._id || '');
        setRoommates(normalized);
        const initialFeedback = Object.fromEntries(
          normalized
            .filter((student) => !student.isSelf)
            .map((student) => [
              student._id,
              {
                rating: student.feedback?.rating || '',
                note: student.feedback?.note || '',
                submitting: false,
              },
            ])
        );
        setFeedbackState(initialFeedback);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [user?._id, user?.email]);

  const roommateCount = useMemo(() => roommates.length, [roommates]);

  const handleFeedbackChange = (roommateId, key, value) => {
    setFeedbackState((prev) => ({
      ...prev,
      [roommateId]: {
        ...(prev[roommateId] || {}),
        [key]: value,
      },
    }));
  };

  const handleFeedbackSubmit = async (roommateId) => {
    if (currentStudentId && String(roommateId) === String(currentStudentId)) {
      return;
    }

    const current = feedbackState[roommateId] || {};
    const rating = Number(current.rating || 0);
    if (!rating) {
      return;
    }

    setFeedbackState((prev) => ({
      ...prev,
      [roommateId]: {
        ...(prev[roommateId] || {}),
        submitting: true,
      },
    }));

    try {
      await submitRoommateFeedback({
        toStudentId: roommateId,
        rating,
        note: current.note || '',
      });
    } finally {
      setFeedbackState((prev) => ({
        ...prev,
        [roommateId]: {
          ...(prev[roommateId] || {}),
          submitting: false,
        },
      }));
    }
  };

  if (loading) {
    return (
      <section className="page-panel">
        <div style={{ display: 'grid', placeItems: 'center', minHeight: '400px' }}>
          <div className="spinner" />
        </div>
      </section>
    );
  }

  return (
    <section className="page-panel">
      <div className="panel-title between" style={{ marginBottom: '24px' }}>
        <div>
          <h2>Your Roommates</h2>
          <p>Room details first, then all 3 students in your room below.</p>
        </div>
      </div>

      <div className="roommate-grid">
        <article className="room-info-card room-details-block">
          <div className="room-info-header">
            <HomeRoundedIcon style={{ fontSize: '32px', color: 'var(--brand)' }} />
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '28px', fontWeight: '800', color: 'var(--heading)' }}>
                {roomInfo.roomNumber || '304'}
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>{roomInfo.block || 'Block C'}</p>
            </div>
          </div>

          <div className="room-info-grid">
            <div className="room-info-item">
              <span className="room-info-label">Floor</span>
              <span className="room-info-value">{roomInfo.floor || '3rd'}</span>
            </div>
            <div className="room-info-item">
              <span className="room-info-label">Capacity</span>
              <span className="room-info-value">{roomInfo.capacity || 3} students</span>
            </div>
            <div className="room-info-item">
              <span className="room-info-label">WiFi</span>
              <span className="room-info-value">
                <WifiRoundedIcon style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                {roomInfo.wifi || 'Available'}
              </span>
            </div>
            <div className="room-info-item">
              <span className="room-info-label">AC Unit</span>
              <span className="room-info-value">{roomInfo.ac || 'Active'}</span>
            </div>
          </div>

          <div className="room-amenities">
            <h4 style={{ margin: '0 0 10px', color: 'var(--heading)', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' }}>
              Occupancy
            </h4>
            <div className="amenity-list">
              <span className="amenity-tag">{roommateCount}/{roomInfo.capacity || 3} Filled</span>
              <span className="amenity-tag">Shared Wardrobe</span>
              <span className="amenity-tag">Study Area</span>
            </div>
          </div>
        </article>

        <div className="roommates-grid-three">
          {roommates.map((person) => {
            const localFeedback = feedbackState[person._id] || {};
            const isSelfById = Boolean(currentStudentId && String(person._id) === String(currentStudentId));
            const isSelfByAuthId = Boolean(user?._id && String(person._id) === String(user._id));
            const isSelfByEmail = Boolean(user?.email && person?.email && String(user.email).toLowerCase() === String(person.email).toLowerCase());
            const isSelfByName = Boolean(user?.name && person?.name && String(user.name).trim().toLowerCase() === String(person.name).trim().toLowerCase());
            const canRate = !(person.isSelf || isSelfById || isSelfByAuthId || isSelfByEmail || isSelfByName);

            return (
              <article key={person._id} className={`roommate-card ${person.isSelf ? '' : 'matched'}`}>
                {canRate ? <div className="match-badge">Roommate</div> : null}

                <div className="roommate-card-header">
                  <div className="roommate-avatar">{getInitials(person.name)}</div>
                  <div className="roommate-info">
                    <h3>{person.name}</h3>
                    <p className="roommate-role">{canRate ? 'Roommate' : '(You)'}</p>
                    <p className="roommate-detail">{person.program}</p>
                    {canRate ? (
                      <p className="compatibility-score">
                        <ThumbUpRoundedIcon style={{ fontSize: '14px', marginRight: '4px', verticalAlign: 'middle' }} />
                        {person.preferenceCount || 0} preference fields completed
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="roommate-traits">
                  {toTraitChips(person.personalityType).map((item) => (
                    <span key={`${person._id}-${item}`} className="trait-badge">{item}</span>
                  ))}
                </div>

                {canRate ? (
                  <div className="roommate-feedback-card">
                    <div className="match-details">
                      <div className="match-stat">
                        <span className="match-stat-label">Personality</span>
                        <span className="match-stat-value">{person.personalityType || 'N/A'}</span>
                      </div>
                      <div className="match-stat">
                        <span className="match-stat-label">Feedback Rating</span>
                        <span className="match-stat-value">{localFeedback.rating || 'Not rated'}</span>
                      </div>
                    </div>

                    <div className="roommate-feedback-form">
                      <label>
                        <span>Rate this roommate</span>
                        <select
                          value={localFeedback.rating || ''}
                          onChange={(event) => handleFeedbackChange(person._id, 'rating', event.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </select>
                      </label>
                      <label>
                        <span>Feedback Note (optional)</span>
                        <textarea
                          rows={2}
                          placeholder="Short note about room habits..."
                          value={localFeedback.note || ''}
                          onChange={(event) => handleFeedbackChange(person._id, 'note', event.target.value)}
                        />
                      </label>
                      <button
                        type="button"
                        className="secondary-button roommate-feedback-button"
                        disabled={localFeedback.submitting}
                        onClick={() => handleFeedbackSubmit(person._id)}
                      >
                        {localFeedback.submitting ? 'Saving...' : 'Save Feedback'}
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
