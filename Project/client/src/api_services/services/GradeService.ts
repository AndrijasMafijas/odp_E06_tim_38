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
      return { success: false, message: 'Ocena mora biti između 1 i 10' };
    }
    if (gradeData.userId <= 0) {
      return { success: false, message: 'Nevalidan ID korisnika' };
    }
    if (gradeData.contentId <= 0) {
      return { success: false, message: 'Nevalidan ID sadržaja' };
    }
    if (!['movie', 'series'].includes(gradeData.contentType)) {
      return { success: false, message: 'Nevalidan tip sadržaja' };
    }
    
    return await this.gradeRepository.submit(gradeData);
  }

  async getUserGrades(userId: number): Promise<Grade[]> {
    if (userId <= 0) {
      throw new Error('Nevalidan ID korisnika');
    }
    
    return await this.gradeRepository.fetchByUser(userId);
  }
}
