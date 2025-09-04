import type { Series, SeriesFilterConfig, SeriesSortConfig } from '../types/Series';

export class SeriesFilter {
  static filterSeries(series: Series[], config: SeriesFilterConfig): Series[] {
    if (!config.searchTerm.trim()) {
      return series;
    }
    
    const searchLower = config.searchTerm.toLowerCase();
    return series.filter(s => 
      s.naziv.toLowerCase().includes(searchLower) ||
      s.opis.toLowerCase().includes(searchLower) ||
      s.zanr?.toLowerCase().includes(searchLower)
    );
  }
}

export class SeriesSorter {
  static sortSeries(series: Series[], config: SeriesSortConfig): Series[] {
    return [...series].sort((a, b) => {
      let comparison = 0;
      
      if (config.key === 'naziv') {
        comparison = a.naziv.localeCompare(b.naziv);
      } else if (config.key === 'prosecnaOcena') {
        comparison = (a.prosecnaOcena ?? 0) - (b.prosecnaOcena ?? 0);
      } else if (config.key === 'brojSezona') {
        comparison = (a.brojSezona ?? 0) - (b.brojSezona ?? 0);
      }
      
      return config.order === 'asc' ? comparison : -comparison;
    });
  }
}
