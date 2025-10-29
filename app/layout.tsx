import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from './providers/session-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Carsor AI - Vehicle Service Platform',
  description: 'AI-powered vehicle service platform - Next-generation automotive intelligence',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="origin-trial" content="A3nbADgL+c51FfmlFnUqM4cEcCpZj6Bq9vgheEPzxcH7K82y90/aDT2zNVOxeRdamLUD3Zf3aO+a/N/Ln6KSBAQAAACKeyJvcmlnaW4iOiJodHRwczovL2NhcnNvci1haS11cGRhdGVkLnZlcmNlbC5hcHA6NDQzIiwiZmVhdHVyZSI6IkFJUmV3cml0ZXJBUEkiLCJleHBpcnkiOjE3Njk0NzIwMDAsImlzU3ViZG9tYWluIjp0cnVlLCJpc1RoaXJkUGFydHkiOnRydWV9" />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
