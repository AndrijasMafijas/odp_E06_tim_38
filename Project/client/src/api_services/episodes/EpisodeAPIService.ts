import axios from 'axios';
import type { Episode } from '../../types/Episode';

const API_URL = import.meta.env.VITE_API_URL;

export class EpisodeAPIService {
  async getEpisodesBySeriesId(seriesId: number): Promise<Episode[]> {
    try {
      const response = await axios.get(`${API_URL}series/${seriesId}/episodes`);
      return response.data;
    } catch (error) {
      console.error('Greška pri dohvatanju epizoda:', error);
      return [];
    }
  }

  async delete(episodeId: number): Promise<void> {
    try {
      console.log('Pozivam DELETE za epizodu:', episodeId);
      console.log('API URL:', `${API_URL}episodes/${episodeId}`);
      
      // Dodaj token iz localStorage
      const authToken = localStorage.getItem('authToken');
      const headers: { [key: string]: string } = {};
      
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
        console.log('Dodao Authorization header:', headers.Authorization);
      } else {
        console.log('Nema authToken u localStorage');
      }
      
      const response = await axios.delete(`${API_URL}episodes/${episodeId}`, { headers });
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
}

export const episodeAPIService = new EpisodeAPIService();
