import axios from 'axios';
import type { Trivia, CreateTriviaDto } from '../../types/Trivia';
import type { ITriviaApiService } from '../interfaces/ITriviaApiService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export class TriviaApiService implements ITriviaApiService {
  private readonly baseUrl: string;

  constructor() {
    // Uklanjamo trailing slash da izbegnemo dupli slash u URL-u
    this.baseUrl = API_URL.replace(/\/$/, '');
  }

  async getTriviasByContent(contentId: number, contentType: 'movie' | 'series'): Promise<Trivia[]> {
    if (contentId <= 0) {
      throw new Error('Nevalidan ID sadržaja');
    }
    if (!['movie', 'series'].includes(contentType)) {
      throw new Error('Nevalidan tip sadržaja');
    }
    
    try {
      const response = await axios.get<Trivia[]>(`${this.baseUrl}/trivias/content/${contentType}/${contentId}`);
      return response.data;
    } catch (error) {
      console.error('Greška pri učitavanju trivia:', error);
      throw new Error('Greška pri učitavanju trivia');
    }
  }

  async createTrivia(triviaData: CreateTriviaDto): Promise<{ success: boolean; message: string }> {
    // Validacija podataka
    if (!triviaData.pitanje?.trim()) {
      return { success: false, message: 'Pitanje je obavezno' };
    }
    if (!triviaData.odgovor?.trim()) {
      return { success: false, message: 'Odgovor je obavezan' };
    }
    if (triviaData.contentId <= 0) {
      return { success: false, message: 'Nevalidan ID sadržaja' };
    }
    
    try {
      await axios.post(`${this.baseUrl}/trivias`, triviaData);
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
