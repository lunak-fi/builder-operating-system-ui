import { useState } from 'react';
import { Search, Plus, ExternalLink } from 'lucide-react';

export function Sponsors() {
  const [searchQuery, setSearchQuery] = useState('');

  const mockSponsors = [
    {
      id: '1',
      name: 'Atlas Development',
      primaryContact: 'Michael Chen',
      dealsSubmitted: 8,
      dealsCommitted: 3,
      totalGPCommit: '$1.2M',
      geography: 'Southeast',
      lastActivity: '2 days ago',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Coastal Partners',
      primaryContact: 'Sarah Williams',
      dealsSubmitted: 6,
      dealsCommitted: 2,
      totalGPCommit: '$875K',
      geography: 'Pacific NW',
      lastActivity: '5 days ago',
      status: 'Active',
    },
    {
      id: '3',
      name: 'Urban Capital',
      primaryContact: 'James Rodriguez',
      dealsSubmitted: 4,
      dealsCommitted: 1,
      totalGPCommit: '$275K',
      geography: 'Texas',
      lastActivity: '1 week ago',
      status: 'Watching',
    },
    {
      id: '4',
      name: 'Meridian Group',
      primaryContact: 'Emily Chen',
      dealsSubmitted: 3,
      dealsCommitted: 1,
      totalGPCommit: '$500K',
      geography: 'Mountain West',
      lastActivity: '2 weeks ago',
      status: 'Active',
    },
    {
      id: '5',
      name: 'Summit Real Estate',
      primaryContact: 'David Park',
      dealsSubmitted: 5,
      dealsCommitted: 2,
      totalGPCommit: '$725K',
      geography: 'Southeast',
      lastActivity: '3 days ago',
      status: 'Active',
    },
    {
      id: '6',
      name: 'Vertex Properties',
      primaryContact: 'Lisa Martinez',
      dealsSubmitted: 2,
      dealsCommitted: 0,
      totalGPCommit: '$0',
      geography: 'California',
      lastActivity: '1 month ago',
      status: 'New',
    },
  ];

  const statusColors: Record<string, string> = {
    'Active': 'bg-green-100 text-green-700',
    'Watching': 'bg-blue-100 text-blue-700',
    'New': 'bg-gray-200 text-gray-700',
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1>Sponsors</h1>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#D4FF00] text-black text-sm rounded-lg hover:bg-[#C4EF00] transition-colors">
            <Plus size={16} />
            Add Sponsor
          </button>
        </div>

        {/* Search & Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search sponsors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-gray-50 border-0 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200"
              />
            </div>
            <button className="px-4 py-2.5 rounded-full bg-gray-50 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              All Statuses
            </button>
          </div>
        </div>

        {/* Sponsors Table */}
        <div className="bg-white">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1.2fr_1.2fr_1fr] gap-4 px-4 py-3 border-b border-gray-100">
            <div className="text-xs text-gray-500">Sponsor Name</div>
            <div className="text-xs text-gray-500">Primary Contact</div>
            <div className="text-xs text-gray-500">Submitted</div>
            <div className="text-xs text-gray-500">Committed</div>
            <div className="text-xs text-gray-500">Total GP Commit</div>
            <div className="text-xs text-gray-500">Geography</div>
            <div className="text-xs text-gray-500">Last Activity</div>
            <div className="text-xs text-gray-500">Status</div>
          </div>

          {/* Table Body */}
          <div>
            {mockSponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1.2fr_1.2fr_1fr] gap-4 px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-black">{sponsor.name}</span>
                    <ExternalLink size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="text-sm text-gray-600">{sponsor.primaryContact}</div>
                <div className="text-sm text-black">{sponsor.dealsSubmitted}</div>
                <div className="text-sm text-black">{sponsor.dealsCommitted}</div>
                <div className="text-sm text-black">{sponsor.totalGPCommit}</div>
                <div className="text-sm text-gray-600">{sponsor.geography}</div>
                <div className="text-sm text-gray-500">{sponsor.lastActivity}</div>
                <div>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${statusColors[sponsor.status]}`}>
                    {sponsor.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
