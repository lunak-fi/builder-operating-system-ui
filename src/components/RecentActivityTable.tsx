import { ExternalLink } from 'lucide-react';
import type { RecentDeal } from '@/lib/useDashboardData';

interface RecentActivityTableProps {
  onViewDeal: (dealId: string) => void;
  deals: RecentDeal[];
  isLoading?: boolean;
}

const stageColors: Record<string, string> = {
  'Received': 'bg-gray-200 text-gray-700',
  'Under Review': 'bg-blue-100 text-blue-700',
  'Due Diligence': 'bg-yellow-100 text-yellow-700',
  'Term Sheet': 'bg-orange-100 text-orange-700',
  'Committed': 'bg-green-100 text-green-700',
  'Passed': 'bg-purple-100 text-purple-700',
};

export function RecentActivityTable({ onViewDeal, deals, isLoading }: RecentActivityTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white animate-pulse">
        {/* Table Header Skeleton */}
        <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_1fr] gap-4 px-4 py-3 border-b border-gray-100">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-3 bg-gray-200 rounded w-16"></div>
          ))}
        </div>
        {/* Table Rows Skeleton */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_1fr] gap-4 px-4 py-4 border-b border-gray-50">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-5 bg-gray-200 rounded-full w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="bg-white py-12 text-center">
        <p className="text-gray-500 text-sm">No deals in pipeline yet.</p>
        <p className="text-gray-400 text-xs mt-1">Upload a deal to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Table Header */}
      <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_1fr] gap-4 px-4 py-3 border-b border-gray-100">
        <div className="text-xs text-gray-500">Deal Name</div>
        <div className="text-xs text-gray-500">Sponsor</div>
        <div className="text-xs text-gray-500">Market</div>
        <div className="text-xs text-gray-500">Equity Required</div>
        <div className="text-xs text-gray-500">Stage</div>
        <div className="text-xs text-gray-500">Updated</div>
      </div>

      {/* Table Body */}
      <div>
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_1fr] gap-4 px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer group"
            onClick={() => onViewDeal(deal.id)}
          >
            <div className="text-sm text-black flex items-center gap-2">
              {deal.name}
              <ExternalLink size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-sm text-gray-600">{deal.sponsor}</div>
            <div className="text-sm text-gray-600">{deal.market}</div>
            <div className="text-sm text-black">{deal.gpCommit}</div>
            <div>
              <span className={`text-xs px-2.5 py-1 rounded-full ${stageColors[deal.stage] || stageColors['Received']}`}>
                {deal.stage}
              </span>
            </div>
            <div className="text-sm text-gray-500">{deal.updated}</div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      <div className="px-4 py-4 border-t border-gray-100">
        <button className="text-sm text-gray-600 hover:text-black transition-colors">
          View all pipeline →
        </button>
      </div>
    </div>
  );
}
