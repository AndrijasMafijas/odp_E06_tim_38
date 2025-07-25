import { Router, Request, Response } from "express";
import { IGradeService } from "../../Domain/services/grades/IGradeService";
import { GradeService } from "../../Services/grades/GradeService";
import { authMiddleware } from "../middlewere/authMiddleware";
import { adminMiddleware } from "../middlewere/adminMiddleware";
import { validacijaPodatakaGrade } from "../validators/grades/GradeValidator";

export class GradeController {
  private router: Router;
  private gradeService: IGradeService;

  constructor(gradeService: IGradeService = new GradeService()) {
    this.router = Router();
    this.gradeService = gradeService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/grades", authMiddleware, adminMiddleware, this.getAllGrades.bind(this));
    this.router.get("/grades/:id", authMiddleware, adminMiddleware, this.getGradeById.bind(this));
    this.router.post("/grades", authMiddleware, adminMiddleware, this.createGrade.bind(this));
    this.router.put("/grades/:id", authMiddleware, adminMiddleware, this.updateGrade.bind(this));
    this.router.delete("/grades/:id", authMiddleware, adminMiddleware, this.deleteGrade.bind(this));
  }

  private async getAllGrades(req: Request, res: Response): Promise<void> {
    const grades = await this.gradeService.getAll();
    res.json(grades);
  }

  private async getGradeById(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const grade = await this.gradeService.getById(id);
    res.json(grade);
  }

  private async createGrade(req: Request, res: Response): Promise<void> {
    const gradeData = req.body;
    const rezultat = validacijaPodatakaGrade(gradeData);
    if (!rezultat.uspesno) {
      res.status(400).json({ success: false, message: rezultat.poruka });
      return;
    }
    const grade = await this.gradeService.create(gradeData);
    res.json(grade);
  }

  private async updateGrade(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const gradeData = req.body;
    const rezultat = validacijaPodatakaGrade(gradeData);
    if (!rezultat.uspesno) {
      res.status(400).json({ success: false, message: rezultat.poruka });
      return;
    }
    const grade = await this.gradeService.update({ ...gradeData, id });
    res.json(grade);
  }

  private async deleteGrade(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const success = await this.gradeService.delete(id);
    res.json({ success });
  }

  public getRouter(): Router {
    return this.router;
  }
}
