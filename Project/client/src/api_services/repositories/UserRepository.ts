import axios from 'axios';
import type { User, CreateUserDto, UpdateUserRoleDto } from '../../types/User';
import type { IUserRepository } from '../interfaces/IUserService';

export class UserRepository implements IUserRepository {
  private readonly baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000/api/v1') {
    this.baseUrl = baseUrl;
  }

  async fetchAll(): Promise<User[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/users`);
      return response.data;
    } catch (error) {
      console.error('Greška pri učitavanju korisnika:', error);
      throw new Error('Greška pri učitavanju korisnika');
    }
  }

  async updateRole(userId: number, roleData: UpdateUserRoleDto): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.put(`${this.baseUrl}/users/public/${userId}/role`, roleData);
      return response.data;
    } catch (error: unknown) {
      console.error('Greška pri ažuriranju uloge korisnika:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        success: false, 
        message: axiosError?.response?.data?.message || 'Greška pri ažuriranju uloge korisnika.' 
      };
    }
  }

  async create(data: CreateUserDto): Promise<{ success: boolean; message: string }> {
    try {
      await axios.post(`${this.baseUrl}/users`, data);
      return { success: true, message: 'Korisnik je uspešno kreiran' };
    } catch (error: unknown) {
      console.error('Greška pri kreiranju korisnika:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        success: false, 
        message: axiosError?.response?.data?.message || 'Greška pri kreiranju korisnika' 
      };
    }
  }
}
