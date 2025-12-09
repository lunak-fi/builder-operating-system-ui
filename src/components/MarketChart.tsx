import type { MarketData } from '@/lib/useDashboardData';

interface MarketChartProps {
  markets: MarketData[];
  isLoading?: boolean;
}

export function MarketChart({ markets, isLoading }: MarketChartProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-40 mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-2">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-6"></div>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="mb-6">Deal Count by Market</h3>
        <div className="py-8 text-center">
          <p className="text-gray-500 text-sm">No market data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="mb-6">Deal Count by Market</h3>
      <div className="space-y-4">
        {markets.map((market) => (
          <div key={market.name}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">{market.name}</span>
              <span className="text-sm text-black">{market.count}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-400 rounded-full transition-all"
                style={{ width: `${market.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
