import type { DealFlowData } from '@/lib/useDashboardData';

interface DealFlowChartProps {
  months: DealFlowData[];
  isLoading?: boolean;
}

export function DealFlowChart({ months, isLoading }: DealFlowChartProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-40 mb-6"></div>
        <div className="flex items-end justify-between h-48 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="flex-1 w-full flex items-end justify-center gap-1.5">
                <div className="w-full bg-gray-200 rounded-t" style={{ height: `${30 + Math.random() * 50}%` }} />
                <div className="w-full bg-gray-300 rounded-t" style={{ height: `${20 + Math.random() * 30}%` }} />
              </div>
              <div className="h-3 bg-gray-200 rounded w-8"></div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
          <div className="h-3 bg-gray-200 rounded w-20"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    );
  }

  if (months.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="mb-6">Deal Flow Timeline</h3>
        <div className="py-8 text-center">
          <p className="text-gray-500 text-sm">No deal flow data available.</p>
        </div>
      </div>
    );
  }

  // Use the actual data max so bars fill the available space proportionally
  const maxValue = Math.max(...months.map(m => Math.max(m.received, m.committed)), 1);
  const chartHeight = 160; // pixels

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="mb-6">Deal Flow Timeline</h3>
      <div className="flex items-end justify-around" style={{ height: `${chartHeight}px` }}>
        {months.map((data, index) => {
          const receivedHeight = (data.received / maxValue) * chartHeight;
          const committedHeight = (data.committed / maxValue) * chartHeight;
          return (
            <div key={index} className="flex flex-col items-center">
              <div className="flex items-end gap-1 mb-2">
                {/* Received bar */}
                <div
                  className="w-4 bg-gray-300 rounded-t transition-all"
                  style={{ height: `${receivedHeight}px` }}
                />
                {/* Committed bar */}
                <div
                  className="w-4 bg-black rounded-t transition-all"
                  style={{ height: `${committedHeight}px` }}
                />
              </div>
              <span className="text-xs text-gray-500">{data.month}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-300 rounded-sm" />
          <span className="text-xs text-gray-600">Received</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-black rounded-sm" />
          <span className="text-xs text-gray-600">Committed</span>
        </div>
      </div>
    </div>
  );
}
