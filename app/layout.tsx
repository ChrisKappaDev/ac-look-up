import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AC Lookup | Sim Racing Ratings',
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
                <span className="brand-mark">AC</span>
                <span>AC Lookup</span>
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
