import React from 'react';
import type { Metadata } from 'next';
import { NetiBharathamPortal } from '@/components/neti-bharatham-portal';

export const metadata: Metadata = {
  title: 'Press Reporter QR Verification | NETI BHARATHAM – నేటి భారతం',
  description:
    'Verify official NETI BHARATHAM (నేటి భారతం) Press Reporter Identity Cards online. Displays only public approved credential status.',
};

export default async function VerifyReporterPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const resolved = await searchParams;
  const verifyId = resolved?.id || 'NB-TG-HYD-2026-0001';
  return <NetiBharathamPortal initialVerifyId={verifyId} />;
}
