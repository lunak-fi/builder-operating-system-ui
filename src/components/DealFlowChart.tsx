export function DealFlowChart() {
  const months = [
    { month: 'Jul', received: 6, committed: 2 },
    { month: 'Aug', received: 8, committed: 3 },
    { month: 'Sep', received: 5, committed: 2 },
    { month: 'Oct', received: 9, committed: 4 },
    { month: 'Nov', received: 7, committed: 2 },
    { month: 'Dec', received: 10, committed: 5 },
  ];

  const maxValue = Math.max(...months.map(m => Math.max(m.received, m.committed)));

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="mb-6">Deal Flow Timeline</h3>
      <div className="flex items-end justify-between h-48 gap-6">
        {months.map((data, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="flex-1 w-full flex items-end justify-center gap-1.5">
              {/* Received bar */}
              <div
                className="w-full bg-gray-300 rounded-t transition-all"
                style={{ height: `${(data.received / maxValue) * 100}%` }}
              />
              {/* Committed bar */}
              <div
                className="w-full bg-black rounded-t transition-all"
                style={{ height: `${(data.committed / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{data.month}</span>
          </div>
        ))}
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
