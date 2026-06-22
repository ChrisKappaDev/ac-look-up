import type { DriverData } from './driver-utils';

const remoteUrl = 'https://raw.githubusercontent.com/ChrisKappaDev/ac-rating-system.github.io/main/ratings-full.json';

export async function fetchDriverData(): Promise<DriverData> {
  const response = await fetch(remoteUrl, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to fetch driver data: ${response.status} ${response.statusText}`);
  }

  const raw = await response.text();

  try {
    return JSON.parse(raw) as DriverData;
  } catch (error) {
    throw new Error(`Failed to parse driver data JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}
