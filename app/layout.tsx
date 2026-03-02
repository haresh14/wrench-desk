import type {Metadata} from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'WrenchDesk | Field Service Management',
  description: 'Dispatch management and operational system for field service businesses like HVAC, plumbing, garage door repair, and electricians.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="font-sans antialiased bg-zinc-50 text-zinc-900 selection:bg-indigo-500/30">{children}</body>
    </html>
  );
}
