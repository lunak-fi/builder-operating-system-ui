export function MarketChart() {
  const markets = [
    { name: 'Southeast', count: 12, percentage: 50 },
    { name: 'Texas', count: 8, percentage: 33 },
    { name: 'California', count: 6, percentage: 25 },
    { name: 'Mountain West', count: 4, percentage: 17 },
    { name: 'Northeast', count: 3, percentage: 13 },
  ];

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
