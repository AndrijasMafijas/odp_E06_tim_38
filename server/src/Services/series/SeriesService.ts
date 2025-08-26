import { ISeriesService } from "../../Domain/services/series/ISeriesService";
import { Series } from "../../Domain/models/Series";
import { SeriesRepository } from "../../Database/repositories/series/SeriesRepository";

export class SeriesService implements ISeriesService {
  private seriesRepository: SeriesRepository;

  constructor() {
    this.seriesRepository = new SeriesRepository();
  }

  async create(series: Series): Promise<Series> {
    return await this.seriesRepository.create(series);
  }

  async getById(id: number): Promise<Series> {
    return await this.seriesRepository.getById(id);
  }

  async getAll(): Promise<Series[]> {
    return await this.seriesRepository.getAll();
  }

  async update(series: Series): Promise<Series> {
    return await this.seriesRepository.update(series);
  }

  async delete(id: number): Promise<boolean> {
    return await this.seriesRepository.delete(id);
  }
}
