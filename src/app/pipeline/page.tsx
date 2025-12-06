'use client';

import { useRouter } from 'next/navigation';
import { Pipeline } from '@/components/Pipeline';

export default function PipelinePage() {
  const router = useRouter();

  const handleViewDeal = (dealId: string) => {
    router.push(`/deals/${dealId}`);
  };

  return <Pipeline onViewDeal={handleViewDeal} />;
}
