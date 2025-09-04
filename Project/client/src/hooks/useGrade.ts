import { useCallback } from 'react';
import type { CreateGradeDto } from '../types/Grade';
import type { IGradeService } from '../api_services/interfaces/IGradeService';

export interface UseGradeResult {
  submitGrade: (gradeData: CreateGradeDto) => Promise<{ success: boolean; message: string }>;
}

export function useGrade(gradeService: IGradeService): UseGradeResult {
  const submitGrade = useCallback(async (gradeData: CreateGradeDto) => {
    return await gradeService.submitGrade(gradeData);
  }, [gradeService]);

  return {
    submitGrade
  };
}
