import { useEffect, useMemo, useState } from 'react';
import DoorFrontRoundedIcon from '@mui/icons-material/DoorFrontRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import WardenLayout from '../../layouts/WardenLayout';
import { fetchRooms, fetchRoomStats } from '../../services/api';

export default function WardenRooms() {
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState({});
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchRooms().then((data) => setRooms(data.rooms || [])).catch(() => setRooms([]));
    fetchRoomStats().then(setStats).catch(() => setStats({}));
  }, []);

  const filteredRooms = useMemo(() => rooms.filter((room) => {
    const searchValue = `${room.roomNumber} ${room.block} ${room.status}`.toLowerCase();
    return searchValue.includes(query.toLowerCase());
  }), [rooms, query]);

  return (
    <WardenLayout>
      <section className="warden-page">
        <section className="hero-banner admin-hero-banner">
          <div>
            <h1>Rooms</h1>
            <p>Manage hostel rooms and availability in real time.</p>
          </div>
          <button type="button" className="secondary-button admin-add-button">
            <DoorFrontRoundedIcon fontSize="small" /> Add Room
          </button>
        </section>

        <div className="warden-stats-grid admin-stats-grid">
          <article className="warden-stat-card admin-stat-card"><span>Total Rooms</span><strong>{rooms.length || 0}</strong></article>
          <article className="warden-stat-card admin-stat-card"><span>Occupied Rooms</span><strong>{stats.occupied || 0}</strong></article>
          <article className="warden-stat-card admin-stat-card"><span>Available Rooms</span><strong>{stats.empty || 0}</strong></article>
          <article className="warden-stat-card admin-stat-card"><span>Under Maintenance</span><strong>{stats.maintenance || 0}</strong></article>
        </div>

        <article className="warden-panel admin-panel">
          <div className="card-header">
            <h3>Search & Advanced Filters</h3>
            <label className="inline-search">
              <SearchRoundedIcon fontSize="small" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Room number / block" />
            </label>
          </div>

          <div className="admin-room-grid mt-16">
            {filteredRooms.map((room) => (
              <article key={room._id || room.roomNumber} className="admin-room-card">
                <div className="card-header">
                  <h4>Room {room.roomNumber}</h4>
                  <span className={`status-tag ${room.status}`}>{room.status}</span>
                </div>
                <p>{room.block} · {room.floor} Floor</p>
                <p>{room.capacity} sharing · {room.students?.length || 0}/{room.capacity} filled</p>
                <div className="admin-room-footer">
                  <span>{room.ac ? 'AC' : 'Non-AC'}</span>
                  <span>{room.wifi}</span>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>
    </WardenLayout>
  );
}
