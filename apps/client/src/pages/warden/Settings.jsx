import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ThemeRoundedIcon from '@mui/icons-material/PaletteRounded';
import WardenLayout from '../../layouts/WardenLayout';

export default function WardenSettings() {
  return (
    <WardenLayout>
      <section className="warden-page">
        <section className="hero-banner admin-hero-banner">
          <div>
            <h1>Settings</h1>
            <p>Review system controls, allocation rules, and portal preferences.</p>
          </div>
          <SettingsRoundedIcon className="hero-icon" />
        </section>

        <div className="warden-split admin-split">
          <article className="warden-panel admin-panel">
            <h3>Portal Preferences</h3>
            <div className="settings-list mt-16">
              <div className="settings-row">
                <ThemeRoundedIcon />
                <div>
                  <strong>Theme</strong>
                  <p>Use the topbar sun and moon icon to switch between light and dark mode.</p>
                </div>
              </div>
              <div className="settings-row">
                <SettingsRoundedIcon />
                <div>
                  <strong>Allocation rule</strong>
                  <p>Room allocation stays in process until student count exceeds 21, then three students share a room.</p>
                </div>
              </div>
            </div>
          </article>

          <article className="warden-panel admin-panel">
            <h3>Admin Account</h3>
            <p>The admin portal is connected to the live database and seeded demo content. Use this area to supervise hostel operations only.</p>
          </article>
        </div>
      </section>
    </WardenLayout>
  );
}
