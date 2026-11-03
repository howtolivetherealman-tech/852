import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PortalProvider } from '@/lib/portal-context';

export const viewport: Viewport = {
  themeColor: '#0A1931',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || 'https://netibhaaratham.com'),
  title: {
    default: 'NETI BHARATHAM – నేటి భారతం | Telugu Digital News Portal',
    template: '%s | NETI BHARATHAM – నేటి భారతం',
  },
  description:
    'NETI BHARATHAM (నేటి భారతం) is a comprehensive Telugu and English digital news portal delivering breaking news, national, state, district, and mandal-level coverage across India with verified press reporter IDs.',
  applicationName: 'NETI BHARATHAM',
  keywords: [
    'Neti Bharatham',
    'నేటి భారతం',
    'Telugu News Portal',
    'Telangana News',
    'Andhra Pradesh News',
    'Mandal News',
    'District News',
    'Press Reporter ID Verification',
  ],
  authors: [{ name: 'NETI BHARATHAM Editorial Desk', url: 'https://netibhaaratham.com' }],
  alternates: {
    canonical: '/',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NetiBharat',
  },
  icons: {
    icon: '/assets/aistudio/___________Tricolour_News_Logo__1__1507f5db.png',
    apple: '/assets/aistudio/___________Tricolour_News_Logo__1__1507f5db.png',
  },
  openGraph: {
    title: 'NETI BHARATHAM – నేటి భారతం | Telugu Digital News Portal',
    description:
      'NETI BHARATHAM (నేటి భారతం) — Comprehensive Telugu & English digital news portal covering National, State, District & Mandal news across all 36 Indian States and Union Territories.',
    url: 'https://netibhaaratham.com',
    siteName: 'NETI BHARATHAM (నేటి భారతం)',
    locale: 'te_IN',
    type: 'website',
    images: [
      {
        url: '/assets/aistudio/___________Tricolour_News_Logo__1__1507f5db.png',
        width: 512,
        height: 512,
        alt: 'NETI BHARATHAM – నేటి భారతం Official Emblem',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NETI BHARATHAM – నేటి భారతం | Telugu Digital News Portal',
    description:
      'Breaking Telugu & English News from National, State, District & Mandal Desks across India.',
    images: ['/assets/aistudio/___________Tricolour_News_Logo__1__1507f5db.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'NETI BHARATHAM (నేటి భారతం)',
    alternateName: 'నేటి భారతం',
    url: 'https://netibhaaratham.com',
    logo: 'https://netibhaaratham.com/assets/aistudio/___________Tricolour_News_Logo__1__1507f5db.png',
    email: 'netibhaarathamtelugu@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://youtube.com/@netibhaaratham',
      'https://facebook.com/netibhaaratham',
      'https://x.com/netibhaaratham',
      'https://instagram.com/netibhaaratham',
    ],
  };

  return (
    <html lang="te">
      <body suppressHydrationWarning className="min-h-screen bg-[#F8FAFC] text-[#090D16] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PortalProvider>{children}</PortalProvider>
      </body>
    </html>
  );
}
