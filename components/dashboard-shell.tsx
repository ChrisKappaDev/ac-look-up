'use client';
import type { DriverData } from '../lib/driver-utils';
import DriverLookup from './driver-lookup';
import DriverProfile from './driver-profile';

type DashboardShellProps = {
  data: DriverData;
};

export default function DashboardShell({ data }: DashboardShellProps) {
  return (
    <div className="content-grid">
      <div className="panel cold-glow">
        <DriverLookup data={data} />
      </div>
    </div>
  );
}
