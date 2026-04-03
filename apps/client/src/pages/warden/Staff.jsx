import { useEffect, useMemo, useState } from 'react';
import WorkHistoryRoundedIcon from '@mui/icons-material/WorkHistoryRounded';
import GroupWorkRoundedIcon from '@mui/icons-material/GroupWorkRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import WardenLayout from '../../layouts/WardenLayout';
import { fetchAdminStaff } from '../../services/api';

export default function WardenStaff() {
  const [staff, setStaff] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchAdminStaff().then((data) => setStaff(data.staff || [])).catch(() => setStaff([]));
  }, []);

  const filteredStaff = useMemo(() => staff.filter((member) => {
    const searchValue = `${member.name} ${member.department} ${member.email}`.toLowerCase();
    return searchValue.includes(query.toLowerCase());
  }), [staff, query]);

  const departmentGroups = useMemo(() => {
    const groups = {};
    filteredStaff.forEach((member) => {
      groups[member.department] = (groups[member.department] || 0) + 1;
    });
    return groups;
  }, [filteredStaff]);

  return (
    <WardenLayout>
      <section className="warden-page">
        <section className="hero-banner admin-hero-banner">
          <div>
            <h1>Staff</h1>
            <p>Manage hostel staff by role and keep service assignments visible.</p>
          </div>
          <button type="button" className="secondary-button admin-add-button">
            <GroupWorkRoundedIcon fontSize="small" /> Add Staff
          </button>
        </section>

        <div className="admin-role-grid">
          {Object.entries(departmentGroups).map(([department, count]) => (
            <article key={department} className="admin-role-card">
              <WorkHistoryRoundedIcon />
              <div>
                <h3>{department}</h3>
                <p>Total: {count}</p>
              </div>
            </article>
          ))}
        </div>

        <article className="warden-panel admin-panel">
          <div className="card-header">
            <h3>Search Staff</h3>
            <label className="inline-search">
              <SearchRoundedIcon fontSize="small" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or role" />
            </label>
          </div>

          <div className="admin-staff-grid mt-16">
            {filteredStaff.map((member) => (
              <article key={member._id || member.email} className="admin-staff-card">
                <div className="admin-staff-head">
                  <div className="profile-avatar">{getInitials(member.name)}</div>
                  <div>
                    <h4>{member.name}</h4>
                    <p>{member.department}</p>
                  </div>
                </div>
                <div className="staff-meta-row">
                  <span><BadgeRoundedIcon fontSize="small" /> {member.role}</span>
                  <span>{member.activeTickets || 0} active tickets</span>
                </div>
                <button type="button" className="primary-button compact w-full">Assign Work</button>
              </article>
            ))}
          </div>
        </article>
      </section>
    </WardenLayout>
  );
}

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'S';
}
