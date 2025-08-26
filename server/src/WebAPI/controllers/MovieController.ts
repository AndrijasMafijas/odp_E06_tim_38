import { Router, Request, Response } from "express";
import { IMoviesService } from "../../Domain/services/movies/IMoviesService";
import { MovieService } from "../../Services/movies/MovieService";
import { authMiddleware } from "../middlewere/authMiddleware";
import { adminMiddleware } from "../middlewere/adminMiddleware";
import { validacijaPodatakaMovie } from "../validators/movies/MovieValidator";

export class MovieController {
  private router: Router;
  private movieService: IMoviesService;

  constructor(movieService: IMoviesService = new MovieService()) {
    this.router = Router();
    this.movieService = movieService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/movies", authMiddleware, adminMiddleware, this.getAllMovies.bind(this));
    this.router.get("/movies/:id", authMiddleware, adminMiddleware, this.getMovieById.bind(this));
    this.router.post("/movies", authMiddleware, adminMiddleware, this.createMovie.bind(this));
    this.router.put("/movies/:id", authMiddleware, adminMiddleware, this.updateMovie.bind(this));
    this.router.delete("/movies/:id", authMiddleware, adminMiddleware, this.deleteMovie.bind(this));
  }

  private async getAllMovies(req: Request, res: Response): Promise<void> {
    const movies = await this.movieService.getAll();
    res.json(movies);
  }

  private async getMovieById(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const movie = await this.movieService.getById(id);
    res.json(movie);
  }

  private async createMovie(req: Request, res: Response): Promise<void> {
    const movieData = req.body;
    const rezultat = validacijaPodatakaMovie(movieData);
    if (!rezultat.uspesno) {
      res.status(400).json({ success: false, message: rezultat.poruka });
      return;
    }
    const movie = await this.movieService.create(movieData);
    res.json(movie);
  }

  private async updateMovie(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const movieData = req.body;
    const rezultat = validacijaPodatakaMovie(movieData);
    if (!rezultat.uspesno) {
      res.status(400).json({ success: false, message: rezultat.poruka });
      return;
    }
    const movie = await this.movieService.update({ ...movieData, id });
    res.json(movie);
  }

  private async deleteMovie(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const success = await this.movieService.delete(id);
    res.json({ success });
  }

  public getRouter(): Router {
    return this.router;
  }
}
