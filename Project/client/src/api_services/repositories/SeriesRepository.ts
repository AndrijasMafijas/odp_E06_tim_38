import axios from 'axios';
import type { Series, CreateSeriesDto } from '../../types/Series';
import type { ISeriesRepository } from '../interfaces/ISeriesService';

export class SeriesRepository implements ISeriesRepository {
  private readonly baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000/api/v1') {
    this.baseUrl = baseUrl;
  }

  async fetchAll(): Promise<Series[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/series`);
      return response.data;
    } catch (error) {
      console.error('Greška pri učitavanju serija:', error);
      throw new Error('Greška pri učitavanju serija');
    }
  }

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete(`${this.baseUrl}/series/public/${id}`);
      return response.data;
    } catch (error: unknown) {
      console.error('Greška pri brisanju serije:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        success: false, 
        message: axiosError?.response?.data?.message || 'Greška pri uklanjanju serije.' 
      };
    }
  }

  async create(data: CreateSeriesDto): Promise<{ success: boolean; message: string }> {
    try {
      await axios.post(`${this.baseUrl}/series/public`, data);
      return { success: true, message: 'Serija je uspešno dodata' };
    } catch (error: unknown) {
      console.error('Greška pri dodavanju serije:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        success: false, 
        message: axiosError?.response?.data?.message || 'Greška pri dodavanju serije' 
      };
    }
  }
}
