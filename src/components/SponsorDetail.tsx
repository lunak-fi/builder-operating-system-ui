'use client';

import { ArrowLeft, ExternalLink, RefreshCw, Building2, MapPin, Globe, Briefcase } from 'lucide-react';
import { useSponsorDetail, SponsorDeal } from '@/lib/useSponsorDetail';

interface SponsorDetailProps {
  sponsorId: string;
  onBack: () => void;
  onDealClick?: (dealId: string) => void;
}

export function SponsorDetail({ sponsorId, onBack, onDealClick }: SponsorDetailProps) {
  const { sponsor, isLoading, error, refetch } = useSponsorDetail(sponsorId);

  const stageColors: Record<string, string> = {
    'Received': 'bg-gray-100 text-gray-700',
    'Under Review': 'bg-blue-100 text-blue-700',
    'Due Diligence': 'bg-purple-100 text-purple-700',
    'Term Sheet': 'bg-orange-100 text-orange-700',
    'Committed': 'bg-green-100 text-green-700',
    'Passed': 'bg-red-100 text-red-700',
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1200px] mx-auto px-8 py-8">
          {/* Back button skeleton */}
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>

          {/* Header skeleton */}
          <div className="mb-8">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-4 w-96 bg-gray-100 rounded animate-pulse"></div>
          </div>

          {/* Info cards skeleton */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Metrics skeleton */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6">
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Deals table skeleton */}
          <div className="bg-white">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="border border-gray-100 rounded-xl">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="grid grid-cols-6 gap-4 px-4 py-4 border-b border-gray-50">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1200px] mx-auto px-8 py-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            <span className="text-sm">Back to Sponsors</span>
          </button>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 font-medium mb-2">Error loading sponsor</h2>
            <p className="text-red-700 text-sm mb-4">{error}</p>
            <button
              onClick={refetch}
              className="flex items-center gap-2 text-red-600 text-sm hover:text-red-800 transition-colors"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No sponsor found
  if (!sponsor) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1200px] mx-auto px-8 py-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            <span className="text-sm">Back to Sponsors</span>
          </button>

          <div className="text-center py-12">
            <p className="text-gray-500">Sponsor not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-8 py-8">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Back to Sponsors</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg text-gray-600 font-medium">
              {sponsor.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-black">{sponsor.name}</h1>
              {sponsor.legalName && sponsor.legalName !== sponsor.name && (
                <p className="text-sm text-gray-500">{sponsor.legalName}</p>
              )}
            </div>
          </div>
          <p className="text-gray-600 mt-4 max-w-2xl">{sponsor.description}</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <MapPin size={12} />
              Headquarters
            </div>
            <p className="text-sm text-black font-medium">{sponsor.hqLocation}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <Globe size={12} />
              Primary Geography
            </div>
            <p className="text-sm text-black font-medium">{sponsor.primaryGeography || 'N/A'}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <Building2 size={12} />
              Asset Focus
            </div>
            <p className="text-sm text-black font-medium">{sponsor.primaryAssetType || 'N/A'}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <Briefcase size={12} />
              Website
            </div>
            {sponsor.website ? (
              <a
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1"
              >
                Visit
                <ExternalLink size={12} />
              </a>
            ) : (
              <p className="text-sm text-gray-400">N/A</p>
            )}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-xs text-gray-500 mb-1">Deals Submitted</p>
            <p className="text-2xl font-semibold text-black">{sponsor.dealsSubmitted}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-xs text-gray-500 mb-1">Deals Committed</p>
            <p className="text-2xl font-semibold text-green-600">{sponsor.dealsCommitted}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-xs text-gray-500 mb-1">Deals Passed</p>
            <p className="text-2xl font-semibold text-red-600">{sponsor.dealsPassed}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-xs text-gray-500 mb-1">Total GP Commit</p>
            <p className="text-2xl font-semibold text-black">{sponsor.totalGPCommit}</p>
          </div>
        </div>

        {/* Deals Table */}
        <div>
          <h2 className="text-lg font-medium text-black mb-4">Deals</h2>

          {sponsor.deals.length === 0 ? (
            <div className="border border-gray-100 rounded-xl py-12 text-center">
              <p className="text-gray-500 text-sm">No deals from this sponsor yet.</p>
            </div>
          ) : (
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100">
                <div className="text-xs text-gray-500">Deal Name</div>
                <div className="text-xs text-gray-500">Market</div>
                <div className="text-xs text-gray-500">Strategy</div>
                <div className="text-xs text-gray-500">Total Cost</div>
                <div className="text-xs text-gray-500">GP Commit</div>
                <div className="text-xs text-gray-500">Stage</div>
              </div>

              {/* Table Body */}
              {sponsor.deals.map((deal: SponsorDeal) => (
                <div
                  key={deal.id}
                  onClick={() => onDealClick?.(deal.id)}
                  className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-b-0"
                >
                  <div className="text-sm text-black truncate" title={deal.name}>{deal.name}</div>
                  <div className="text-sm text-gray-600 truncate" title={deal.market}>{deal.market}</div>
                  <div className="text-sm text-gray-600">{deal.strategy}</div>
                  <div className="text-sm text-black">{deal.totalCost}</div>
                  <div className="text-sm text-black">{deal.gpCommit}</div>
                  <div>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${stageColors[deal.stage] || 'bg-gray-100 text-gray-700'}`}>
                      {deal.stage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with last updated info */}
        {sponsor.deals.length > 0 && (
          <div className="mt-4 text-xs text-gray-400">
            Showing {sponsor.deals.length} deal{sponsor.deals.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
