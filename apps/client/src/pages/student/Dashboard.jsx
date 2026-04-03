import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchComplaintsMine, fetchNotices, fetchRoommates } from '../../services/api';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [noticeCount, setNoticeCount] = useState(0);
  const [pendingComplaintCount, setPendingComplaintCount] = useState(0);
  const [roomCard, setRoomCard] = useState({
    roomNumber: user?.roomNumber || '',
    block: user?.block || '',
    floor: '3rd',
    capacity: 3,
    wifi: 'WiFi connected',
    occupants: [],
    assigned: Boolean(user?.roomNumber),
  });

  useEffect(() => {
    fetchNotices().then((data) => setNoticeCount((data?.notices || []).length)).catch(() => setNoticeCount(0));
    fetchComplaintsMine()
      .then((data) => {
        const pending = (data?.complaints || []).filter((item) => item.status !== 'resolved').length;
        setPendingComplaintCount(pending);
      })
      .catch(() => setPendingComplaintCount(0));

    fetchRoommates()
      .then((data) => {
        const room = data?.room || {};
        const occupants = (data?.roommates || []).map((person) => ({
          id: person._id,
          name: person.name,
          initials: getInitials(person.name),
          isSelf: Boolean(person.isSelf),
        }));

        setRoomCard({
          roomNumber: room.roomNumber || '',
          block: room.block || '',
          floor: room.floor || '3rd',
          capacity: Number(room.capacity) || 3,
          wifi: room.wifi ? `${room.wifi} connected` : 'WiFi connected',
          occupants,
          assigned: Boolean(room.roomNumber || user?.roomNumber),
        });
      })
      .catch(() => {
        setRoomCard((prev) => ({
          ...prev,
          roomNumber: user?.roomNumber || '',
          block: user?.block || '',
          assigned: Boolean(user?.roomNumber),
        }));
      });
  }, [user?.block, user?.roomNumber]);

  const preferenceChips = useMemo(() => {
    return Object.entries(user?.preferences || {}).map(([key, value]) => `${key}: ${value}`);
  }, [user?.preferences]);

  const getInitials = (name = '') => {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || 'S';
  };

  const roommateNames = useMemo(() => roomCard.occupants.filter((item) => !item.isSelf).map((item) => item.name), [roomCard.occupants]);

  return (
    <div className="workspace-grid">
      <section className="hero-banner">
        <div>
          <h1>Good morning, {user?.name?.split(' ')[0]}!</h1>
          <p>You have {noticeCount} notices and {pendingComplaintCount} active complaint updates.</p>
        </div>
        <div className="hero-room-pill">Room {roomCard.roomNumber}-{roomCard.block}</div>
        <SchoolRoundedIcon className="hero-icon" />
      </section>

      <section className="dashboard-row">
        <article className="info-card profile-card">
          <div className="card-header">
            <h2>My Profile</h2>
            <button type="button" className="text-button" onClick={() => navigate('/student/preferences')}>
              Edit <ArrowForwardRoundedIcon fontSize="inherit" />
            </button>
          </div>
          <div className="profile-summary">
            <div className="profile-avatar large">{getInitials(user?.name)}</div>
            <div>
              <h3>{user?.name || 'Student Name'}</h3>
              <p>{user?.rollNumber || 'STU000001'} · {user?.program || 'B.Tech Computer Science'}</p>
              <div className="chips-wrap">
                {preferenceChips.length
                  ? preferenceChips.slice(0, 4).map((chip) => <span key={chip} className="tiny-chip">{chip}</span>)
                  : <span className="tiny-chip">Complete your preferences</span>}
              </div>
            </div>
          </div>
        </article>

        <article className="info-card room-card">
          <div className="card-header">
            <h2>Room Status</h2>
            <span className={`status-pill ${roomCard.assigned ? 'active' : 'pending'}`}>{roomCard.assigned ? 'Active' : 'Pending'}</span>
          </div>
          {roomCard.assigned ? (
            <>
              <div className="room-number">{roomCard.roomNumber}</div>
              <p>{roomCard.block || 'Block C'}-{roomCard.floor} Floor-{roomCard.capacity}-sharing</p>
              <div className="roommates-row">
                {(roomCard.occupants.filter((item) => !item.isSelf).slice(0, 2)).map((item, index) => (
                  <span key={item.id} className={`roommate-avatar ${index % 2 ? 'alt' : ''}`}>{item.initials}</span>
                ))}
                <span>{roommateNames.length ? roommateNames.join(' & ') : 'Roommates being updated'}</span>
              </div>
              <div className="room-meta">
                <span>{roomCard.wifi}</span>
                <span>Occupancy: {roomCard.occupants.length}/{roomCard.capacity}</span>
              </div>
            </>
          ) : (
            <div className="allocation-pending-card mt-16">
              <h3 style={{ margin: '0 0 6px' }}>Room allocation pending</h3>
              <p style={{ margin: 0 }}>Your room details will appear after allocation is assigned by the admin.</p>
            </div>
          )}
        </article>
      </section>

      <section className="quick-actions-section">
        <h3>Quick Actions</h3>
        <div className="quick-actions-grid">
          <button className="action-card" type="button" onClick={() => navigate('/student/complaints')}>
            <div className="action-icon accent-red">⚑</div>
            <h4>Raise Complaint</h4>
            <p>Report maintenance or hostel issues</p>
            <span>View More <ArrowForwardRoundedIcon fontSize="inherit" /></span>
          </button>

          <button className="action-card" type="button" onClick={() => navigate('/student/mess')}>
            <div className="action-icon accent-blue">✦</div>
            <h4>Mess Menu</h4>
            <p>Today’s meals & weekly schedule</p>
            <span>View More <ArrowForwardRoundedIcon fontSize="inherit" /></span>
          </button>

          <button className="action-card" type="button" onClick={() => navigate('/student/roommate')}>
            <div className="action-icon accent-gold">◔</div>
            <h4>Your Roommate</h4>
            <p>Know your roommate</p>
            <span>View More <ArrowForwardRoundedIcon fontSize="inherit" /></span>
          </button>
        </div>
      </section>
    </div>
  );
}
