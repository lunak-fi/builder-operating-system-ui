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

  const handleFundClick = (fundId: string) => {
    router.push(`/funds/${fundId}`);
  };

  return (
    <SponsorDetail
      sponsorId={sponsorId}
      onBack={handleBack}
      onDealClick={handleDealClick}
      onFundClick={handleFundClick}
    />
  );
}
