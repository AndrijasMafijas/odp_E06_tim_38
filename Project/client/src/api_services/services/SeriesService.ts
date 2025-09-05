import type { Series, CreateSeriesDto } from '../../types/Series';
import type { ISeriesService, ISeriesRepository } from '../interfaces/ISeriesService';

export class SeriesService implements ISeriesService {
  private readonly seriesRepository: ISeriesRepository;

  constructor(seriesRepository: ISeriesRepository) {
    this.seriesRepository = seriesRepository;
  }

  async getAllSeries(): Promise<Series[]> {
    return await this.seriesRepository.fetchAll();
  }

  async deleteSeries(seriesId: number): Promise<{ success: boolean; message: string }> {
    if (seriesId <= 0) {
      return { success: false, message: 'Nevalidan ID serije' };
    }
    return await this.seriesRepository.delete(seriesId);
  }

  async createSeries(seriesData: CreateSeriesDto): Promise<{ success: boolean; message: string }> {
    // Validacija podataka
    if (!seriesData.naziv?.trim()) {
      return { success: false, message: 'Naziv serije je obavezan' };
    }
    if (!seriesData.opis?.trim()) {
      return { success: false, message: 'Opis serije je obavezan' };
    }
    
    return await this.seriesRepository.create(seriesData);
  }
}
