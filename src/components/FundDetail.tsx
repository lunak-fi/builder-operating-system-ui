'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, RefreshCw, Building2, MapPin, Target, TrendingUp } from 'lucide-react';
import { fundsAPI, operatorsAPI } from '@/lib/api';
import type { Fund, Operator, Deal } from '@/lib/types';

interface FundDetailProps {
  fundId: string;
  onBack: () => void;
  onDealClick?: (dealId: string) => void;
  onSponsorClick?: (sponsorId: string) => void;
}

function formatCurrency(value: number | string | null): string {
  if (value === null || value === undefined) return '-';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '-';
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(0)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
  return `$${num.toFixed(0)}`;
}

function formatPercent(value: number | string | null): string {
  if (value === null || value === undefined) return '-';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '-';
  // Values are stored as decimals (0.245 = 24.5%), multiply by 100 for display
  return `${(num * 100).toFixed(1)}%`;
}

function formatMultiple(value: number | string | null): string {
  if (value === null || value === undefined) return '-';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '-';
  return `${num.toFixed(2)}x`;
}

export function FundDetail({ fundId, onBack, onDealClick, onSponsorClick }: FundDetailProps) {
  const [fund, setFund] = useState<Fund | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fundData = await fundsAPI.get(fundId);
      setFund(fundData);

      const [operatorData, dealsData] = await Promise.all([
        operatorsAPI.get(fundData.operator_id).catch(() => null),
        fundsAPI.getDeals(fundId).catch(() => []),
      ]);

      setOperator(operatorData);
      setDeals(dealsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load fund');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fundId]);

  const statusColors: Record<string, string> = {
    'Active': 'bg-green-100 text-green-700',
    'Fundraising': 'bg-blue-100 text-blue-700',
    'Closed': 'bg-gray-200 text-gray-700',
  };

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
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="mb-8">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-4 w-48 bg-gray-100 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
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
            <span className="text-sm">Back to Funds</span>
          </button>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 font-medium mb-2">Error loading fund</h2>
            <p className="text-red-700 text-sm mb-4">{error}</p>
            <button
              onClick={fetchData}
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

  // No fund found
  if (!fund) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1200px] mx-auto px-8 py-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            <span className="text-sm">Back to Funds</span>
          </button>

          <div className="text-center py-12">
            <p className="text-gray-500">Fund not found</p>
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
          <span className="text-sm">Back to Funds</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-semibold text-black">{fund.name}</h1>
            <span className={`text-xs px-3 py-1.5 rounded-full ${statusColors[fund.status] || 'bg-gray-200 text-gray-700'}`}>
              {fund.status}
            </span>
          </div>
          {operator && (
            <p className="text-gray-600">
              Managed by{' '}
              <button
                onClick={() => onSponsorClick?.(operator.id)}
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                {operator.name}
                <ExternalLink size={12} />
              </button>
            </p>
          )}
        </div>

        {/* Key Metrics */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-500 mb-3">KEY METRICS</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <TrendingUp size={12} />
                Target IRR
              </div>
              <p className="text-2xl font-semibold text-black">{formatPercent(fund.target_irr)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <Target size={12} />
                Target Multiple
              </div>
              <p className="text-2xl font-semibold text-black">{formatMultiple(fund.target_equity_multiple)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-xs text-gray-500 mb-1">Fund Size</p>
              <p className="text-2xl font-semibold text-black">{formatCurrency(fund.fund_size)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-xs text-gray-500 mb-1">Preferred Return</p>
              <p className="text-2xl font-semibold text-black">{formatPercent(fund.preferred_return)}</p>
            </div>
          </div>
        </div>

        {/* Fund Structure */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-500 mb-3">FUND STRUCTURE</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">GP Commitment</p>
              <p className="text-lg font-medium text-black">{formatCurrency(fund.gp_commitment)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Management Fee</p>
              <p className="text-lg font-medium text-black">{formatPercent(fund.management_fee)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Carried Interest</p>
              <p className="text-lg font-medium text-black">{formatPercent(fund.carried_interest)}</p>
            </div>
          </div>
        </div>

        {/* Investment Focus */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-500 mb-3">INVESTMENT FOCUS</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <Building2 size={12} />
                Strategy
              </div>
              <p className="text-sm text-black font-medium">{fund.strategy || '-'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <MapPin size={12} />
                Target Geography
              </div>
              <p className="text-sm text-black font-medium">{fund.target_geography || '-'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Target Asset Types</p>
              <p className="text-sm text-black font-medium">{fund.target_asset_types || '-'}</p>
            </div>
          </div>
        </div>

        {/* Deals from this Fund */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-500 mb-3">DEALS FROM THIS FUND</h2>

          {deals.length === 0 ? (
            <div className="border border-gray-100 rounded-xl py-12 text-center">
              <p className="text-gray-500 text-sm">No deals from this fund yet.</p>
            </div>
          ) : (
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr] gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100">
                <div className="text-xs text-gray-500">Deal Name</div>
                <div className="text-xs text-gray-500">Location</div>
                <div className="text-xs text-gray-500">Asset Type</div>
                <div className="text-xs text-gray-500">Strategy</div>
                <div className="text-xs text-gray-500">Status</div>
              </div>

              {/* Table Body */}
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  onClick={() => onDealClick?.(deal.id)}
                  className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr] gap-4 px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-b-0"
                >
                  <div className="text-sm text-black truncate">{deal.deal_name}</div>
                  <div className="text-sm text-gray-600 truncate">
                    {[deal.msa, deal.state].filter(Boolean).join(', ') || '-'}
                  </div>
                  <div className="text-sm text-gray-600">{deal.asset_type || '-'}</div>
                  <div className="text-sm text-gray-600">{deal.strategy_type || '-'}</div>
                  <div>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${stageColors[deal.status || ''] || 'bg-gray-100 text-gray-700'}`}>
                      {deal.status || 'Unknown'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {deals.length > 0 && (
            <div className="mt-4 text-xs text-gray-400">
              Showing {deals.length} deal{deals.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
