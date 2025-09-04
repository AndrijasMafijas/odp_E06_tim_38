import axios from 'axios';
import type { Movie, CreateMovieDto } from '../../types/Movie';
import type { IMovieRepository } from '../interfaces/IMovieService';

export class MovieRepository implements IMovieRepository {
  private readonly baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000/api/v1') {
    this.baseUrl = baseUrl;
  }

  async fetchAll(): Promise<Movie[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/movies`);
      return response.data;
    } catch (error) {
      console.error('Greška pri učitavanju filmova:', error);
      throw new Error('Грешка при учитавању филмова');
    }
  }

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete(`${this.baseUrl}/movies/public/${id}`);
      return response.data;
    } catch (error: unknown) {
      console.error('Greška pri brisanju filma:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        success: false, 
        message: axiosError?.response?.data?.message || 'Грешка при уклањању филма.' 
      };
    }
  }

  async create(data: CreateMovieDto): Promise<{ success: boolean; message: string }> {
    try {
      await axios.post(`${this.baseUrl}/movies/public`, data);
      return { success: true, message: 'Филм је успешно додат' };
    } catch (error: unknown) {
      console.error('Greška pri dodavanju filma:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        success: false, 
        message: axiosError?.response?.data?.message || 'Грешка при додавању филма' 
      };
    }
  }
}
