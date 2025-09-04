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
      return { success: false, message: 'Невалидан ID корисника' };
    }
    if (!['korisnik', 'admin'].includes(roleData.uloga)) {
      return { success: false, message: 'Невалидна улога' };
    }
    
    return await this.userRepository.updateRole(userId, roleData);
  }

  async createUser(userData: CreateUserDto): Promise<{ success: boolean; message: string }> {
    // Validacija podataka
    if (!userData.korisnickoIme?.trim()) {
      return { success: false, message: 'Корисничко име је обавезно' };
    }
    if (!userData.email?.trim()) {
      return { success: false, message: 'Email је обавезан' };
    }
    if (!userData.lozinka?.trim()) {
      return { success: false, message: 'Лозинка је обавезна' };
    }
    
    return await this.userRepository.create(userData);
  }
}
