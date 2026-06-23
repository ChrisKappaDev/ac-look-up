import { fetchDriverData } from '../lib/driver-service';
import DashboardShell from '../components/dashboard-shell';

export const revalidate = 3600;

export default async function Home() {
  const data = await fetchDriverData();

  return (
    <main className="page-shell">
      <div className="hero-panel">
        <div>
          <p className="eyebrow">Sim racing analytics</p>
          <h1>Full Force Sim Look Up</h1>
          <p className="hero-copy">Search any driver and discover rating, safety, tier, confidence, and leaderboard trends with a modern performance dashboard.</p>
        </div>
      </div>

      <DashboardShell data={data} />
    </main>
  );
}
