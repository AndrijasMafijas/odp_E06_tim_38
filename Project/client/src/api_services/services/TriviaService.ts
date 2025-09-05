import type { Trivia, CreateTriviaDto } from '../../types/Trivia';
import type { ITriviaService, ITriviaRepository } from '../interfaces/ITriviaService';

export class TriviaService implements ITriviaService {
  private readonly triviaRepository: ITriviaRepository;

  constructor(triviaRepository: ITriviaRepository) {
    this.triviaRepository = triviaRepository;
  }

  async getTriviasByContent(contentId: number, contentType: 'movie' | 'series'): Promise<Trivia[]> {
    if (contentId <= 0) {
      throw new Error('Nevalidan ID sadržaja');
    }
    if (!['movie', 'series'].includes(contentType)) {
      throw new Error('Nevalidan tip sadržaja');
    }
    
    return await this.triviaRepository.fetchByContent(contentId, contentType);
  }

  async createTrivia(triviaData: CreateTriviaDto): Promise<{ success: boolean; message: string }> {
    // Validacija podataka
    if (!triviaData.pitanje?.trim()) {
      return { success: false, message: 'Pitanje je obavezno' };
    }
    if (!triviaData.odgovor?.trim()) {
      return { success: false, message: 'Odgovor je obavezan' };
    }
    if (triviaData.contentId <= 0) {
      return { success: false, message: 'Nevalidan ID sadržaja' };
    }
    
    return await this.triviaRepository.create(triviaData);
  }
}
