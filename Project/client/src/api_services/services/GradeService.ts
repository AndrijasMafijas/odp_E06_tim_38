import type { Grade, CreateGradeDto } from '../../types/Grade';
import type { IGradeService, IGradeRepository } from '../interfaces/IGradeService';

export class GradeService implements IGradeService {
  private readonly gradeRepository: IGradeRepository;

  constructor(gradeRepository: IGradeRepository) {
    this.gradeRepository = gradeRepository;
  }

  async submitGrade(gradeData: CreateGradeDto): Promise<{ success: boolean; message: string }> {
    // Validacija podataka
    if (gradeData.ocena < 1 || gradeData.ocena > 10) {
      return { success: false, message: 'Оцена мора бити између 1 и 10' };
    }
    if (gradeData.userId <= 0) {
      return { success: false, message: 'Невалидан ID корисника' };
    }
    if (gradeData.contentId <= 0) {
      return { success: false, message: 'Невалидан ID садржаја' };
    }
    if (!['movie', 'series'].includes(gradeData.contentType)) {
      return { success: false, message: 'Невалидан тип садржаја' };
    }
    
    return await this.gradeRepository.submit(gradeData);
  }

  async getUserGrades(userId: number): Promise<Grade[]> {
    if (userId <= 0) {
      throw new Error('Невалидан ID корисника');
    }
    
    return await this.gradeRepository.fetchByUser(userId);
  }
}
