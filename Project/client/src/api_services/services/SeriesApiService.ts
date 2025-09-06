import axios from 'axios';
import type { Series, CreateSeriesDto } from '../../types/Series';
import type { ISeriesApiService } from '../interfaces/ISeriesApiService';

export class SeriesApiService implements ISeriesApiService {
  private readonly baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000/api/v1') {
    this.baseUrl = baseUrl;
  }

  async getAllSeries(): Promise<Series[]> {
    try {
      // Dodaj cache busting parametar
      const timestamp = new Date().getTime();
      const response = await axios.get(`${this.baseUrl}/series?_t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      // Mapiranje backend podataka na frontend format
      const mapiraneSerije = response.data.map((serija: { id: number; naziv: string; opis: string; prosecnaOcena: number; zanr: string; godinaIzdanja: number; coverUrl?: string; coverImage?: string; brojEpizoda?: number }) => ({
        ...serija,
        cover_image: serija.coverUrl || serija.coverImage // Backend šalje coverUrl, frontend koristi cover_image
      }));
      
      return mapiraneSerije;
    } catch (error) {
      console.error('Greška pri učitavanju serija:', error);
      throw new Error('Greška pri učitavanju serija');
    }
  }

  async deleteSeries(seriesId: number): Promise<{ success: boolean; message: string }> {
    if (seriesId <= 0) {
      return { success: false, message: 'Nevalidan ID serije' };
    }
    
    try {
      const response = await axios.delete(`${this.baseUrl}/series/public/${seriesId}`);
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

  async createSeries(seriesData: CreateSeriesDto): Promise<{ success: boolean; message: string }> {
    // Validacija podataka
    if (!seriesData.naziv?.trim()) {
      return { success: false, message: 'Naziv serije je obavezan' };
    }
    if (!seriesData.opis?.trim()) {
      return { success: false, message: 'Opis serije je obavezan' };
    }
    
    try {
      // Mapiranje frontend formata na backend format
      const backendData = {
        ...seriesData,
        coverImage: seriesData.cover_image // Frontend koristi cover_image, backend očekuje coverImage
      };
      
      // Ukloni cover_image iz backendData jer backend ne očekuje to polje
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { cover_image, ...cleanBackendData } = backendData;
      
      await axios.post(`${this.baseUrl}/series/public`, cleanBackendData);
      return { success: true, message: 'Serija je uspešno dodana' };
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
