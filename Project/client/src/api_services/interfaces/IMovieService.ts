import type { Movie, CreateMovieDto } from '../../types/Movie';

export interface IMovieService {
  getAllMovies(): Promise<Movie[]>;
  deleteMovie(movieId: number): Promise<{ success: boolean; message: string }>;
  createMovie(movieData: CreateMovieDto): Promise<{ success: boolean; message: string }>;
}

export interface IMovieRepository {
  fetchAll(): Promise<Movie[]>;
  delete(id: number): Promise<{ success: boolean; message: string }>;
  create(data: CreateMovieDto): Promise<{ success: boolean; message: string }>;
}
