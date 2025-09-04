import type { Movie, MovieFilterConfig, MovieSortConfig } from '../types/Movie';

export class MovieFilter {
  static filterMovies(movies: Movie[], config: MovieFilterConfig): Movie[] {
    if (!config.searchTerm.trim()) {
      return movies;
    }
    
    const searchLower = config.searchTerm.toLowerCase();
    return movies.filter(movie => 
      movie.naziv.toLowerCase().includes(searchLower) ||
      movie.opis.toLowerCase().includes(searchLower) ||
      movie.zanr?.toLowerCase().includes(searchLower)
    );
  }
}

export class MovieSorter {
  static sortMovies(movies: Movie[], config: MovieSortConfig): Movie[] {
    return [...movies].sort((a, b) => {
      let comparison = 0;
      
      if (config.key === 'naziv') {
        comparison = a.naziv.localeCompare(b.naziv);
      } else if (config.key === 'prosecnaOcena') {
        comparison = (a.prosecnaOcena ?? 0) - (b.prosecnaOcena ?? 0);
      }
      
      return config.order === 'asc' ? comparison : -comparison;
    });
  }
}
