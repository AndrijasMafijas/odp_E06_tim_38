import { IEpisodeService } from "../../Domain/services/episodes/IEpisodeService";
import { Episode } from "../../Domain/models/Episode";
import { EpisodesRepository } from "../../Database/repositories/episodes/EpisodesRepository";

export class EpisodeService implements IEpisodeService {
  private episodesRepository: EpisodesRepository;

  constructor() {
    this.episodesRepository = new EpisodesRepository();
  }

  async create(episode: Episode): Promise<Episode> {
    return await this.episodesRepository.create(episode);
  }

  async getById(id: number): Promise<Episode> {
    return await this.episodesRepository.getById(id);
  }

  async getAll(): Promise<Episode[]> {
    return await this.episodesRepository.getAll();
  }

  async update(episode: Episode): Promise<Episode> {
    return await this.episodesRepository.update(episode);
  }

  async delete(id: number): Promise<boolean> {
    return await this.episodesRepository.delete(id);
  }
}
