import type { Trivia, CreateTriviaDto } from '../../types/Trivia';

export interface ITriviaService {
  getTriviasByContent(contentId: number, contentType: 'movie' | 'series'): Promise<Trivia[]>;
  createTrivia(triviaData: CreateTriviaDto): Promise<{ success: boolean; message: string }>;
}

export interface ITriviaRepository {
  fetchByContent(contentId: number, contentType: 'movie' | 'series'): Promise<Trivia[]>;
  create(data: CreateTriviaDto): Promise<{ success: boolean; message: string }>;
}
