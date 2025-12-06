'use client';

import { useRouter } from 'next/navigation';
import { Dashboard } from '@/components/Dashboard';

export default function HomePage() {
  const router = useRouter();

  const handleViewDeal = (dealId: string) => {
    router.push(`/deals/${dealId}`);
  };

  const handleNavigate = (page: 'upload') => {
    router.push(`/${page}`);
  };

  return <Dashboard onViewDeal={handleViewDeal} onNavigate={handleNavigate} />;
}
