import { Router, Request, Response } from "express";
import { IGradeService } from "../../Domain/services/grades/IGradeService";
import { GradeService } from "../../Services/grades/GradeService";
import { Grade } from "../../Domain/models/Grade";
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
    this.router.get("/grades/user/:userId/:contentId/:contentType", this.getUserGradeForContent.bind(this)); // Nova ruta
    this.router.post("/grades", this.submitGrade.bind(this)); // Javna ruta za slanje ocena
    this.router.put("/grades/:id/public", this.updateGradePublic.bind(this)); // Javna ruta za ažuriranje ocena
    this.router.post("/grades/admin", authMiddleware, adminMiddleware, this.createGrade.bind(this)); // Admin ruta
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
  private async getUserGradeForContent(req: Request, res: Response): Promise<void> {
    try {
      const userId = Number(req.params.userId);
      const contentId = Number(req.params.contentId);
      const contentType = req.params.contentType as 'movie' | 'series';
      if (userId <= 0 || contentId <= 0) {
        res.status(400).json({ message: 'Nevalidni parametri' });
        return;
      }
      if (!['movie', 'series'].includes(contentType)) {
        res.status(400).json({ message: 'Nevalidan tip sadržaja' });
        return;
      }
      // Koristimo postojeću metodu iz servisa
      const grades = await this.gradeService.getAll();
      const userGrade = grades.find(grade => 
        grade.korisnikId === userId && 
        grade.sadrzajId === contentId && 
        grade.tipSadrzaja === contentType
      );
      res.json(userGrade || null);
    } catch (error) {
      res.status(500).json({ message: 'Greška na serveru' });
    }
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
  private async submitGrade(req: Request, res: Response): Promise<void> {
    try {
      const gradeData = req.body;
      const rezultat = validacijaPodatakaGrade(gradeData);
      if (!rezultat.uspesno) {
        res.status(400).json({ success: false, message: rezultat.poruka });
        return;
      }
      // Kreiraj Grade objekat iz client podataka
      const grade = new Grade(
        0, // id
        gradeData.userId || gradeData.korisnikId,
        gradeData.contentId || gradeData.sadrzajId, 
        gradeData.contentType || gradeData.tipSadrzaja || 'movie',
        gradeData.value || gradeData.ocena,
        gradeData.komentar || ''
      );
      const createdGrade = await this.gradeService.create(grade);
      // Proveriti da li je server vratio prazan objekat (korisnik već ima ocenu)
      if (!createdGrade || Object.keys(createdGrade).length === 0 || createdGrade.id === 0) {
        res.status(409).json({ success: false, message: "Već ste ocenili ovaj sadržaj!" });
        return;
      }
      res.status(201).json({ success: true, message: "Ocena uspešno sačuvana", data: createdGrade });
    } catch (error: any) {
      // Rukovanje MySQL duplicate entry greškom
      if (error.code === 'ER_DUP_ENTRY' || error.message?.includes('Duplicate entry')) {
        res.status(409).json({ success: false, message: "Već ste ocenili ovaj sadržaj!" });
        return;
      }
      res.status(500).json({ success: false, message: "Greška na serveru" });
    }
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
  private async updateGradePublic(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const gradeData = req.body;
      const rezultat = validacijaPodatakaGrade(gradeData);
      if (!rezultat.uspesno) {
        res.status(400).json({ success: false, message: rezultat.poruka });
        return;
      }
      // Kreiraj Grade objekat iz client podataka
      const grade = new Grade(
        id,
        gradeData.userId || gradeData.korisnikId,
        gradeData.contentId || gradeData.sadrzajId, 
        gradeData.contentType || gradeData.tipSadrzaja || 'movie',
        gradeData.value || gradeData.ocena,
        gradeData.komentar || ''
      );
      const updatedGrade = await this.gradeService.update(grade);
      if (updatedGrade && updatedGrade.id !== 0) {
        res.status(200).json({ success: true, message: "Ocena uspešno ažurirana", data: updatedGrade });
      } else {
        res.status(404).json({ success: false, message: "Ocena nije pronađena" });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: "Greška na serveru" });
    }
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
