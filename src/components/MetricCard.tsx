interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  hasIndicator?: boolean;
}

export function MetricCard({ label, value, change, hasIndicator }: MetricCardProps) {
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