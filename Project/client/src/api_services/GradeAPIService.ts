import axios from "axios";
import type { GradeDto } from "../models/GradeDto";

export const gradeApi = {
  async submitGrade(grade: GradeDto): Promise<{ success: boolean; message: string }> {
    try {
      await axios.post('http://localhost:3000/api/v1/grades', grade);
      return { success: true, message: "Оцена успешно сачувана." };
    } catch (error: unknown) {
      console.error("Greška pri slanju ocene:", error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        success: false, 
        message: axiosError?.response?.data?.message || "Грешка при оцењивању." 
      };
    }
  },
};
