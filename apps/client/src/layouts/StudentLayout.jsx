import { Outlet } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';
import StudentTopbar from '../components/StudentTopbar';

export default function StudentLayout() {
  return (
    <div className="app-shell student-shell">
      <StudentSidebar />
      <main className="main-pane">
        <StudentTopbar />
        <section className="content-pane student-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
