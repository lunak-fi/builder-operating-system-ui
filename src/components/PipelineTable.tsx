import { ExternalLink, MoreHorizontal } from 'lucide-react';

interface PipelineTableProps {
  onViewDeal: (dealId: string) => void;
  activeTab: string;
}

const mockPipelineDeals = [
  {
    id: '1',
    name: 'Riverside Commons',
    sponsor: 'Atlas Development',
    market: 'Charleston, SC',
    strategy: 'Value-Add',
    totalCost: '$45.2M',
    gpCommit: '$350K',
    irr: '19.2%',
    stage: 'Due Diligence',
    daysInStage: 8,
    lastUpdated: '2 hours ago',
  },
  {
    id: '2',
    name: 'Harbor Point Residential',
    sponsor: 'Coastal Partners',
    market: 'Portland, OR',
    strategy: 'Ground-Up',
    totalCost: '$68.5M',
    gpCommit: '$425K',
    irr: '22.4%',
    stage: 'Term Sheet',
    daysInStage: 12,
    lastUpdated: '5 hours ago',
  },
  {
    id: '3',
    name: 'Midtown Plaza',
    sponsor: 'Urban Capital',
    market: 'Austin, TX',
    strategy: 'Core-Plus',
    totalCost: '$32.8M',
    gpCommit: '$275K',
    irr: '15.8%',
    stage: 'Under Review',
    daysInStage: 5,
    lastUpdated: '1 day ago',
  },
  {
    id: '4',
    name: 'Parkside Development',
    sponsor: 'Summit Real Estate',
    market: 'Nashville, TN',
    strategy: 'Value-Add',
    totalCost: '$52.3M',
    gpCommit: '$400K',
    irr: '20.1%',
    stage: 'Committed',
    daysInStage: 45,
    lastUpdated: '2 days ago',
  },
  {
    id: '5',
    name: 'Gateway Center',
    sponsor: 'Meridian Group',
    market: 'Denver, CO',
    strategy: 'Opportunistic',
    totalCost: '$95.7M',
    gpCommit: '$500K',
    irr: '24.6%',
    stage: 'Received',
    daysInStage: 2,
    lastUpdated: '3 days ago',
  },
  {
    id: '6',
    name: 'Lakefront Towers',
    sponsor: 'Coastal Partners',
    market: 'Seattle, WA',
    strategy: 'Ground-Up',
    totalCost: '$112.4M',
    gpCommit: '$450K',
    irr: '21.3%',
    stage: 'Due Diligence',
    daysInStage: 15,
    lastUpdated: '4 days ago',
  },
  {
    id: '7',
    name: 'Downtown Heights',
    sponsor: 'Atlas Development',
    market: 'Charlotte, NC',
    strategy: 'Value-Add',
    totalCost: '$41.6M',
    gpCommit: '$325K',
    irr: '18.7%',
    stage: 'Under Review',
    daysInStage: 7,
    lastUpdated: '1 week ago',
  },
  {
    id: '8',
    name: 'Westside Village',
    sponsor: 'Urban Capital',
    market: 'Phoenix, AZ',
    strategy: 'Core-Plus',
    totalCost: '$38.9M',
    gpCommit: '$300K',
    irr: '16.4%',
    stage: 'Passed',
    daysInStage: 21,
    lastUpdated: '2 weeks ago',
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

export function PipelineTable({ onViewDeal, activeTab }: PipelineTableProps) {
  const filteredDeals = mockPipelineDeals.filter((deal) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return !['Committed', 'Passed'].includes(deal.stage);
    if (activeTab === 'committed') return deal.stage === 'Committed';
    if (activeTab === 'passed') return deal.stage === 'Passed';
    return true;
  });

  return (
    <div className="bg-white">
      {/* Table Header */}
      <div className="grid grid-cols-[40px_1.8fr_1.3fr_1.2fr_1fr_1fr_0.8fr_0.8fr_1fr_0.8fr_1fr_40px] gap-3 px-4 py-3 border-b border-gray-100 text-xs text-gray-500">
        <div>
          <input type="checkbox" className="rounded border-gray-300" />
        </div>
        <div>Deal Name</div>
        <div>Sponsor</div>
        <div>Market</div>
        <div>Strategy</div>
        <div>Total Cost</div>
        <div>GP Commit</div>
        <div>IRR</div>
        <div>Stage</div>
        <div>Days</div>
        <div>Last Updated</div>
        <div></div>
      </div>

      {/* Table Body */}
      <div>
        {filteredDeals.map((deal) => (
          <div
            key={deal.id}
            className="grid grid-cols-[40px_1.8fr_1.3fr_1.2fr_1fr_1fr_0.8fr_0.8fr_1fr_0.8fr_1fr_40px] gap-3 px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer group items-center"
            onClick={() => onViewDeal(deal.id)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <input type="checkbox" className="rounded border-gray-300" />
            </div>
            <div className="text-sm text-black flex items-center gap-2">
              {deal.name}
              <ExternalLink size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0" />
              <span className="text-sm text-gray-600 truncate">{deal.sponsor}</span>
            </div>
            <div className="text-sm text-gray-600">{deal.market}</div>
            <div className="text-sm text-gray-600">{deal.strategy}</div>
            <div className="text-sm text-black">{deal.totalCost}</div>
            <div className="text-sm text-black">{deal.gpCommit}</div>
            <div className="text-sm text-black">{deal.irr}</div>
            <div>
              <span className={`text-xs px-2.5 py-1 rounded-full ${stageColors[deal.stage]}`}>
                {deal.stage}
              </span>
            </div>
            <div className="text-sm text-gray-500">{deal.daysInStage}d</div>
            <div className="text-sm text-gray-500">{deal.lastUpdated}</div>
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
        <div className="text-sm text-gray-500">1-{filteredDeals.length} of 127 deals</div>
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
