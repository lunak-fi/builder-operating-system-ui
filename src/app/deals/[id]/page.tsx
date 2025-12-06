'use client';

import { useRouter, useParams } from 'next/navigation';
import { DealDetail } from '@/components/DealDetail';

export default function DealDetailPage() {
  const router = useRouter();
  const params = useParams();
  const dealId = params.id as string;

  const handleBack = () => {
    router.push('/pipeline');
  };

  return <DealDetail dealId={dealId} onBack={handleBack} />;
}
