import type { User, CreateUserDto, UpdateUserRoleDto } from '../../types/User';

export interface IUserService {
  getAllUsers(): Promise<User[]>;
  updateUserRole(userId: number, roleData: UpdateUserRoleDto): Promise<{ success: boolean; message: string }>;
  createUser(userData: CreateUserDto): Promise<{ success: boolean; message: string }>;
}

export interface IUserRepository {
  fetchAll(): Promise<User[]>;
  updateRole(userId: number, roleData: UpdateUserRoleDto): Promise<{ success: boolean; message: string }>;
  create(data: CreateUserDto): Promise<{ success: boolean; message: string }>;
}
