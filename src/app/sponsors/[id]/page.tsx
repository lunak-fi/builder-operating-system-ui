'use client';

import { useRouter, useParams } from 'next/navigation';
import { SponsorDetail } from '@/components/SponsorDetail';

export default function SponsorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const sponsorId = params.id as string;

  const handleBack = () => {
    router.push('/sponsors');
  };

  const handleDealClick = (dealId: string) => {
    router.push(`/deals/${dealId}`);
  };

  return <SponsorDetail sponsorId={sponsorId} onBack={handleBack} onDealClick={handleDealClick} />;
}
