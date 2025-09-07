import axios from 'axios';
import type { User, CreateUserDto, UpdateUserRoleDto } from '../../types/User';
import type { IUserApiService } from '../interfaces/IUserApiService';

export class UserApiService implements IUserApiService {
  private readonly baseUrl: string;

  constructor() {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    this.baseUrl = apiUrl.replace(/\/$/, ''); // Uklanjamo trailing slash
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/users`);
      return response.data;
    } catch (error) {
      console.error('Greška pri učitavanju korisnika:', error);
      throw new Error('Greška pri učitavanju korisnika');
    }
  }

  async updateUserRole(userId: number, roleData: UpdateUserRoleDto): Promise<{ success: boolean; message: string }> {
    if (userId <= 0) {
      return { success: false, message: 'Nevalidan ID korisnika' };
    }
    if (!['korisnik', 'admin'].includes(roleData.uloga)) {
      return { success: false, message: 'Nevalidna uloga' };
    }
    
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
    
    try {
      await axios.post(`${this.baseUrl}/users`, userData);
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
