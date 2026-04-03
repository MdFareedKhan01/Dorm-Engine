import { Outlet } from 'react-router-dom';
import WardenSidebar from '../components/WardenSidebar';
import WardenTopbar from '../components/WardenTopbar';

export default function WardenLayout({ children }) {
  return (
    <div className="app-shell warden-shell">
      <WardenSidebar />
      <main className="main-pane">
        <WardenTopbar />
        <section className="content-pane warden-content">
          {children ?? <Outlet />}
        </section>
      </main>
    </div>
  );
}
