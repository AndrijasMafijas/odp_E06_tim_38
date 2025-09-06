import type { Episode } from '../../types/Episode';

export interface IEpisodeApiService {
  getEpisodesBySeriesId(seriesId: number): Promise<Episode[]>;
  delete(episodeId: number): Promise<void>;
  getEpisodeById(episodeId: number): Promise<Episode | null>;
}
