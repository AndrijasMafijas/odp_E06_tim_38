import React from 'react';

type SortKey = "naziv" | "prosecnaOcena";
type SortOrder = "asc" | "desc";

interface SeriesFiltersProps {
  searchTerm: string;
  sortKey: SortKey;
  sortOrder: SortOrder;
  onSearchChange: (searchTerm: string) => void;
  onSortKeyChange: (sortKey: SortKey) => void;
  onSortOrderChange: (sortOrder: SortOrder) => void;
}

export const SeriesFilters: React.FC<SeriesFiltersProps> = ({
  searchTerm,
  sortKey,
  sortOrder,
  onSearchChange,
  onSortKeyChange,
  onSortOrderChange
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleSortKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortKeyChange(e.target.value as SortKey);
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortOrderChange(e.target.value as SortOrder);
  };

  return (
    <div className="flex justify-center mb-6">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          {/* Search Input */}
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🔍 Pretraga
            </label>
            <input
              type="text"
              placeholder="Unesite naziv serije..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {/* Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📊 Sortiraj po
              </label>
              <select 
                value={sortKey} 
                onChange={handleSortKeyChange} 
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-w-[140px]"
              >
                <option value="naziv">Nazivu</option>
                <option value="prosecnaOcena">Prosečnoj oceni</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🔄 Redosled
              </label>
              <select 
                value={sortOrder} 
                onChange={handleSortOrderChange} 
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-w-[120px]"
              >
                <option value="asc">Rastuće ↑</option>
                <option value="desc">Opadajuće ↓</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
