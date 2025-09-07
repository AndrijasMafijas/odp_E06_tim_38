import axios from 'axios';
import type { Episode } from '../../types/Episode';
import type { IEpisodeApiService } from '../interfaces/IEpisodeApiService';

export class EpisodeApiService implements IEpisodeApiService {
  private readonly baseUrl: string;

  constructor() {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    this.baseUrl = apiUrl.replace(/\/$/, ''); // Uklanjamo trailing slash
  }

  async getEpisodesBySeriesId(seriesId: number): Promise<Episode[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/series/${seriesId}/episodes`);
      return response.data;
    } catch (error) {
      console.error('Greška pri dohvatanju epizoda:', error);
      return [];
    }
  }

  async delete(episodeId: number): Promise<void> {
    try {
      console.log('Pozivam DELETE za epizodu:', episodeId);
      console.log('API URL:', `${this.baseUrl}/episodes/${episodeId}`);
      
      // Dodaj token iz localStorage
      const authToken = localStorage.getItem('authToken');
      const headers: { [key: string]: string } = {};
      
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
        console.log('Dodao Authorization header:', headers.Authorization);
      } else {
        console.log('Nema authToken u localStorage');
      }
      
      const response = await axios.delete(`${this.baseUrl}/episodes/${episodeId}`, { headers });
      console.log('Delete response:', response);
    } catch (error) {
      console.error('Greška pri brisanju epizode:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Status:', error.response?.status);
      }
      throw error;
    }
  }

  async getEpisodeById(episodeId: number): Promise<Episode | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/episodes/${episodeId}`);
      return response.data;
    } catch (error) {
      console.error('Greška pri dohvatanju epizode:', error);
      return null;
    }
  }
}
