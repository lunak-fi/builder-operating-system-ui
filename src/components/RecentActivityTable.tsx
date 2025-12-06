import { ExternalLink } from 'lucide-react';

interface RecentActivityTableProps {
  onViewDeal: (dealId: string) => void;
}

const mockRecentDeals = [
  {
    id: '1',
    name: 'Riverside Commons',
    sponsor: 'Atlas Development',
    market: 'Charleston, SC',
    gpCommit: '$350K',
    stage: 'Due Diligence',
    updated: '2 hours ago',
  },
  {
    id: '2',
    name: 'Harbor Point Residential',
    sponsor: 'Coastal Partners',
    market: 'Portland, OR',
    gpCommit: '$425K',
    stage: 'Term Sheet',
    updated: '5 hours ago',
  },
  {
    id: '3',
    name: 'Midtown Plaza',
    sponsor: 'Urban Capital',
    market: 'Austin, TX',
    gpCommit: '$275K',
    stage: 'Under Review',
    updated: '1 day ago',
  },
  {
    id: '4',
    name: 'Parkside Development',
    sponsor: 'Summit Real Estate',
    market: 'Nashville, TN',
    gpCommit: '$400K',
    stage: 'Committed',
    updated: '2 days ago',
  },
  {
    id: '5',
    name: 'Gateway Center',
    sponsor: 'Meridian Group',
    market: 'Denver, CO',
    gpCommit: '$500K',
    stage: 'Received',
    updated: '3 days ago',
  },
];

const stageColors: Record<string, string> = {
  'Received': 'bg-gray-200 text-gray-700',
  'Under Review': 'bg-blue-100 text-blue-700',
  'Due Diligence': 'bg-yellow-100 text-yellow-700',
  'Term Sheet': 'bg-orange-100 text-orange-700',
  'Committed': 'bg-green-100 text-green-700',
  'Passed': 'bg-purple-100 text-purple-700',
};

export function RecentActivityTable({ onViewDeal }: RecentActivityTableProps) {
  return (
    <div className="bg-white">
      {/* Table Header */}
      <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_1fr] gap-4 px-4 py-3 border-b border-gray-100">
        <div className="text-xs text-gray-500">Deal Name</div>
        <div className="text-xs text-gray-500">Sponsor</div>
        <div className="text-xs text-gray-500">Market</div>
        <div className="text-xs text-gray-500">GP Commit</div>
        <div className="text-xs text-gray-500">Stage</div>
        <div className="text-xs text-gray-500">Updated</div>
      </div>

      {/* Table Body */}
      <div>
        {mockRecentDeals.map((deal) => (
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
              <span className={`text-xs px-2.5 py-1 rounded-full ${stageColors[deal.stage]}`}>
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
