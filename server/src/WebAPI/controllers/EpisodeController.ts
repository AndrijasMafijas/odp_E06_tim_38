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
