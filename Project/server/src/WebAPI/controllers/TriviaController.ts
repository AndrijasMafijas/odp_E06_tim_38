import { Router, Request, Response } from "express";
import { ITriviesService } from "../../Domain/services/trivies/ITriviesService";
import { TrivieService } from "../../Services/trivies/TrivieService";
import { authMiddleware } from "../middlewere/authMiddleware";
import { adminMiddleware } from "../middlewere/adminMiddleware";
import { validacijaPodatakaTrivia } from "../validators/trivias/TriviaValidator";

export class TriviaController {
  private router: Router;
  private triviaService: ITriviesService;

  constructor(triviaService: ITriviesService = new TrivieService()) {
    this.router = Router();
    this.triviaService = triviaService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/trivias", authMiddleware, adminMiddleware, this.getAllTrivias.bind(this));
    this.router.get("/trivias/:id", authMiddleware, adminMiddleware, this.getTriviaById.bind(this));
    this.router.post("/trivias", authMiddleware, adminMiddleware, this.createTrivia.bind(this));
    this.router.put("/trivias/:id", authMiddleware, adminMiddleware, this.updateTrivia.bind(this));
    this.router.delete("/trivias/:id", authMiddleware, adminMiddleware, this.deleteTrivia.bind(this));
    // Univerzalna ruta za trivije po tipu i sadrzaju
    this.router.get("/trivias/content/:tipSadrzaja/:sadrzajId", this.getTriviasByContent.bind(this));
  }
  // GET /trivias/content/:tipSadrzaja/:sadrzajId
  private async getTriviasByContent(req: Request, res: Response): Promise<void> {
    const tipSadrzaja = req.params.tipSadrzaja;
    const sadrzajId = Number(req.params.sadrzajId);
    if (!tipSadrzaja || isNaN(sadrzajId)) {
      res.status(400).json({ success: false, message: "Neispravan tipSadrzaja ili sadrzajId" });
      return;
    }
    const trivias = await this.triviaService.getByContent(sadrzajId, tipSadrzaja);
    res.json(trivias);
  }

  private async getAllTrivias(req: Request, res: Response): Promise<void> {
    const trivias = await this.triviaService.getAll();
    res.json(trivias);
  }

  private async getTriviaById(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const trivia = await this.triviaService.getById(id);
    res.json(trivia);
  }

  private async createTrivia(req: Request, res: Response): Promise<void> {
    const triviaData = req.body;
    const rezultat = validacijaPodatakaTrivia(triviaData);
    if (!rezultat.uspesno) {
      res.status(400).json({ success: false, message: rezultat.poruka });
      return;
    }
    const trivia = await this.triviaService.create(triviaData);
    res.json(trivia);
  }

  private async updateTrivia(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const triviaData = req.body;
    const rezultat = validacijaPodatakaTrivia(triviaData);
    if (!rezultat.uspesno) {
      res.status(400).json({ success: false, message: rezultat.poruka });
      return;
    }
    const trivia = await this.triviaService.update({ ...triviaData, id });
    res.json(trivia);
  }

  private async deleteTrivia(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const success = await this.triviaService.delete(id);
    res.json({ success });
  }

  public getRouter(): Router {
    return this.router;
  }
}
