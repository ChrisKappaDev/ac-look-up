'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { DriverData } from '../lib/driver-utils';

type LookupDriver = {
  name: string;
  rating: number;
  safety: number;
  tier: string;
  confidence: number;
};

type DriverLookupProps = {
  data: DriverData;
};

export default function DriverLookup({ data }: DriverLookupProps) {
  const router = useRouter();

  const allDrivers = useMemo<LookupDriver[]>(() => {
    return Object.entries(data.drivers)
      .map(([key, stats]) => ({ ...stats, name: stats.name ?? key }))
      .sort((a, b) => b.rating - a.rating);
  }, [data.drivers]);

  const [query, setQuery] = useState('');

  const match = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return null;
    return allDrivers.find((driver) => driver.name.toLowerCase() === search) ?? null;
  }, [allDrivers, query]);

  const openProfile = () => {
    if (!match) return;
    router.push(`/player/${encodeURIComponent(match.name)}`);
  };

  return (
    <div>
      <h2>Driver search</h2>
      <p className="hero-copy">Type a driver name and press Enter to go directly to their profile.</p>
      <label htmlFor="driver-search" className="sr-only">
        Search driver
      </label>
      <input
        id="driver-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && match) {
            event.preventDefault();
            openProfile();
          }
        }}
        placeholder="Enter full driver name..."
        autoComplete="off"
      />

      <div className="lookup-note">
        {query.trim() ? (
          match ? (
            <button type="button" className="search-action" onClick={openProfile}>
              Open {match.name}'s profile
            </button>
          ) : (
            <p className="search-note">No exact match found. Try the full driver name.</p>
          )
        ) : (
          <p className="search-note">Start typing a driver name to open their profile.</p>
        )}
      </div>
    </div>
  );
}
