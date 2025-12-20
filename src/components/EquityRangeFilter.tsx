'use client';

import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from './dropdown-menu';

interface EquityRange {
  label: string;
  min: number;
  max: number;
}

const EQUITY_RANGES: EquityRange[] = [
  { label: '$0-1M', min: 0, max: 1000000 },
  { label: '$1M-5M', min: 1000000, max: 5000000 },
  { label: '$5M-10M', min: 5000000, max: 10000000 },
  { label: '$10M+', min: 10000000, max: Infinity },
];

interface EquityRangeFilterProps {
  selectedRanges: string[];
  onChange: (ranges: string[]) => void;
  count?: number;
}

export function EquityRangeFilter({
  selectedRanges,
  onChange,
  count,
}: EquityRangeFilterProps) {
  const hasSelections = selectedRanges.length > 0;

  const handleToggle = (rangeLabel: string) => {
    if (selectedRanges.includes(rangeLabel)) {
      onChange(selectedRanges.filter((r) => r !== rangeLabel));
    } else {
      onChange([...selectedRanges, rangeLabel]);
    }
  };

  const handleSelectAll = () => {
    onChange(EQUITY_RANGES.map((r) => r.label));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm transition-colors ${
            hasSelections
              ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          Equity Required Range
          {count !== undefined && count > 0 && (
            <span className={hasSelections ? 'text-blue-600' : 'text-gray-500'}>
              ({count})
            </span>
          )}
          <ChevronDown size={14} className={hasSelections ? 'text-blue-600' : 'text-gray-500'} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {/* Select All / Clear All */}
        <div className="flex gap-1 p-1">
          <DropdownMenuItem onClick={handleSelectAll} className="flex-1 justify-center">
            Select All
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleClearAll} className="flex-1 justify-center">
            Clear All
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator />

        {/* Range Options */}
        {EQUITY_RANGES.map((range) => (
          <DropdownMenuCheckboxItem
            key={range.label}
            checked={selectedRanges.includes(range.label)}
            onCheckedChange={() => handleToggle(range.label)}
          >
            {range.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Export the ranges for use in filtering logic
export { EQUITY_RANGES };
