'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { buildDriverProfiles, DriverData, getTierCounts } from '../lib/driver-utils';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Radar,
  RadarChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type DriverProfileProps = {
  data: DriverData;
  selectedName: string;
};

const TIER_COLORS: Record<string, string> = {
  MASTER: '#9d96ff',
  DIAMOND: '#7ec8ff',
  GOLD: '#ffcd6d',
  BRONZE: '#ff7e6d',
  SILVER: '#7ef2b5',
};

export default function DriverProfile({ data, selectedName }: DriverProfileProps) {
  const drivers = useMemo(() => buildDriverProfiles(data), [data]);
  const selected = useMemo(() => drivers.find((driver) => driver.name === selectedName) ?? drivers[0], [drivers, selectedName]);

  const tierData = useMemo(() => Object.entries(getTierCounts(data)).map(([tier, count]) => ({ name: tier, value: count })), [data]);

  const scoreSeries = useMemo(() => drivers.slice(0, 30).map((driver, index) => ({ name: driver.name, rating: driver.rating, index })), [drivers]);

  const metricComparisonData = useMemo(() => {
    const avgRating = drivers.reduce((sum, driver) => sum + driver.rating, 0) / drivers.length;
    const avgSafety = drivers.reduce((sum, driver) => sum + driver.safety, 0) / drivers.length;
    const avgConfidence = drivers.reduce((sum, driver) => sum + driver.confidence, 0) / drivers.length;

    return [
      { subject: 'Rating', selected: Number(((selected.rating / 2000) * 100).toFixed(1)), average: Number(((avgRating / 2000) * 100).toFixed(1)) },
      { subject: 'Safety', selected: selected.safety, average: Number(avgSafety.toFixed(1)) },
      { subject: 'Confidence', selected: selected.confidence, average: Number(avgConfidence.toFixed(1)) },
    ];
  }, [drivers, selected]);

  const relativeRating = useMemo(() => {
    const rank = selected.ratingPosition;
    const offset = Math.max(0, rank - 30);
    return drivers.slice(offset, offset + 30).map((driver) => ({
      name: driver.name,
      rating: driver.rating,
      focus: driver.name === selected.name,
    }));
  }, [drivers, selected]);

  const ratingPercentile = useMemo(() => Number(((drivers.filter((driver) => driver.rating <= selected.rating).length / drivers.length) * 100).toFixed(1)), [drivers, selected]);

  const safetyPercentile = useMemo(() => Number(((drivers.filter((driver) => driver.safety <= selected.safety).length / drivers.length) * 100).toFixed(1)), [drivers, selected]);

  const confidencePercentile = useMemo(() => Number(((drivers.filter((driver) => driver.confidence <= selected.confidence).length / drivers.length) * 100).toFixed(1)), [drivers, selected]);

  const playerRadarData = useMemo(
    () => [
      { subject: 'Rating', value: Number(((selected.rating / 2000) * 100).toFixed(1)), fullMark: 100 },
      { subject: 'Safety', value: selected.safety, fullMark: 100 },
      { subject: 'Confidence', value: selected.confidence, fullMark: 100 },
    ],
    [selected],
  );

  const truncate = (s: string, n = 20) => (s && s.length > n ? `${s.slice(0, n - 1)}…` : s);

  return (
    <div className="profile-shell">
      <div className="profile-header profile-card">
        <div>
          <p className="eyebrow">Driver profile</p>
          <h2>{selected.name}</h2>
          <p className="hero-copy">Performance snapshot with tier spread, current rating, safety metrics, and closest competitors.</p>
        </div>
        <div className="metric-grid">
          <div className="metric-item">
            <span>Current rating</span>
            <strong>{selected.rating}</strong>
          </div>
          <div className="metric-item">
            <span>Safety score</span>
            <strong>{selected.safety}%</strong>
          </div>
          <div className="metric-item">
            <span>Leaderboard rank</span>
            <strong>#{selected.ratingPosition}</strong>
          </div>
          <div className="metric-item">
            <span>Confidence</span>
            <strong>{selected.confidence}%</strong>
          </div>
          <div className="metric-item">
            <span>Tier</span>
            <strong className="tier-pill">{selected.tier}</strong>
          </div>
          <div className="metric-item">
            <span>Rating share</span>
            <strong>{selected.ratingShare}%</strong>
          </div>
        </div>
      </div>

      <section className="profile-card stats-card">
        <div className="card-row" style={{ justifyContent: 'space-between' }}>
          <div>
            <h3>All stats</h3>
            <p className="hero-copy">Race history metrics and performance details from the full dataset.</p>
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <span>Races</span>
            <strong>{selected.stats?.races ?? '—'}</strong>
          </div>
          <div className="stat-card">
            <span>Wins</span>
            <strong>{selected.stats?.wins ?? '—'}</strong>
          </div>
          <div className="stat-card">
            <span>Podiums</span>
            <strong>{selected.stats?.podiums ?? '—'}</strong>
          </div>
          <div className="stat-card">
            <span>Top 5</span>
            <strong>{selected.stats?.top5 ?? '—'}</strong>
          </div>
          <div className="stat-card">
            <span>Top 10</span>
            <strong>{selected.stats?.top10 ?? '—'}</strong>
          </div>
          <div className="stat-card">
            <span>Avg finish</span>
            <strong>{selected.stats?.avgFinish ? selected.stats.avgFinish.toFixed(2) : '—'}</strong>
          </div>
          <div className="stat-card">
            <span>Laps completed</span>
            <strong>{selected.stats?.lapsCompleted ?? '—'}</strong>
          </div>
          <div className="stat-card">
            <span>Avg lap</span>
            <strong>{selected.stats?.avgBestLapMs ? `${(selected.stats.avgBestLapMs / 1000).toFixed(2)}s` : '—'}</strong>
          </div>
          <div className="stat-card">
            <span>Collisions</span>
            <strong>{selected.stats?.collisions ?? '—'}</strong>
          </div>
          <div className="stat-card">
            <span>Heavy collisions</span>
            <strong>{selected.stats?.heavyCollisions ?? '—'}</strong>
          </div>
          <div className="stat-card">
            <span>Impact score</span>
            <strong>{selected.stats?.impactScore ? selected.stats.impactScore.toFixed(0) : '—'}</strong>
          </div>
        </div>
      </section>

      <div className="chart-grid">
        <div className="chart-panel">
          <h3>Player performance radar</h3>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={playerRadarData}>
              <PolarGrid stroke="rgba(255,255,255,0.12)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#cbd6f0', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
              <Radar name={selected.name} dataKey="value" stroke="#7b9cff" fill="#7b9cff" fillOpacity={0.35} />
              <Tooltip contentStyle={{ backgroundColor: '#0b1432', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 14 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-panel">
          <h3>Percentile view</h3>
          <div className="metric-grid">
            <div className="metric-item">
              <span>Rating percentile</span>
              <strong>{ratingPercentile}%</strong>
            </div>
            <div className="metric-item">
              <span>Safety percentile</span>
              <strong>{safetyPercentile}%</strong>
            </div>
            <div className="metric-item">
              <span>Confidence percentile</span>
              <strong>{confidencePercentile}%</strong>
            </div>
          </div>
          <div className="radial-summary">
            <div>
              <span>Leader percentiles measure how this driver ranks against the full data set.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-panel">
          <h3>Tier distribution</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={tierData}
                dataKey="value"
                nameKey="name"
                cx="40%"
                cy="48%"
                innerRadius={60}
                outerRadius={90}
                fill="#7b9cff"
                paddingAngle={4}
                labelLine={false}
                label={({ name, percent, value }) => `${name} ${value} (${(percent * 100).toFixed(1)}%)`}
              >
                {tierData.map((entry) => (
                  <Cell key={entry.name} fill={TIER_COLORS[entry.name] ?? '#7b9cff'} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0b1432', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 14 }} />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                iconType="circle"
                wrapperStyle={{ right: 0, top: 24, lineHeight: '22px' }}
                formatter={(value) => <span style={{ color: '#cbd6f0' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-panel">
          <h3>Nearby rivals</h3>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={relativeRating.slice(0, 10)} layout="vertical" margin={{ top: 14, right: 16, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="4 6" stroke="rgba(255,255,255,0.06)" />
              <XAxis type="number" tick={{ fill: '#cbd6f0', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={180} tick={{ fill: '#cbd6f0', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(name) => truncate(name, 22)} />
              <Tooltip contentStyle={{ backgroundColor: '#0b1432', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 14 }} />
              <Bar dataKey="rating" radius={[12, 12, 12, 12]}>
                {relativeRating.slice(0, 10).map((entry) => (
                  <Cell key={entry.name} fill={entry.focus ? '#7b9cff' : '#4a5f9c'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-panel">
          <h3>Top 30 rating trend</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={scoreSeries} margin={{ top: 24, right: 16, left: 0, bottom: 40 }}>
              <defs>
                <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7b9cff" stopOpacity={0.65} />
                  <stop offset="95%" stopColor="#7b9cff" stopOpacity={0.08} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 6" stroke="rgba(255,255,255,0.07)" />
              <XAxis dataKey="name" tick={{ fill: '#cbd6f0', fontSize: 11 }} interval={4} angle={-35} textAnchor="end" height={50} />
              <YAxis tick={{ fill: '#cbd6f0', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0b1432', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 14 }} />
              <Line type="monotone" dataKey="rating" stroke="#7b9cff" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: '#ffffff', stroke: '#7b9cff', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-panel">
          <h3>Selected vs average</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={metricComparisonData} margin={{ top: 24, right: 16, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="4 6" stroke="rgba(255,255,255,0.07)" />
              <XAxis dataKey="subject" tick={{ fill: '#cbd6f0', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#cbd6f0', fontSize: 12 }} unit="%" />
              <Tooltip contentStyle={{ backgroundColor: '#0b1432', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 14 }} />
              <Legend iconType="circle" formatter={(value) => <span style={{ color: '#cbd6f0' }}>{value}</span>} />
              <Bar dataKey="selected" name="Selected" fill="#7b9cff" radius={[12, 12, 0, 0]} />
              <Bar dataKey="average" name="Average" fill="#6fd3b1" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
