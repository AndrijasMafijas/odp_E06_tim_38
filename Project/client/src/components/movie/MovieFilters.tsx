import React from 'react';
import type { SortKey, SortOrder, MovieSortConfig, MovieFilterConfig } from '../../types/Movie';

interface MovieFiltersProps {
  sortConfig: MovieSortConfig;
  filterConfig: MovieFilterConfig;
  onSortChange: (config: MovieSortConfig) => void;
  onFilterChange: (config: MovieFilterConfig) => void;
}

export const MovieFilters: React.FC<MovieFiltersProps> = ({
  sortConfig,
  filterConfig,
  onSortChange,
  onFilterChange
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ searchTerm: e.target.value });
  };

  const handleSortKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange({ ...sortConfig, key: e.target.value as SortKey });
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange({ ...sortConfig, order: e.target.value as SortOrder });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4 items-end">
      <input
        type="text"
        placeholder="Pretraga po nazivu..."
        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={filterConfig.searchTerm}
        onChange={handleSearchChange}
      />
      <label className="text-gray-700 dark:text-gray-200">Sortiraj po:</label>
      <select 
        value={sortConfig.key} 
        onChange={handleSortKeyChange} 
        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="naziv">Nazivu</option>
        <option value="prosecnaOcena">Prosečnoj oceni</option>
      </select>
      <select 
        value={sortConfig.order} 
        onChange={handleSortOrderChange} 
        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="asc">Rastuće</option>
        <option value="desc">Opadajuće</option>
      </select>
    </div>
  );
};
