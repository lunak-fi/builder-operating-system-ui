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

interface MultiSelectFilterProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  count?: number;
}

export function MultiSelectFilter({
  label,
  options,
  selectedValues,
  onChange,
  count,
}: MultiSelectFilterProps) {
  const hasSelections = selectedValues.length > 0;

  const handleToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const handleSelectAll = () => {
    onChange(options);
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
          {label}
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

        {/* Options */}
        {options.length === 0 ? (
          <div className="px-2 py-6 text-center text-sm text-gray-500">
            No options available
          </div>
        ) : (
          options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option}
              checked={selectedValues.includes(option)}
              onCheckedChange={() => handleToggle(option)}
            >
              {option}
            </DropdownMenuCheckboxItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
