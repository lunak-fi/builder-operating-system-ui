'use client';

import { useRouter, useParams } from 'next/navigation';
import { FundDetail } from '@/components/FundDetail';

export default function FundDetailPage() {
  const router = useRouter();
  const params = useParams();
  const fundId = params.id as string;

  const handleBack = () => {
    router.push('/funds');
  };

  const handleDealClick = (dealId: string) => {
    router.push(`/deals/${dealId}`);
  };

  const handleSponsorClick = (sponsorId: string) => {
    router.push(`/sponsors/${sponsorId}`);
  };

  return (
    <FundDetail
      fundId={fundId}
      onBack={handleBack}
      onDealClick={handleDealClick}
      onSponsorClick={handleSponsorClick}
    />
  );
}
