import type { Movie, CreateMovieDto } from '../../types/Movie';
import type { IMovieService, IMovieRepository } from '../interfaces/IMovieService';

export class MovieService implements IMovieService {
  private readonly movieRepository: IMovieRepository;

  constructor(movieRepository: IMovieRepository) {
    this.movieRepository = movieRepository;
  }

  async getAllMovies(): Promise<Movie[]> {
    return await this.movieRepository.fetchAll();
  }

  async deleteMovie(movieId: number): Promise<{ success: boolean; message: string }> {
    if (movieId <= 0) {
      return { success: false, message: 'Nevalidan ID filma' };
    }
    return await this.movieRepository.delete(movieId);
  }

  async createMovie(movieData: CreateMovieDto): Promise<{ success: boolean; message: string }> {
    // Validacija podataka
    if (!movieData.naziv?.trim()) {
      return { success: false, message: 'Naziv filma je obavezan' };
    }
    if (!movieData.opis?.trim()) {
      return { success: false, message: 'Opis filma je obavezan' };
    }
    
    return await this.movieRepository.create(movieData);
  }
}
