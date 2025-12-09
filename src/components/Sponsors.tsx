'use client';

import { useState, useMemo } from 'react';
import { Search, Plus, ExternalLink, RefreshCw } from 'lucide-react';
import { useSponsorsData } from '@/lib/useSponsorsData';

export function Sponsors() {
  const [searchQuery, setSearchQuery] = useState('');
  const { sponsors, isLoading, error, refetch } = useSponsorsData();

  const statusColors: Record<string, string> = {
    'Active': 'bg-green-100 text-green-700',
    'Watching': 'bg-blue-100 text-blue-700',
    'New': 'bg-gray-200 text-gray-700',
  };

  // Filter sponsors based on search query
  const filteredSponsors = useMemo(() => {
    if (!searchQuery.trim()) return sponsors;

    const query = searchQuery.toLowerCase();
    return sponsors.filter(sponsor =>
      sponsor.name.toLowerCase().includes(query) ||
      sponsor.geography.toLowerCase().includes(query)
    );
  }, [sponsors, searchQuery]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1>Sponsors</h1>
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="mb-6">
            <div className="h-10 w-80 bg-gray-100 rounded-full animate-pulse"></div>
          </div>
          <div className="bg-white animate-pulse">
            <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1.2fr_1.2fr_1fr] gap-4 px-4 py-3 border-b border-gray-100">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-3 bg-gray-200 rounded w-20"></div>
              ))}
            </div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1.2fr_1.2fr_1fr] gap-4 px-4 py-4 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-8"></div>
                <div className="h-4 bg-gray-200 rounded w-8"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-5 bg-gray-200 rounded-full w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={refetch}
                className="flex items-center gap-2 text-red-600 text-sm hover:text-red-800 transition-colors"
              >
                <RefreshCw size={14} />
                Retry
              </button>
            </div>
          </div>
        )}

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
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.2fr_1.2fr_1fr] gap-4 px-4 py-3 border-b border-gray-100">
            <div className="text-xs text-gray-500">Sponsor Name</div>
            <div className="text-xs text-gray-500">Submitted</div>
            <div className="text-xs text-gray-500">Committed</div>
            <div className="text-xs text-gray-500">Total GP Commit</div>
            <div className="text-xs text-gray-500">Geography</div>
            <div className="text-xs text-gray-500">Last Activity</div>
            <div className="text-xs text-gray-500">Status</div>
          </div>

          {/* Empty State */}
          {filteredSponsors.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500 text-sm">
                {searchQuery ? 'No sponsors found matching your search.' : 'No sponsors yet.'}
              </p>
            </div>
          )}

          {/* Table Body */}
          <div>
            {filteredSponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1.2fr_1.2fr_1fr] gap-4 px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium">
                    {sponsor.name.charAt(0)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-black">{sponsor.name}</span>
                    <ExternalLink size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="text-sm text-black">{sponsor.dealsSubmitted}</div>
                <div className="text-sm text-black">{sponsor.dealsCommitted}</div>
                <div className="text-sm text-black">{sponsor.totalGPCommit}</div>
                <div className="text-sm text-gray-600 truncate" title={sponsor.geography}>{sponsor.geography}</div>
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

        {/* Footer */}
        {filteredSponsors.length > 0 && (
          <div className="px-4 py-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              Showing {filteredSponsors.length} sponsor{filteredSponsors.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
