export type DriverStats = {
  guid: string;
  name: string;
  rating: number;
  safety: number;
  pace: number;
  racecraft: number;
  consistency: number;
  confidence: number;
  aggression: number;
  tier: string;
  stats: {
    races: number;
    wins: number;
    podiums: number;
    top5: number;
    top10: number;
    dnf: number;
    penalties: number;
    lapPenalties: number;
    disqualified: number;
    collisions: number;
    carCollisions: number;
    envCollisions: number;
    heavyCollisions: number;
    impactScore: number;
    cleanRaces: number;
    lapsCompleted: number;
    bestLapSamples: number;
    avgBestLapMs: number;
    avgFinish: number;
    avgFieldSize: number;
  };
};

export type DriverData = {
  version: number;
  lastUpdated: string;
  meta?: {
    processedFiles: number;
    skippedFiles: number;
    totalDrivers: number;
    algorithm: string;
  };
  drivers: Record<string, DriverStats>;
};

export type DriverProfile = DriverStats & {
  ratingPosition: number;
  ratingShare: number;
};

export function buildDriverProfiles(data: DriverData): DriverProfile[] {
  const list = Object.entries(data.drivers).map(([key, stats]) => ({
    guid: stats.guid ?? key,
    name: stats.name ?? key,
    ...stats,
  }));

  const sorted = [...list].sort((a, b) => b.rating - a.rating);
  return sorted.map((driver, index) => ({
    ...driver,
    ratingPosition: index + 1,
    ratingShare: Number(((driver.rating / 2000) * 100).toFixed(1)),
  }));
}

export function getTierCounts(data: DriverData) {
  return Object.values(data.drivers).reduce<Record<string, number>>((acc, driver) => {
    acc[driver.tier] = (acc[driver.tier] ?? 0) + 1;
    return acc;
  }, {});
}
