import { Router, Request, Response } from "express";
import { IMoviesService } from "../../Domain/services/movies/IMoviesService";
import { MovieService } from "../../Services/movies/MovieService";
import { ITriviesService } from "../../Domain/services/trivies/ITriviesService";
import { TrivieService } from "../../Services/trivies/TrivieService";
import { authMiddleware } from "../middlewere/authMiddleware";
import { adminMiddleware } from "../middlewere/adminMiddleware";
import { validacijaPodatakaMovie } from "../validators/movies/MovieValidator";
import { Movie } from "../../Domain/models/Movie";

export class MovieController {
  private router: Router;
  private movieService: IMoviesService;
  private triviaService: ITriviesService;

  constructor(movieService: IMoviesService = new MovieService(), triviaService: ITriviesService = new TrivieService()) {
    this.router = Router();
    this.movieService = movieService;
    this.triviaService = triviaService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Public routes - accessible without auth
    this.router.get("/movies", this.getAllMovies.bind(this));
    this.router.get("/movies/:id", this.getMovieById.bind(this));
    this.router.post("/movies/public", this.createMoviePublic.bind(this)); // Public create route
    this.router.delete("/movies/public/:id", this.deleteMoviePublic.bind(this)); // Public delete route
    
    // Admin-only routes
    this.router.post("/movies", authMiddleware, adminMiddleware, this.createMovie.bind(this));
    this.router.put("/movies/:id", authMiddleware, adminMiddleware, this.updateMovie.bind(this));
    this.router.delete("/movies/:id", authMiddleware, adminMiddleware, this.deleteMovie.bind(this));
  }

  private transformMovieForResponse(movie: Movie): any {
    console.log('=== TRANSFORM MOVIE ===');
    console.log('Movie ID:', movie.id);
    console.log('Movie naziv:', movie.naziv);
    console.log('Movie opis:', movie.opis?.substring(0, 50) + '...');
    console.log('Movie zanr:', movie.zanr);
    console.log('Movie godinaIzdanja:', movie.godinaIzdanja);
    console.log('Movie coverImage length:', movie.coverImage?.length || 0);
    
    let coverUrl;
    if (movie.coverImage && movie.coverImage.trim()) {
      // Proverava da li Base64 string već ima data URL prefix
      if (movie.coverImage.startsWith('data:image/')) {
        coverUrl = movie.coverImage;
      } else {
        // Dodaje data URL prefix za Base64 string
        coverUrl = `data:image/jpeg;base64,${movie.coverImage}`;
      }
      console.log('Generated coverUrl for movie', movie.id, ':', coverUrl.substring(0, 100) + '...');
    }
    
    const result = {
      id: movie.id,
      naziv: movie.naziv,
      opis: movie.opis,
      trajanje: movie.trajanje,
      zanr: movie.zanr,
      godinaIzdanja: movie.godinaIzdanja,
      prosecnaOcena: movie.prosecnaOcena,
      coverUrl: coverUrl
    };
    
    console.log('=== FINAL RESULT ===');
    console.log('Result:', JSON.stringify(result, null, 2));
    console.log('====================');
    
    return result;
  }

  private async getAllMovies(req: Request, res: Response): Promise<void> {
    try {
      console.log("GET /movies - Pokušavam da učitam filmove...");
      const movies = await this.movieService.getAll();
      console.log(`Pronađeno filmova: ${movies.length}`);
      const moviesWithCoverUrl = movies.map(movie => this.transformMovieForResponse(movie));
      
      // Dodaj no-cache headers
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      res.json(moviesWithCoverUrl);
    } catch (error) {
      console.error("Greška pri učitavanju filmova:", error);
      res.status(500).json({ success: false, message: "Greška pri učitavanju filmova" });
    }
  }

  private async getMovieById(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const movie = await this.movieService.getById(id);
    const movieWithCoverUrl = this.transformMovieForResponse(movie);
    res.json(movieWithCoverUrl);
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

  private async createMoviePublic(req: Request, res: Response): Promise<void> {
    try {
      console.log('Received movie data:', req.body);
      const movieData = req.body;
      
      // Extract trivia data
      const { triviaPitanje, triviaOdgovor, ...movieOnlyData } = movieData;
      
      // Convert string numbers to actual numbers
      if (movieOnlyData.trajanje) movieOnlyData.trajanje = parseInt(movieOnlyData.trajanje);
      if (movieOnlyData.godinaIzdanja) movieOnlyData.godinaIzdanja = parseInt(movieOnlyData.godinaIzdanja);
      if (!movieOnlyData.prosecnaOcena) movieOnlyData.prosecnaOcena = 0;
      
      console.log('Processed movie data:', movieOnlyData);
      const rezultat = validacijaPodatakaMovie(movieOnlyData);
      console.log('Validation result:', rezultat);
      if (!rezultat.uspesno) {
        res.status(400).json({ success: false, message: rezultat.poruka });
        return;
      }

      // Validate trivia data
      if (!triviaPitanje || !triviaOdgovor) {
        res.status(400).json({ success: false, message: "Trivia pitanje i odgovor su obavezni" });
        return;
      }
      
      const movie = await this.movieService.create(movieOnlyData);
      if (movie && movie.id !== 0) {
        // Create trivia for the movie
        const triviaData = {
          id: 0,
          pitanje: triviaPitanje,
          odgovor: triviaOdgovor,
          sadrzajId: movie.id,
          tipSadrzaja: 'movie'
        };
        
        await this.triviaService.create(triviaData);
        
        res.status(201).json({ success: true, message: "Film i trivia uspešno dodati", data: movie });
      } else {
        res.status(400).json({ success: false, message: "Nije moguće dodati film" });
      }
    } catch (error) {
      console.error("Greška pri kreiranju filma:", error);
      res.status(500).json({ success: false, message: "Greška na serveru" });
    }
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

  /**
   * DELETE /api/v1/movies/public/:id
   * Public delete route - brisanje filma
   */
  private async deleteMoviePublic(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      console.log(`DELETE /movies/public/${id} - Pokušavam da obrišem film...`);
      
      const success = await this.movieService.delete(id);
      
      if (success) {
        console.log(`Film ${id} je uspešno obrisan`);
        res.status(200).json({ success: true, message: "Film je uspešno uklonjen." });
      } else {
        console.log(`Neuspešno brisanje filma ${id}`);
        res.status(404).json({ success: false, message: "Film nije pronađen." });
      }
    } catch (error) {
      console.error("Greška pri brisanju filma:", error);
      res.status(500).json({ success: false, message: "Greška pri uklanjanju filma." });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
