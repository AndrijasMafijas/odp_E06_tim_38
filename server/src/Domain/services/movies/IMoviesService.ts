import { Movie } from "../../models/Movie";

export interface IMoviesService {
  create(movie: Movie): Promise<Movie>;
  getById(id: number): Promise<Movie>;
  getAll(): Promise<Movie[]>;
  update(movie: Movie): Promise<Movie>;
  delete(id: number): Promise<boolean>;
}
