import { IUserService } from "../../Domain/services/users/IUserService";
import { User } from "../../Domain/models/User";
import { UserRepository } from "../../Database/repositories/users/UserRepository";

export class UserService implements IUserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(user: User): Promise<User> {
    // Proveri da li korisničko ime već postoji
    const existingUser = await this.userRepository.getByUsername(user.korisnickoIme);
    if (existingUser.id !== 0) {
      return new User(); // korisnik već postoji
    }
    return await this.userRepository.create(user);
  }

  async login(korisnickoIme: string, lozinka: string): Promise<User> {
    const user = await this.userRepository.getByUsername(korisnickoIme);
    if (user.id !== 0 && user.lozinka === lozinka) {
      return user;
    }
    return new User(); // neispravni podaci
  }

  async getById(id: number): Promise<User> {
    return await this.userRepository.getById(id);
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.getAll();
  }

  async update(user: User): Promise<User> {
    return await this.userRepository.update(user);
  }

  async delete(id: number): Promise<boolean> {
    return await this.userRepository.delete(id);
  }
}