import type { Grade, CreateGradeDto } from '../../types/Grade';

export interface IGradeApiService {
  submitGrade(gradeData: CreateGradeDto): Promise<{ success: boolean; message: string; data?: Grade }>;
  getUserGrades(userId: number): Promise<Grade[]>;
  getUserGradeForContent(userId: number, contentId: number, contentType: 'movie' | 'series'): Promise<Grade | null>;
  updateGrade(gradeId: number, gradeData: CreateGradeDto): Promise<{ success: boolean; message: string }>;
}
