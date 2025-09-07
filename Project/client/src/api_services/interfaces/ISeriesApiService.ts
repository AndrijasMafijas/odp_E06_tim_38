import type { Series, CreateSeriesDto } from '../../types/Series';

export interface ISeriesApiService {
  getAllSeries(): Promise<Series[]>;
  getSeriesById(id: number): Promise<Series | null>;
  deleteSeries(seriesId: number): Promise<{ success: boolean; message: string }>;
  createSeries(seriesData: CreateSeriesDto): Promise<{ success: boolean; message: string }>;
}
