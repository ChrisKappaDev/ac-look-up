export default function AboutPage() {
  return (
    <main className="page-shell">
      <div className="hero-panel">
        <p className="eyebrow">About Full Force Sim Look Up</p>
        <h1>Race data with clarity</h1>
        <p className="hero-copy">
          Full Force Sim Look Up is built by THEHSMACHINE to help sim racers explore player profiles, tier distribution, rating trends, and safety data. The app aggregates statistics collected from a
          selection of Full Force (FFS) servers this dataset covers only Full Force servers and may not include drivers or races from other networks.
        </p>

        <p className="hero-copy">
          We surface race-level and driver-level and computed ratings so you can analyze performance and trends across the roster. metrics including races, laps completed, lap times, finishes,
          penalties,
        </p>
      </div>

      <section className="content-grid">
        <div className="panel cold-glow">
          <h2>Why this app exists</h2>
          <p>Tracking rating and safety metrics should feel fast and visual. This app highlights performance across drivers using responsive Recharts visuals and curated player summaries.</p>
        </div>

        <div className="panel warm-glow">
          <h2>How to use it</h2>
          <p>Search for a driver or open a profile from the leaderboard. The dashboard shows tier spread, rivals, and rating momentum so you can compare a selected driver against the whole roster.</p>
        </div>
      </section>
    </main>
  );
}
