import { Router, Request, Response } from "express";
import { IUserService } from "../../Domain/services/users/IUserService";
import { UserService } from "../../Services/users/UserService";
import { authMiddleware } from "../middlewere/authMiddleware";
import { adminMiddleware } from "../middlewere/adminMiddleware";
import { validacijaPodatakaUser } from "../validators/users/UserValidator";

export class UserController {
  private router: Router;
  private userService: IUserService;

  constructor(userService: IUserService = new UserService()) {
    this.router = Router();
    this.userService = userService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Public routes
    this.router.get("/users", this.getAllUsersPublic.bind(this)); // Public get all users
    this.router.put("/users/public/:id/role", this.updateUserRolePublic.bind(this)); // Public role update
    
    // Admin routes
    this.router.get("/users/:id", authMiddleware , adminMiddleware, this.getUserById.bind(this));
    this.router.put("/users/:id",authMiddleware, adminMiddleware, this.updateUser.bind(this));
    this.router.delete("/users/:id", authMiddleware , adminMiddleware, this.deleteUser.bind(this));
  }

  private async getAllUsers(req: Request, res: Response): Promise<void> {
    const users = await this.userService.getAll();
    res.json(users);
  }

  private async getUserById(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const user = await this.userService.getById(id);
    res.json(user);
  }

  private async updateUser(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const userData = req.body;
    const rezultat = validacijaPodatakaUser(userData);
    if (!rezultat.uspesno) {
      res.status(400).json({ success: false, message: rezultat.poruka });
      return;
    }
    const user = await this.userService.update({ ...userData, id });
    res.json(user);
  }

  private async deleteUser(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const success = await this.userService.delete(id);
    res.json({ success });
  }

  /**
   * GET /api/v1/users
   * Public route - get all users
   */
  private async getAllUsersPublic(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ success: false, message: "Greška pri učitavanju korisnika" });
    }
  }

  /**
   * PUT /api/v1/users/public/:id/role
   * Public route - update user role
   */
  private async updateUserRolePublic(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { uloga } = req.body;
      
      if (!uloga || !['korisnik', 'admin'].includes(uloga)) {
        res.status(400).json({ success: false, message: "Neispravna uloga. Mora biti 'korisnik' ili 'admin'." });
        return;
      }
      
      const success = await this.userService.updateRole(id, uloga);
      
      if (success) {
        res.status(200).json({ 
          success: true, 
          message: `Korisnik je uspešno ${uloga === 'admin' ? 'unapređen u administratora' : 'vraćen na korisnika'}.` 
        });
      } else {
        res.status(404).json({ success: false, message: "Korisnik nije pronađen." });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Greška pri ažuriranju uloge korisnika." });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}