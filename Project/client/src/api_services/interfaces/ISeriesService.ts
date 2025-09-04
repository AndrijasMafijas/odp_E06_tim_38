import type { Series, CreateSeriesDto } from '../../types/Series';

export interface ISeriesService {
  getAllSeries(): Promise<Series[]>;
  deleteSeries(seriesId: number): Promise<{ success: boolean; message: string }>;
  createSeries(seriesData: CreateSeriesDto): Promise<{ success: boolean; message: string }>;
}

export interface ISeriesRepository {
  fetchAll(): Promise<Series[]>;
  delete(id: number): Promise<{ success: boolean; message: string }>;
  create(data: CreateSeriesDto): Promise<{ success: boolean; message: string }>;
}
