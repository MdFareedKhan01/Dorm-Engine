import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppShell({ title, children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-pane">
        <Topbar title={title} />
        <section className="content-pane">{children}</section>
      </main>
    </div>
  );
}
