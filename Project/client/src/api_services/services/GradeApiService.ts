import axios from 'axios';
import type { Grade, CreateGradeDto } from '../../types/Grade';
import type { IGradeApiService } from '../interfaces/IGradeApiService';

export class GradeApiService implements IGradeApiService {
  private readonly baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000/api/v1') {
    this.baseUrl = baseUrl;
  }

  async submitGrade(gradeData: CreateGradeDto): Promise<{ success: boolean; message: string }> {
    // Validacija podataka
    if (gradeData.ocena < 1 || gradeData.ocena > 10) {
      return { success: false, message: 'Ocena mora biti između 1 i 10' };
    }
    if (gradeData.userId <= 0) {
      return { success: false, message: 'Nevalidan ID korisnika' };
    }
    if (gradeData.contentId <= 0) {
      return { success: false, message: 'Nevalidan ID sadržaja' };
    }
    if (!['movie', 'series'].includes(gradeData.contentType)) {
      return { success: false, message: 'Nevalidan tip sadržaja' };
    }
    
    try {
      await axios.post(`${this.baseUrl}/grades`, gradeData);
      return { success: true, message: 'Ocena uspešno sačuvana.' };
    } catch (error: unknown) {
      console.error('Greška pri slanju ocene:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        success: false, 
        message: axiosError?.response?.data?.message || 'Greška pri ocenjivanju.' 
      };
    }
  }

  async getUserGrades(userId: number): Promise<Grade[]> {
    if (userId <= 0) {
      throw new Error('Nevalidan ID korisnika');
    }
    
    try {
      const response = await axios.get(`${this.baseUrl}/grades/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Greška pri učitavanju ocena korisnika:', error);
      throw new Error('Greška pri učitavanju ocena korisnika');
    }
  }
}
