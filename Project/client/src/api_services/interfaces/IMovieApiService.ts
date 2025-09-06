import type { Movie, CreateMovieDto } from '../../types/Movie';

export interface IMovieApiService {
  getAllMovies(): Promise<Movie[]>;
  deleteMovie(movieId: number): Promise<{ success: boolean; message: string }>;
  createMovie(movieData: CreateMovieDto): Promise<{ success: boolean; message: string }>;
}
