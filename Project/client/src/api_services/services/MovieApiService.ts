import axios from 'axios';
import type { Movie, CreateMovieDto } from '../../types/Movie';
import type { IMovieApiService } from '../interfaces/IMovieApiService';

export class MovieApiService implements IMovieApiService {
  private readonly baseUrl: string;

  constructor() {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    this.baseUrl = apiUrl.replace(/\/$/, ''); // Uklanjamo trailing slash
  }

  async getAllMovies(): Promise<Movie[]> {
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
      const mapiraniFilmovi = response.data.map((film: { id: number; naziv: string; opis: string; prosecnaOcena: number; zanr: string; godinaIzdanja: number; coverUrl?: string; coverImage?: string }) => ({
        id: film.id,
        naziv: film.naziv,
        opis: film.opis,
        prosecnaOcena: film.prosecnaOcena,
        zanr: film.zanr,
        godinaIzdanja: film.godinaIzdanja,
        cover_image: film.coverUrl || film.coverImage // Backend šalje coverUrl, frontend koristi cover_image
      }));
      return mapiraniFilmovi;
    } catch (error) {
      console.error('Greška pri učitavanju filmova:', error);
      throw new Error('Greška pri učitavanju filmova');
    }
  }

  async getMovieById(id: number): Promise<Movie | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/movies/${id}`);
      
      // Mapiranje backend podataka na frontend format
      const film = {
        ...response.data,
        cover_image: response.data.coverUrl || response.data.coverImage
      };
      
      return film;
    } catch (error) {
      console.error('Greška pri učitavanju filma:', error);
      return null;
    }
  }

  async deleteMovie(movieId: number): Promise<{ success: boolean; message: string }> {
    if (movieId <= 0) {
      return { success: false, message: 'Nevalidan ID filma' };
    }
    
    try {
      const response = await axios.delete(`${this.baseUrl}/movies/public/${movieId}`);
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

  async createMovie(movieData: CreateMovieDto): Promise<{ success: boolean; message: string }> {
    // Validacija podataka
    if (!movieData.naziv?.trim()) {
      return { success: false, message: 'Naziv filma je obavezan' };
    }
    if (!movieData.opis?.trim()) {
      return { success: false, message: 'Opis filma je obavezan' };
    }
    
    try {
      // Mapiranje frontend formata na backend format
      const backendData = {
        ...movieData,
        coverImage: movieData.cover_image // Frontend koristi cover_image, backend očekuje coverImage
      };
      
      // Ukloni cover_image iz backendData jer backend ne očekuje to polje
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { cover_image, ...cleanBackendData } = backendData;
      
      await axios.post(`${this.baseUrl}/movies/public`, cleanBackendData);
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
