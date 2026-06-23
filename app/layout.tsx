import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Full Force Sim Look Up | Sim Racing Ratings',
  description: 'Fast lookup for sim racing rating profiles with modern charts and analytics.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-frame">
          <header className="site-header">
            <div className="brand-row">
              <Link href="/" className="brand-link">
                <span className="brand-mark">FFS</span>
                <span>Full Force Sim Look Up</span>
              </Link>
              <nav className="site-nav">
                <Link href="/" className="nav-link">
                  Home
                </Link>
                <Link href="/about" className="nav-link">
                  About
                </Link>
              </nav>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
