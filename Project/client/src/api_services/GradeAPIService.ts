import axios from "axios";
import type { GradeDto } from "../models/GradeDto";

export const gradeApi = {
  async submitGrade(grade: GradeDto): Promise<{ success: boolean; message: string }> {
    try {
  await axios.post("/api/grades", grade);
  return { success: true, message: "Ocena uspešno sačuvana." };
    } catch (error: any) {
      return { success: false, message: error?.response?.data?.message || "Greška prilikom ocenjivanja." };
    }
  },
};
