import { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { fetchRooms } from '../services/api';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms().then((data) => {
      setRooms(data.rooms || []);
    });
  }, []);

  return (
    <AppShell title="Rooms">
      <section className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Room</th>
                <th>Block</th>
                <th>Status</th>
                <th>Students</th>
                <th>Compatibility</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.roomNumber}</td>
                  <td>{room.block}</td>
                  <td><span className={`pill ${room.status}`}>{room.status}</span></td>
                  <td>{room.students?.join(', ') || '-'}</td>
                  <td>{room.compatibilityScore || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
