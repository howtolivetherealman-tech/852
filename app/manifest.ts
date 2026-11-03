import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'NETI BHARATHAM – నేటి భారతం',
    short_name: 'NetiBharat',
    description:
      'Official Telugu Digital News Portal (netibhaaratham.com) covering National, State, District, and Mandal news across India.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0A192F',
    theme_color: '#DC2626',
    icons: [
      {
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
