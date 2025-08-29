import axios from "axios";
import type { UserLoginDto } from "../models/auth/UserLoginDto";

export const userApi = {
  async getAllUsers(): Promise<{ success: boolean; data?: UserLoginDto[]; message?: string }> {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/users`);
      return { success: true, data: response.data };
    } catch (error: unknown) {
      console.error("Greška pri učitavanju korisnika:", error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        success: false, 
        message: axiosError?.response?.data?.message || "Грешка при учитавању корисника." 
      };
    }
  },

  async updateUserRole(userId: number, newRole: 'korisnik' | 'admin'): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.put(`http://localhost:3000/api/v1/users/public/${userId}/role`, {
        uloga: newRole
      });
      return response.data;
    } catch (error: unknown) {
      console.error("Greška pri ažuriranju uloge korisnika:", error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        success: false, 
        message: axiosError?.response?.data?.message || "Грешка при ажурирању улоге корисника." 
      };
    }
  },
};
