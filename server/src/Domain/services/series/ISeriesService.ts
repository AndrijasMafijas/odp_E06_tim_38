import { Series } from "../../models/Series";

export interface ISeriesService {
  create(series: Series): Promise<Series>;
  getById(id: number): Promise<Series>;
  getAll(): Promise<Series[]>;
  update(series: Series): Promise<Series>;
  delete(id: number): Promise<boolean>;
}
