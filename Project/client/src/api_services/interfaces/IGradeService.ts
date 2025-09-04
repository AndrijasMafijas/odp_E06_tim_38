import type { Grade, CreateGradeDto } from '../../types/Grade';

export interface IGradeService {
  submitGrade(gradeData: CreateGradeDto): Promise<{ success: boolean; message: string }>;
  getUserGrades(userId: number): Promise<Grade[]>;
}

export interface IGradeRepository {
  submit(data: CreateGradeDto): Promise<{ success: boolean; message: string }>;
  fetchByUser(userId: number): Promise<Grade[]>;
}
