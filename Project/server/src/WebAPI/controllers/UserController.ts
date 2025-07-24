import { Router, Request, Response } from "express";
import { IUserService } from "../../Domain/services/users/IUserService";
import { UserService } from "../../Services/users/UserService";
import { authMiddleware } from "../middlewere/authMiddleware";
import { adminMiddleware } from "../middlewere/adminMiddleware";

export class UserController {
  private router: Router;
  private userService: IUserService;

  constructor(userService: IUserService = new UserService()) {
    this.router = Router();
    this.userService = userService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/users", authMiddleware , adminMiddleware, this.getAllUsers.bind(this));
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
    const user = await this.userService.update({ ...userData, id });
    res.json(user);
  }

  private async deleteUser(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const success = await this.userService.delete(id);
    res.json({ success });
  }

  public getRouter(): Router {
    return this.router;
  }
}