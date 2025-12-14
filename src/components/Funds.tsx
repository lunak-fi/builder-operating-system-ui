'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ExternalLink, RefreshCw } from 'lucide-react';
import { fundsAPI, operatorsAPI } from '@/lib/api';
import type { Fund, Operator } from '@/lib/types';

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

export function Funds() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [funds, setFunds] = useState<Fund[]>([]);
  const [operators, setOperators] = useState<Record<string, Operator>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fundsData, operatorsData] = await Promise.all([
        fundsAPI.getAll(),
        operatorsAPI.getAll(),
      ]);
      setFunds(fundsData);
      const operatorsMap: Record<string, Operator> = {};
      operatorsData.forEach(op => {
        operatorsMap[op.id] = op;
      });
      setOperators(operatorsMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load funds');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statusColors: Record<string, string> = {
    'Active': 'bg-green-100 text-green-700',
    'Fundraising': 'bg-blue-100 text-blue-700',
    'Closed': 'bg-gray-200 text-gray-700',
  };

  const filteredFunds = useMemo(() => {
    if (!searchQuery.trim()) return funds;

    const query = searchQuery.toLowerCase();
    return funds.filter(fund =>
      fund.name.toLowerCase().includes(query) ||
      (fund.strategy?.toLowerCase().includes(query)) ||
      (operators[fund.operator_id]?.name.toLowerCase().includes(query))
    );
  }, [funds, searchQuery, operators]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1>Funds</h1>
          </div>
          <div className="mb-6">
            <div className="h-10 w-80 bg-gray-100 rounded-full animate-pulse"></div>
          </div>
          <div className="bg-white animate-pulse">
            <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-3 border-b border-gray-100">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-3 bg-gray-200 rounded w-20"></div>
              ))}
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-4 border-b border-gray-50">
                <div className="h-4 bg-gray-200 rounded w-40"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
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
          <h1>Funds</h1>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={fetchData}
                className="flex items-center gap-2 text-red-600 text-sm hover:text-red-800 transition-colors"
              >
                <RefreshCw size={14} />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search funds..."
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

        {/* Funds Table */}
        <div className="bg-white">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-3 border-b border-gray-100">
            <div className="text-xs text-gray-500">Fund Name</div>
            <div className="text-xs text-gray-500">Sponsor</div>
            <div className="text-xs text-gray-500">Strategy</div>
            <div className="text-xs text-gray-500">Target IRR</div>
            <div className="text-xs text-gray-500">Fund Size</div>
            <div className="text-xs text-gray-500">Status</div>
          </div>

          {/* Empty State */}
          {filteredFunds.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500 text-sm">
                {searchQuery ? 'No funds found matching your search.' : 'No funds yet.'}
              </p>
            </div>
          )}

          {/* Table Body */}
          <div>
            {filteredFunds.map((fund) => (
              <div
                key={fund.id}
                onClick={() => router.push(`/funds/${fund.id}`)}
                className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-black">{fund.name}</span>
                  <ExternalLink size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-sm text-gray-600">
                  {operators[fund.operator_id]?.name || '-'}
                </div>
                <div className="text-sm text-gray-600">{fund.strategy || '-'}</div>
                <div className="text-sm text-black">{formatPercent(fund.target_irr)}</div>
                <div className="text-sm text-black">{formatCurrency(fund.fund_size)}</div>
                <div>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${statusColors[fund.status] || 'bg-gray-200 text-gray-700'}`}>
                    {fund.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        {filteredFunds.length > 0 && (
          <div className="px-4 py-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              Showing {filteredFunds.length} fund{filteredFunds.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
