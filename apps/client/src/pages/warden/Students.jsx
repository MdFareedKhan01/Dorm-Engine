import { useEffect, useMemo, useState } from 'react';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import WardenLayout from '../../layouts/WardenLayout';
import { createAdminStudent, fetchAdminStudentStats, fetchAdminStudents } from '../../services/api';

const initialForm = {
  name: '',
  email: '',
  password: '',
  rollNumber: '',
  program: '',
  year: '1st Year',
  block: 'Block C',
  roomNumber: '',
  feeStatus: 'paid',
};

export default function WardenStudents() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({});
  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchAdminStudents().then((data) => setStudents(data.students || [])).catch(() => setStudents([]));
    fetchAdminStudentStats().then(setStats).catch(() => setStats({}));
  }, []);

  const filteredStudents = useMemo(() => students.filter((student) => {
    const searchValue = `${student.name} ${student.rollNumber} ${student.roomNumber} ${student.program}`.toLowerCase();
    return searchValue.includes(query.toLowerCase());
  }), [students, query]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      const result = await createAdminStudent(form);
      if (result?.student) {
        setStudents((currentStudents) => [result.student, ...currentStudents]);
        setForm(initialForm);
        setFormOpen(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents || students.length },
    { label: 'Active Students', value: stats.activeProfiles || students.filter((item) => item.profileComplete).length },
    { label: 'New Admissions', value: stats.newAdmissions || 0 },
    { label: 'Students without allocation', value: stats.unassignedStudents || 0 },
  ];

  return (
    <WardenLayout>
      <section className="warden-page">
        <section className="hero-banner admin-hero-banner">
          <div>
            <h1>Students</h1>
            <p>Manage all hostel students and keep room allocation records current.</p>
          </div>
          <button type="button" className="secondary-button admin-add-button" onClick={() => setFormOpen(true)}>
            <AddRoundedIcon fontSize="small" /> Add Student
          </button>
        </section>

        <div className="warden-stats-grid admin-stats-grid">
          {statCards.map((stat) => (
            <article key={stat.label} className="warden-stat-card admin-stat-card">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </div>

        <article className="warden-panel admin-panel">
          <div className="card-header">
            <h3>Search & Filters</h3>
            <label className="inline-search">
              <SearchRoundedIcon fontSize="small" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, ID, or room" />
            </label>
          </div>

          <div className="table-card admin-table-card mt-16">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>ID</th>
                  <th>Course</th>
                  <th>Year</th>
                  <th>Room</th>
                  <th>Fee Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student._id || student.email}>
                    <td><PeopleAltRoundedIcon className="table-icon" /> {student.name}</td>
                    <td>{student.rollNumber || 'N/A'}</td>
                    <td>{student.program}</td>
                    <td>{student.year}</td>
                    <td>{student.roomNumber || 'Unassigned'}</td>
                    <td><span className={`status-tag ${student.feeStatus || 'paid'}`}>{student.feeStatus || 'paid'}</span></td>
                    <td>
                      <button type="button" className="action-link" onClick={() => setSelectedStudent(student)}>
                        <VisibilityRoundedIcon fontSize="small" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {formOpen ? (
          <div className="feedback-modal-overlay" onClick={() => setFormOpen(false)}>
            <div className="feedback-modal admin-modal" onClick={(event) => event.stopPropagation()}>
              <h3>Add Student</h3>
              <p>Create a new student record with room and fee status.</p>
              <div className="admin-form-grid mt-16">
                {Object.entries(initialForm).map(([key, value]) => (
                  <label key={key} className="field">
                    <span>{key}</span>
                    {key === 'feeStatus' ? (
                      <select name={key} value={form[key]} onChange={handleChange}>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                      </select>
                    ) : (
                      <input name={key} value={form[key]} onChange={handleChange} placeholder={value} />
                    )}
                  </label>
                ))}
              </div>
              <div className="modal-actions">
                <button type="button" className="ghost-button" onClick={() => setFormOpen(false)}>Cancel</button>
                <button type="button" className="primary-button" onClick={handleCreate} disabled={saving}>{saving ? 'Saving...' : 'Add Student'}</button>
              </div>
            </div>
          </div>
        ) : null}

        {selectedStudent ? (
          <div className="feedback-modal-overlay" onClick={() => setSelectedStudent(null)}>
            <div className="feedback-modal admin-modal" onClick={(event) => event.stopPropagation()}>
              <h3>{selectedStudent.name}</h3>
              <p>{selectedStudent.program}</p>
              <div className="admin-detail-list mt-16">
                <div><span>Roll Number</span><strong>{selectedStudent.rollNumber || 'N/A'}</strong></div>
                <div><span>Year</span><strong>{selectedStudent.year}</strong></div>
                <div><span>Block</span><strong>{selectedStudent.block}</strong></div>
                <div><span>Room</span><strong>{selectedStudent.roomNumber || 'Unassigned'}</strong></div>
                <div><span>Fee Status</span><strong className={`status-tag ${selectedStudent.feeStatus || 'paid'}`}>{selectedStudent.feeStatus || 'paid'}</strong></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="ghost-button" onClick={() => setSelectedStudent(null)}>Close</button>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </WardenLayout>
  );
}
