import Link from 'next/link';
import { buildDriverProfiles } from '../../../lib/driver-utils';
import { fetchDriverData } from '../../../lib/driver-service';
import type { DriverData } from '../../../lib/driver-utils';
import DriverProfile from '../../../components/driver-profile';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

export default async function PlayerPage({ params }: { params: { name: string } }) {
  const data: DriverData = await fetchDriverData();
  const players = buildDriverProfiles(data);
  const playerName = decodeURIComponent(params.name);
  const player = players.find((driver) => driver.name === playerName);

  if (!player) return notFound();

  return (
    <main className="page-shell">
      <div className="hero-panel">
        <p className="eyebrow">Driver detail</p>
        <h1>{player.name}</h1>
        <p className="hero-copy">Full profile for the selected driver, sourced directly from remote AC rating data.</p>
        <div className="hero-actions">
          <Link href="/" className="home-button">
            ← Back home
          </Link>
        </div>
      </div>

      <section className="content-grid">
        <div className="panel warm-glow">
          <DriverProfile data={data} selectedName={player.name} />
        </div>
      </section>
    </main>
  );
}
