import { ExternalLink, MoreHorizontal } from 'lucide-react';
import type { PipelineDeal } from '@/lib/usePipelineData';

interface PipelineTableProps {
  onViewDeal: (dealId: string) => void;
  deals: PipelineDeal[];
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

export function PipelineTable({ onViewDeal, deals, isLoading }: PipelineTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white animate-pulse">
        {/* Table Header Skeleton */}
        <div className="grid grid-cols-[40px_180px_150px_140px_100px_90px_80px_70px_100px_50px_90px_40px] gap-3 px-4 py-3 border-b border-gray-100">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-3 bg-gray-200 rounded w-16"></div>
          ))}
        </div>
        {/* Table Rows Skeleton */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="grid grid-cols-[40px_180px_150px_140px_100px_90px_80px_70px_100px_50px_90px_40px] gap-3 px-4 py-4 border-b border-gray-50">
            <div className="h-4 bg-gray-200 rounded w-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-14"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
            <div className="h-4 bg-gray-200 rounded w-10"></div>
            <div className="h-5 bg-gray-200 rounded-full w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-6"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="bg-white py-12 text-center">
        <p className="text-gray-500 text-sm">No deals found.</p>
        <p className="text-gray-400 text-xs mt-1">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Table Header */}
      <div className="grid grid-cols-[40px_180px_150px_140px_100px_90px_80px_70px_100px_50px_90px_40px] gap-3 px-4 py-3 border-b border-gray-100 text-xs text-gray-500">
        <div>
          <input type="checkbox" className="rounded border-gray-300" />
        </div>
        <div>Deal Name</div>
        <div>Sponsor</div>
        <div>Market</div>
        <div>Strategy</div>
        <div>Total Cost</div>
        <div>Equity Required</div>
        <div>IRR</div>
        <div>Stage</div>
        <div>Days</div>
        <div>Last Updated</div>
        <div></div>
      </div>

      {/* Table Body */}
      <div>
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="grid grid-cols-[40px_180px_150px_140px_100px_90px_80px_70px_100px_50px_90px_40px] gap-3 px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer group items-center"
            onClick={() => onViewDeal(deal.id)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <input type="checkbox" className="rounded border-gray-300" />
            </div>
            <div className="text-sm text-black flex items-center gap-2 truncate" title={deal.name}>
              <span className="truncate">{deal.name}</span>
              <ExternalLink size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0" />
              <span className="text-sm text-gray-600 truncate" title={deal.sponsor}>{deal.sponsor}</span>
            </div>
            <div className="text-sm text-gray-600 truncate" title={deal.market}>{deal.market}</div>
            <div className="text-sm text-gray-600 truncate" title={deal.strategy}>{deal.strategy}</div>
            <div className="text-sm text-black">{deal.totalCost}</div>
            <div className="text-sm text-black">{deal.equityRequired}</div>
            <div className="text-sm text-black">{deal.irr}</div>
            <div>
              <span className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap ${stageColors[deal.stage] || stageColors['Received']}`}>
                {deal.stage}
              </span>
            </div>
            <div className="text-sm text-gray-500">{deal.daysInStage}d</div>
            <div className="text-sm text-gray-500 whitespace-nowrap">{deal.lastUpdated}</div>
            <div onClick={(e) => e.stopPropagation()}>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <MoreHorizontal size={16} className="text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="px-4 py-4 border-t border-gray-100 flex items-center justify-between">
        <div className="text-sm text-gray-500">Showing {deals.length} deal{deals.length !== 1 ? 's' : ''}</div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors">
            Previous
          </button>
          <button className="px-3 py-1.5 text-sm text-black hover:bg-gray-50 rounded transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
