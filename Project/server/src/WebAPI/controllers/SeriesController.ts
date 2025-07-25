import { Router, Request, Response } from "express";
import { ISeriesService } from "../../Domain/services/series/ISeriesService";
import { SeriesService } from "../../Services/series/SeriesService";
import { authMiddleware } from "../middlewere/authMiddleware";
import { adminMiddleware } from "../middlewere/adminMiddleware";
import { validacijaPodatakaSeries } from "../validators/series/SeriesValidator";

export class SeriesController {
  private router: Router;
  private seriesService: ISeriesService;

  constructor(seriesService: ISeriesService = new SeriesService()) {
    this.router = Router();
    this.seriesService = seriesService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/series", authMiddleware, adminMiddleware, this.getAllSeries.bind(this));
    this.router.get("/series/:id", authMiddleware, adminMiddleware, this.getSeriesById.bind(this));
    this.router.post("/series", authMiddleware, adminMiddleware, this.createSeries.bind(this));
    this.router.put("/series/:id", authMiddleware, adminMiddleware, this.updateSeries.bind(this));
    this.router.delete("/series/:id", authMiddleware, adminMiddleware, this.deleteSeries.bind(this));
  }

  private async getAllSeries(req: Request, res: Response): Promise<void> {
    const series = await this.seriesService.getAll();
    res.json(series);
  }

  private async getSeriesById(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const series = await this.seriesService.getById(id);
    res.json(series);
  }

  private async createSeries(req: Request, res: Response): Promise<void> {
    const seriesData = req.body;
    const rezultat = validacijaPodatakaSeries(seriesData);
    if (!rezultat.uspesno) {
      res.status(400).json({ success: false, message: rezultat.poruka });
      return;
    }
    const series = await this.seriesService.create(seriesData);
    res.json(series);
  }

  private async updateSeries(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const seriesData = req.body;
    const rezultat = validacijaPodatakaSeries(seriesData);
    if (!rezultat.uspesno) {
      res.status(400).json({ success: false, message: rezultat.poruka });
      return;
    }
    const series = await this.seriesService.update({ ...seriesData, id });
    res.json(series);
  }

  private async deleteSeries(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const success = await this.seriesService.delete(id);
    res.json({ success });
  }

  public getRouter(): Router {
    return this.router;
  }
}
