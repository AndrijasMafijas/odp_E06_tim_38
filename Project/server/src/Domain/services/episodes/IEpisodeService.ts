import { Episode } from "../../models/Episode";

export interface IEpisodeService {
  create(episode: Episode): Promise<Episode>;
  getById(id: number): Promise<Episode>;
  getAll(): Promise<Episode[]>;
  update(episode: Episode): Promise<Episode>;
  delete(id: number): Promise<boolean>;
}
