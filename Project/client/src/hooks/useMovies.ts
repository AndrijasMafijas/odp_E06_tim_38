import { useState, useEffect, useCallback } from 'react';
import type { Movie, MovieSortConfig, MovieFilterConfig } from '../types/Movie';
import type { IMovieApiService } from '../api_services/interfaces/IMovieApiService';
import { MovieFilter, MovieSorter } from '../utils/MovieUtils';

export interface UseMoviesResult {
  movies: Movie[];
  sortedAndFilteredMovies: Movie[];
  loading: boolean;
  error: string;
  sortConfig: MovieSortConfig;
  filterConfig: MovieFilterConfig;
  setSortConfig: (config: MovieSortConfig) => void;
  setFilterConfig: (config: MovieFilterConfig) => void;
  refreshMovies: () => Promise<void>;
  deleteMovie: (movieId: number) => Promise<{ success: boolean; message: string }>;
}

export function useMovies(movieService: IMovieApiService): UseMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState<MovieSortConfig>({
    key: 'naziv',
    order: 'asc'
  });
  const [filterConfig, setFilterConfig] = useState<MovieFilterConfig>({
    searchTerm: ''
  });

  const refreshMovies = useCallback(async () => {
    try {
      console.log('Osvežavam filmove nakon ažuriranja ocene...');
      setLoading(true);
      setError('');
      const fetchedMovies = await movieService.getAllMovies();
      console.log('Filmovi osveženi, ukupno:', fetchedMovies.length);
      setMovies(fetchedMovies);
    } catch (err) {
      console.error('Greška pri učitavanju filmova:', err);
      setError('Greška pri učitavanju filmova');
    } finally {
      setLoading(false);
    }
  }, [movieService]);

  const deleteMovie = useCallback(async (movieId: number) => {
    const result = await movieService.deleteMovie(movieId);
    if (result.success) {
      setMovies(prev => prev.filter(movie => movie.id !== movieId));
    }
    return result;
  }, [movieService]);

  useEffect(() => {
    refreshMovies();
  }, [refreshMovies]);

  // Compute sorted and filtered movies
  const sortedAndFilteredMovies = MovieSorter.sortMovies(
    MovieFilter.filterMovies(movies, filterConfig),
    sortConfig
  );

  return {
    movies,
    sortedAndFilteredMovies,
    loading,
    error,
    sortConfig,
    filterConfig,
    setSortConfig,
    setFilterConfig,
    refreshMovies,
    deleteMovie
  };
}
