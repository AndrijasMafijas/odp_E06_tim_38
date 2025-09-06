import type { Grade, CreateGradeDto } from '../../types/Grade';

export interface IGradeApiService {
  submitGrade(gradeData: CreateGradeDto): Promise<{ success: boolean; message: string }>;
  getUserGrades(userId: number): Promise<Grade[]>;
}
