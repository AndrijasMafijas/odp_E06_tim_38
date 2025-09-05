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
      // Dodaj cache busting parametar
      const timestamp = new Date().getTime();
      const response = await axios.get(`${this.baseUrl}/movies?_t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      // Mapiranje backend podataka na frontend format
      const mapiraniFilmovi = response.data.map((film: any) => ({
        id: film.id,
        naziv: film.naziv,
        opis: film.opis,
        prosecnaOcena: film.prosecnaOcena,
        zanr: film.zanr,
        godinaIzdanja: film.godinaIzdanja,
        coverImage: film.coverUrl || film.coverImage // Backend šalje coverUrl, frontend očekuje coverImage
      }));
      return mapiraniFilmovi;
    } catch (error) {
      console.error('Greška pri učitavanju filmova:', error);
      throw new Error('Greška pri učitavanju filmova');
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
        message: axiosError?.response?.data?.message || 'Greška pri uklanjanju filma.' 
      };
    }
  }

  async create(data: CreateMovieDto): Promise<{ success: boolean; message: string }> {
    try {
      await axios.post(`${this.baseUrl}/movies/public`, data);
      return { success: true, message: 'Film je uspešno dodat' };
    } catch (error: unknown) {
      console.error('Greška pri dodavanju filma:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        success: false, 
        message: axiosError?.response?.data?.message || 'Greška pri dodavanju filma' 
      };
    }
  }
}
