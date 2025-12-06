'use client';

import { useRouter } from 'next/navigation';
import { Portfolio } from '@/components/Portfolio';

export default function PortfolioPage() {
  const router = useRouter();

  const handleViewDeal = (dealId: string) => {
    router.push(`/deals/${dealId}`);
  };

  return <Portfolio onViewDeal={handleViewDeal} />;
}
