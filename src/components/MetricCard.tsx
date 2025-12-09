interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  hasIndicator?: boolean;
  isLoading?: boolean;
}

export function MetricCard({ label, value, change, hasIndicator, isLoading }: MetricCardProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-50 rounded-lg px-6 py-5 animate-pulse">
        <div className="h-3 bg-gray-200 rounded w-24 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg px-6 py-5">
      <div className="text-xs text-gray-500 mb-2">{label}</div>
      <div className="flex items-center gap-2 mb-1">
        <div className="text-3xl text-black">{value}</div>
        {hasIndicator && (
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        )}
      </div>
      {change && <div className="text-xs text-gray-400">{change}</div>}
    </div>
  );
}
