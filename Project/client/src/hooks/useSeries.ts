import { useState, useEffect, useCallback } from 'react';
import type { Series, SeriesSortConfig, SeriesFilterConfig } from '../types/Series';
import type { ISeriesService } from '../api_services/interfaces/ISeriesService';
import { SeriesFilter, SeriesSorter } from '../utils/SeriesUtils';

export interface UseSeriesResult {
  series: Series[];
  sortedAndFilteredSeries: Series[];
  loading: boolean;
  error: string;
  sortConfig: SeriesSortConfig;
  filterConfig: SeriesFilterConfig;
  setSortConfig: (config: SeriesSortConfig) => void;
  setFilterConfig: (config: SeriesFilterConfig) => void;
  refreshSeries: () => Promise<void>;
  deleteSeries: (seriesId: number) => Promise<{ success: boolean; message: string }>;
}

export function useSeries(seriesService: ISeriesService): UseSeriesResult {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState<SeriesSortConfig>({
    key: 'naziv',
    order: 'asc'
  });
  const [filterConfig, setFilterConfig] = useState<SeriesFilterConfig>({
    searchTerm: ''
  });

  const refreshSeries = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const fetchedSeries = await seriesService.getAllSeries();
      setSeries(fetchedSeries);
    } catch (err) {
      console.error('Greška pri učitavanju serija:', err);
      setError('Грешка при учитавању серија');
    } finally {
      setLoading(false);
    }
  }, [seriesService]);

  const deleteSeries = useCallback(async (seriesId: number) => {
    const result = await seriesService.deleteSeries(seriesId);
    if (result.success) {
      setSeries(prev => prev.filter(s => s.id !== seriesId));
    }
    return result;
  }, [seriesService]);

  useEffect(() => {
    refreshSeries();
  }, [refreshSeries]);

  // Compute sorted and filtered series
  const sortedAndFilteredSeries = SeriesSorter.sortSeries(
    SeriesFilter.filterSeries(series, filterConfig),
    sortConfig
  );

  return {
    series,
    sortedAndFilteredSeries,
    loading,
    error,
    sortConfig,
    filterConfig,
    setSortConfig,
    setFilterConfig,
    refreshSeries,
    deleteSeries
  };
}
