import { Router, Request, Response } from "express";
import { ISeriesService } from "../../Domain/services/series/ISeriesService";
import { SeriesService } from "../../Services/series/SeriesService";
import { ITriviesService } from "../../Domain/services/trivies/ITriviesService";
import { TrivieService } from "../../Services/trivies/TrivieService";
import { authMiddleware } from "../middlewere/authMiddleware";
import { adminMiddleware } from "../middlewere/adminMiddleware";
import { validacijaPodatakaSeries } from "../validators/series/SeriesValidator";

export class SeriesController {
  private router: Router;
  private seriesService: ISeriesService;
  private triviaService: ITriviesService;

  constructor(seriesService: ISeriesService = new SeriesService(), triviaService: ITriviesService = new TrivieService()) {
    this.router = Router();
    this.seriesService = seriesService;
    this.triviaService = triviaService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Public routes - accessible without auth
    this.router.get("/series", this.getAllSeries.bind(this));
    this.router.get("/series/:id", this.getSeriesById.bind(this));
    this.router.post("/series/public", this.createSeriesPublic.bind(this)); // Public create route
    this.router.delete("/series/public/:id", this.deleteSeriesPublic.bind(this)); // Public delete route
    
    // Admin-only routes
    this.router.post("/series", authMiddleware, adminMiddleware, this.createSeries.bind(this));
    this.router.put("/series/:id", authMiddleware, adminMiddleware, this.updateSeries.bind(this));
    this.router.delete("/series/:id", authMiddleware, adminMiddleware, this.deleteSeries.bind(this));
  }

  private async getAllSeries(req: Request, res: Response): Promise<void> {
    try {
      console.log("GET /series - Pokušavam da učitam serije...");
      const series = await this.seriesService.getAll();
      console.log(`Pronađeno serija: ${series.length}`);
      res.json(series);
    } catch (error) {
      console.error("Greška pri učitavanju serija:", error);
      res.status(500).json({ success: false, message: "Greška pri učitavanju serija" });
    }
  }

  private async getSeriesById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      console.log(`GET /series/${id} - Pokušavam da učitam seriju...`);
      const series = await this.seriesService.getById(id);
      if (!series || !series.id) {
        res.status(404).json({ success: false, message: "Serija nije pronađena" });
        return;
      }
      res.json(series);
    } catch (error) {
      console.error("Greška pri učitavanju serije:", error);
      res.status(500).json({ success: false, message: "Greška pri učitavanju serije" });
    }
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

  private async createSeriesPublic(req: Request, res: Response): Promise<void> {
    try {
      console.log('Received series data:', req.body);
      const seriesData = req.body;
      
      // Extract trivia data
      const { triviaPitanje, triviaOdgovor, ...seriesOnlyData } = seriesData;
      
      // Convert string numbers to actual numbers
      if (seriesOnlyData.brojEpizoda) seriesOnlyData.brojEpizoda = parseInt(seriesOnlyData.brojEpizoda);
      if (seriesOnlyData.godinaIzdanja) seriesOnlyData.godinaIzdanja = parseInt(seriesOnlyData.godinaIzdanja);
      if (!seriesOnlyData.prosecnaOcena) seriesOnlyData.prosecnaOcena = 0;
      
      console.log('Processed series data:', seriesOnlyData);
      const rezultat = validacijaPodatakaSeries(seriesOnlyData);
      console.log('Validation result:', rezultat);
      if (!rezultat.uspesno) {
        res.status(400).json({ success: false, message: rezultat.poruka });
        return;
      }

      // Validate trivia data
      if (!triviaPitanje || !triviaOdgovor) {
        res.status(400).json({ success: false, message: "Триvia питање и одговор су обавезни" });
        return;
      }
      
      const series = await this.seriesService.create(seriesOnlyData);
      if (series && series.id !== 0) {
        // Create trivia for the series
        const triviaData = {
          id: 0,
          pitanje: triviaPitanje,
          odgovor: triviaOdgovor,
          sadrzajId: series.id,
          tipSadrzaja: 'series'
        };
        
        await this.triviaService.create(triviaData);
        
        res.status(201).json({ success: true, message: "Серија и триvia успешно додати", data: series });
      } else {
        res.status(400).json({ success: false, message: "Није могуће додати серију" });
      }
    } catch (error) {
      console.error("Greška pri kreiranju serije:", error);
      res.status(500).json({ success: false, message: "Грешка на серверу" });
    }
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

  /**
   * DELETE /api/v1/series/public/:id
   * Public delete route - brisanje serije
   */
  private async deleteSeriesPublic(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      console.log(`DELETE /series/public/${id} - Pokušavam da obrišem seriju...`);
      
      const success = await this.seriesService.delete(id);
      
      if (success) {
        console.log(`Serija ${id} je uspešno obrisana`);
        res.status(200).json({ success: true, message: "Серија је успешно уклоњена." });
      } else {
        console.log(`Neuspešno brisanje serije ${id}`);
        res.status(404).json({ success: false, message: "Серија није пронађена." });
      }
    } catch (error) {
      console.error("Greška pri brisanju serije:", error);
      res.status(500).json({ success: false, message: "Грешка при уклањању серије." });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
