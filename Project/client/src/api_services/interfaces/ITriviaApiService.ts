import type { Trivia, CreateTriviaDto } from '../../types/Trivia';

export interface ITriviaApiService {
  getTriviasByContent(contentId: number, contentType: 'movie' | 'series'): Promise<Trivia[]>;
  createTrivia(triviaData: CreateTriviaDto): Promise<{ success: boolean; message: string }>;
}
