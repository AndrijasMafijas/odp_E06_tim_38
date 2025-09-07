import axios from 'axios';
import type { Series, CreateSeriesDto } from '../../types/Series';
import type { ISeriesApiService } from '../interfaces/ISeriesApiService';

export class SeriesApiService implements ISeriesApiService {
  private readonly baseUrl: string;

  constructor() {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    this.baseUrl = apiUrl.replace(/\/$/, ''); // Uklanjamo trailing slash
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
        coverImage: serija.coverUrl || serija.coverImage // Backend šalje coverUrl, frontend koristi coverImage
      }));
      
      return mapiraneSerije;
    } catch (error) {
      console.error('Greška pri učitavanju serija:', error);
      throw new Error('Greška pri učitavanju serija');
    }
  }

  async getSeriesById(id: number): Promise<Series | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/series/${id}`);
      
      // Mapiranje backend podataka na frontend format
      const serija = {
        ...response.data,
        coverImage: response.data.coverUrl || response.data.coverImage
      };
      
      return serija;
    } catch (error) {
      console.error('Greška pri učitavanju serije:', error);
      return null;
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
        coverImage: seriesData.coverImage // Frontend koristi coverImage, backend očekuje coverImage
      };
      
      // Šaljemo podatke sa coverImage poljem
      await axios.post(`${this.baseUrl}/series/public`, backendData);
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
