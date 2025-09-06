import { Router, Request, Response } from "express";
import { IEpisodeService } from "../../Domain/services/episodes/IEpisodeService";
import { EpisodeService } from "../../Services/episodes/EpisodeService";
import { authMiddleware } from "../middlewere/authMiddleware";
import { adminMiddleware } from "../middlewere/adminMiddleware";
import { validacijaPodatakaEpisode } from "../validators/episodes/EpisodeValidator";

export class EpisodeController {
  private router: Router;
  private episodeService: IEpisodeService;

  constructor(episodeService: IEpisodeService = new EpisodeService()) {
    this.router = Router();
    this.episodeService = episodeService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/series/:seriesId/episodes", this.getEpisodesBySeriesId.bind(this));
    this.router.post("/episodes/public", this.createEpisodePublic.bind(this));
    
    // Admin-only routes
    this.router.get("/episodes", authMiddleware, adminMiddleware, this.getAllEpisodes.bind(this));
    this.router.get("/episodes/:id", authMiddleware, adminMiddleware, this.getEpisodeById.bind(this));
    this.router.post("/episodes", authMiddleware, adminMiddleware, this.createEpisode.bind(this));
    this.router.put("/episodes/:id", authMiddleware, adminMiddleware, this.updateEpisode.bind(this));
    this.router.delete("/episodes/:id", authMiddleware, adminMiddleware, this.deleteEpisode.bind(this));
  }

  private async getAllEpisodes(req: Request, res: Response): Promise<void> {
    const episodes = await this.episodeService.getAll();
    res.json(episodes);
  }

  private async getEpisodeById(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const episode = await this.episodeService.getById(id);
    res.json(episode);
  }

  private async getEpisodesBySeriesId(req: Request, res: Response): Promise<void> {
    const seriesId = Number(req.params.seriesId);
    const episodes = await this.episodeService.getBySeriesId(seriesId);
    const episodesWithCoverUrl = episodes.map(episode => this.transformEpisodeForResponse(episode));
    res.json(episodesWithCoverUrl);
  }

  private transformEpisodeForResponse(episode: any): any {
    console.log('Transform episode:', episode.id, 'cover_image length:', episode.cover_image?.length || 0);
    let coverUrl;
    if (episode.cover_image && episode.cover_image.trim()) {
      // Proverava da li Base64 string već ima data URL prefix
      if (episode.cover_image.startsWith('data:image/')) {
        coverUrl = episode.cover_image;
      } else {
        // Dodaje data URL prefix za Base64 string
        coverUrl = `data:image/jpeg;base64,${episode.cover_image}`;
      }
      console.log('Generated coverUrl for episode', episode.id, ':', coverUrl.substring(0, 100) + '...');
    }
    
    // Uklanjamo cover_image i dodajemo coverUrl
    const { cover_image, ...episodeWithoutCoverImage } = episode;
    
    return {
      ...episodeWithoutCoverImage,
      cover_image: coverUrl // Zadržavamo ime cover_image jer frontend očekuje to
    };
  }

  private async createEpisode(req: Request, res: Response): Promise<void> {
    const episodeData = req.body;
    const rezultat = validacijaPodatakaEpisode(episodeData);
    if (!rezultat.uspesno) {
      res.status(400).json({ success: false, message: rezultat.poruka });
      return;
    }
    const episode = await this.episodeService.create(episodeData);
    res.json(episode);
  }

  /**
   * POST /api/v1/episodes/public
   * Public create route - kreiranje epizode
   */
  private async createEpisodePublic(req: Request, res: Response): Promise<void> {
    try {
      console.log('Received episode data:', req.body);
      const episodeData = req.body;
      
      // Convert string numbers to actual numbers
      if (episodeData.trajanje) episodeData.trajanje = parseInt(episodeData.trajanje);
      if (episodeData.brojEpizode) episodeData.brojEpizode = parseInt(episodeData.brojEpizode);
      if (episodeData.serijaId) episodeData.serijaId = parseInt(episodeData.serijaId);
      if (!episodeData.prosecnaOcena) episodeData.prosecnaOcena = 0;
      
      console.log('Processed episode data:', episodeData);
      const rezultat = validacijaPodatakaEpisode(episodeData);
      console.log('Validation result:', rezultat);
      
      if (!rezultat.uspesno) {
        res.status(400).json({ success: false, message: rezultat.poruka });
        return;
      }
      
      const episode = await this.episodeService.create(episodeData);
      if (episode && episode.id !== 0) {
        const episodeWithCoverUrl = this.transformEpisodeForResponse(episode);
        res.status(201).json({ success: true, message: "Epizoda uspešno dodana", data: episodeWithCoverUrl });
      } else {
        res.status(400).json({ success: false, message: "Nije moguće dodati epizodu" });
      }
    } catch (error) {
      console.error("Greška pri kreiranju epizode:", error);
      res.status(500).json({ success: false, message: "Greška na serveru" });
    }
  }

  private async updateEpisode(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const episodeData = req.body;
    const rezultat = validacijaPodatakaEpisode(episodeData);
    if (!rezultat.uspesno) {
      res.status(400).json({ success: false, message: rezultat.poruka });
      return;
    }
    const episode = await this.episodeService.update({ ...episodeData, id });
    res.json(episode);
  }

  private async deleteEpisode(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const success = await this.episodeService.delete(id);
    res.json({ success });
  }

  public getRouter(): Router {
    return this.router;
  }
}
