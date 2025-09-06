import axios from 'axios';
import type { Grade, CreateGradeDto } from '../../types/Grade';
import type { IGradeApiService } from '../interfaces/IGradeApiService';

export class GradeApiService implements IGradeApiService {
  private readonly baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000/api/v1') {
    this.baseUrl = baseUrl;
  }

  async submitGrade(gradeData: CreateGradeDto): Promise<{ success: boolean; message: string; data?: Grade }> {
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
      const response = await axios.post(`${this.baseUrl}/grades`, gradeData);
      
      // Proveriti da li je server vratio prazan objekat (korisnik već ima ocenu)
      if (response.data && Object.keys(response.data).length === 0) {
        return { success: false, message: 'Već ste ocenili ovaj sadržaj!' };
      }
      
      return { 
        success: true, 
        message: 'Ocena uspešno sačuvana.',
        data: response.data.data // Kreirana ocena sa pravim ID-om
      };
    } catch (error: unknown) {
      console.error('Greška pri slanju ocene:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      
      // Specifično rukovanje duplicate entry greškom
      if (axiosError?.response?.data?.message?.includes('Duplicate entry')) {
        return { success: false, message: 'Već ste ocenili ovaj sadržaj!' };
      }
      
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

  async getUserGradeForContent(userId: number, contentId: number, contentType: 'movie' | 'series'): Promise<Grade | null> {
    if (userId <= 0 || contentId <= 0) {
      return null;
    }
    
    try {
      const response = await axios.get(`${this.baseUrl}/grades/user/${userId}/${contentId}/${contentType}`);
      return response.data || null;
    } catch (error) {
      console.error('Greška pri učitavanju ocene:', error);
      return null;
    }
  }

  async hasUserGraded(userId: number, contentId: number, contentType: 'movie' | 'series'): Promise<boolean> {
    if (userId <= 0 || contentId <= 0) {
      return false;
    }
    
    try {
      const response = await axios.get(`${this.baseUrl}/grades/check/${userId}/${contentId}/${contentType}`);
      return response.data.hasGraded || false;
    } catch (error) {
      console.error('Greška pri proveri ocene:', error);
      return false;
    }
  }

  async updateGrade(gradeId: number, gradeData: CreateGradeDto): Promise<{ success: boolean; message: string }> {
    // Validacija podataka
    if (gradeData.ocena < 1 || gradeData.ocena > 10) {
      return { success: false, message: 'Ocena mora biti između 1 i 10' };
    }
    if (gradeId <= 0) {
      return { success: false, message: 'Nevalidan ID ocene' };
    }
    
    try {
      await axios.put(`${this.baseUrl}/grades/${gradeId}/public`, gradeData);
      return { success: true, message: 'Ocena uspešno ažurirana.' };
    } catch (error: unknown) {
      console.error('Greška pri ažuriranju ocene:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        success: false, 
        message: axiosError?.response?.data?.message || 'Greška pri ažuriranju ocene.' 
      };
    }
  }
}
