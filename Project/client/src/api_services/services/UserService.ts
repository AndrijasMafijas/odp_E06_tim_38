import type { User, CreateUserDto, UpdateUserRoleDto } from '../../types/User';
import type { IUserService, IUserRepository } from '../interfaces/IUserService';

export class UserService implements IUserService {
  private readonly userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.fetchAll();
  }

  async updateUserRole(userId: number, roleData: UpdateUserRoleDto): Promise<{ success: boolean; message: string }> {
    if (userId <= 0) {
      return { success: false, message: 'Nevalidan ID korisnika' };
    }
    if (!['korisnik', 'admin'].includes(roleData.uloga)) {
      return { success: false, message: 'Nevalidna uloga' };
    }
    
    return await this.userRepository.updateRole(userId, roleData);
  }

  async createUser(userData: CreateUserDto): Promise<{ success: boolean; message: string }> {
    // Validacija podataka
    if (!userData.korisnickoIme?.trim()) {
      return { success: false, message: 'Korisničko ime je obavezno' };
    }
    if (!userData.email?.trim()) {
      return { success: false, message: 'Email je obavezan' };
    }
    if (!userData.lozinka?.trim()) {
      return { success: false, message: 'Lozinka je obavezna' };
    }
    
    return await this.userRepository.create(userData);
  }
}
