import axios from 'axios';
import type { Grade, CreateGradeDto } from '../../types/Grade';
import type { IGradeRepository } from '../interfaces/IGradeService';

export class GradeRepository implements IGradeRepository {
  private readonly baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000/api/v1') {
    this.baseUrl = baseUrl;
  }

  async submit(data: CreateGradeDto): Promise<{ success: boolean; message: string }> {
    try {
      await axios.post(`${this.baseUrl}/grades`, data);
      return { success: true, message: 'Оцена успешно сачувана.' };
    } catch (error: unknown) {
      console.error('Greška pri slanju ocene:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        success: false, 
        message: axiosError?.response?.data?.message || 'Грешка при оцењивању.' 
      };
    }
  }

  async fetchByUser(userId: number): Promise<Grade[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/grades/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Greška pri učitavanju ocena korisnika:', error);
      throw new Error('Грешка при учитавању оцена корисника');
    }
  }
}
