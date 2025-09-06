import type { User, CreateUserDto, UpdateUserRoleDto } from '../../types/User';

export interface IUserApiService {
  getAllUsers(): Promise<User[]>;
  updateUserRole(userId: number, roleData: UpdateUserRoleDto): Promise<{ success: boolean; message: string }>;
  createUser(userData: CreateUserDto): Promise<{ success: boolean; message: string }>;
}
