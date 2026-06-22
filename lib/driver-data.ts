import fs from 'fs';
import path from 'path';

type DriverStats = {
  rating: number;
  safety: number;
  tier: string;
  confidence: number;
};

export type DriverProfile = DriverStats & {
  name: string;
  ratingPosition: number;
  ratingShare: number;
};

export type DriverData = {
  version: number;
  lastUpdated: string;
  drivers: Record<string, DriverStats>;
};

const localPath = path.join(process.cwd(), 'data', 'ratings.json');
const remoteUrl = 'https://raw.githubusercontent.com/ChrisKappaDev/ac-rating-system.github.io/main/ratings.json';

async function fetchRemoteData(): Promise<DriverData | null> {
  try {
    const response = await fetch(remoteUrl, { cache: 'no-store' });
    if (!response.ok) return null;
    return (await response.json()) as DriverData;
  } catch {
    return null;
  }
}

export async function fetchDriverData(): Promise<DriverData> {
  const remote = await fetchRemoteData();
  if (remote) return remote;

  const text = await fs.promises.readFile(localPath, 'utf8');
  return JSON.parse(text) as DriverData;
}

export function buildDriverProfiles(data: DriverData): DriverProfile[] {
  const list = Object.entries(data.drivers).map(([name, stats]) => ({
    name,
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
