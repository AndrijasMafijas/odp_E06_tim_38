import axios from 'axios';
import type { Trivia, CreateTriviaDto } from '../../types/Trivia';
import type { ITriviaRepository } from '../interfaces/ITriviaService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export class TriviaRepository implements ITriviaRepository {
  private readonly baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    // Uklanjamo trailing slash da izbegnemo dupli slash u URL-u
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async fetchByContent(contentId: number, contentType: 'movie' | 'series'): Promise<Trivia[]> {
    try {
      const response = await axios.get<Trivia[]>(`${this.baseUrl}/trivias/content/${contentType}/${contentId}`);
      return response.data;
    } catch (error) {
      console.error('Greška pri učitavanju trivia:', error);
      throw new Error('Greška pri učitavanju trivia');
    }
  }

  async create(data: CreateTriviaDto): Promise<{ success: boolean; message: string }> {
    try {
      await axios.post(`${this.baseUrl}/trivias`, data);
      return { success: true, message: 'Trivia je uspešno dodata' };
    } catch (error: unknown) {
      console.error('Greška pri dodavanju trivia:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        success: false, 
        message: axiosError?.response?.data?.message || 'Greška pri dodavanju trivia' 
      };
    }
  }
}
