import { useEffect, useMemo, useState } from 'react';
import CallSplitRoundedIcon from '@mui/icons-material/CallSplitRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import DoorFrontRoundedIcon from '@mui/icons-material/DoorFrontRounded';
import WardenLayout from '../../layouts/WardenLayout';
import { fetchAdminOverview, fetchAdminStudents, fetchRooms } from '../../services/api';

export default function WardenAllocation() {
  const [overview, setOverview] = useState({ stats: {} });
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchAdminOverview().then(setOverview).catch(() => setOverview({ stats: {} }));
    fetchAdminStudents().then((data) => setStudents(data.students || [])).catch(() => setStudents([]));
    fetchRooms().then((data) => setRooms(data.rooms || [])).catch(() => setRooms([]));
  }, []);

  const unassignedStudents = useMemo(() => students.filter((student) => !student.isAssigned), [students]);
  const availableRooms = useMemo(() => rooms.filter((room) => room.status !== 'maintenance' && (room.students?.length || 0) < room.capacity), [rooms]);
  const allocationReady = (overview.stats.activeStudents || 0) > 21;

  return (
    <WardenLayout>
      <section className="warden-page">
        <section className="hero-banner admin-hero-banner">
          <div>
            <h1>Room Allocation</h1>
            <p>Supervise pending allocations and room availability.</p>
          </div>
          <div className="hero-room-pill">{allocationReady ? 'Allocation active' : 'Allocation in process'}</div>
          <CallSplitRoundedIcon className="hero-icon" />
        </section>

        <div className="warden-stats-grid admin-stats-grid">
          <article className="warden-stat-card admin-stat-card"><span>Students waiting</span><strong>{unassignedStudents.length}</strong></article>
          <article className="warden-stat-card admin-stat-card"><span>Available rooms</span><strong>{availableRooms.length}</strong></article>
          <article className="warden-stat-card admin-stat-card"><span>Assigned students</span><strong>{overview.stats.activeStudents || 0}</strong></article>
          <article className="warden-stat-card admin-stat-card"><span>Allocation status</span><strong>{allocationReady ? 'Ready' : 'Locked'}</strong></article>
        </div>

        <div className="allocation-grid">
          <article className="warden-panel admin-panel">
            <h3>Students without allocation</h3>
            <div className="cards-stack mt-16">
              {unassignedStudents.slice(0, 5).map((student) => (
                <div key={student._id || student.email} className="admin-mini-row">
                  <PersonRoundedIcon fontSize="small" />
                  <div>
                    <strong>{student.name}</strong>
                    <p>{student.program} · {student.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="warden-panel admin-panel">
            <h3>Available rooms</h3>
            <div className="cards-stack mt-16">
              {availableRooms.slice(0, 5).map((room) => (
                <div key={room._id || room.roomNumber} className="admin-mini-row">
                  <DoorFrontRoundedIcon fontSize="small" />
                  <div>
                    <strong>Room {room.roomNumber}</strong>
                    <p>{room.block} · {room.students?.length || 0}/{room.capacity} filled</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </WardenLayout>
  );
}
