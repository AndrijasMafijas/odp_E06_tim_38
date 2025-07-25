import { IMoviesService } from "../../Domain/services/movies/IMoviesService";
import { Movie } from "../../Domain/models/Movie";
import { MoviesRepository } from "../../Database/repositories/movies/MoviesRepository";

export class MovieService implements IMoviesService {
  private moviesRepository: MoviesRepository;

  constructor() {
    this.moviesRepository = new MoviesRepository();
  }

  async create(movie: Movie): Promise<Movie> {
    return await this.moviesRepository.create(movie);
  }

  async getById(id: number): Promise<Movie> {
    return await this.moviesRepository.getById(id);
  }

  async getAll(): Promise<Movie[]> {
    return await this.moviesRepository.getAll();
  }

  async update(movie: Movie): Promise<Movie> {
    return await this.moviesRepository.update(movie);
  }

  async delete(id: number): Promise<boolean> {
    return await this.moviesRepository.delete(id);
  }
}
