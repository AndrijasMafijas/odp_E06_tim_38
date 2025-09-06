/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
      // Dodaj cache busting parametar
      const timestamp = new Date().getTime();
      const response = await axios.get(`${this.baseUrl}/series?_t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      console.log('Raw backend response:', response.data);
      
      // Mapiranje backend podataka na frontend format
      const mapiraneSerije = response.data.map((serija: any) => ({
        ...serija,
        cover_image: serija.coverUrl || serija.coverImage // Backend šalje coverUrl, frontend koristi cover_image
      }));
      
      console.log('Mapped series data (first item):', mapiraneSerije[0]);
      console.log('Cover image length:', mapiraneSerije[0]?.cover_image?.length);
      
      return mapiraneSerije;
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
      // Mapiranje frontend formata na backend format
      const backendData = {
        ...data,
        coverImage: data.cover_image // Frontend koristi cover_image, backend očekuje coverImage
      };
      
      // Ukloni cover_image iz backendData jer backend ne očekuje to polje
      const { cover_image, ...cleanBackendData } = backendData;
      
      await axios.post(`${this.baseUrl}/series/public`, cleanBackendData);
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
