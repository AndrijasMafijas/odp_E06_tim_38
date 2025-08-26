import { Grade } from "../../models/Grade";

export interface IGradeService {
  create(grade: Grade): Promise<Grade>;
  getById(id: number): Promise<Grade>;
  getAll(): Promise<Grade[]>;
  update(grade: Grade): Promise<Grade>;
  delete(id: number): Promise<boolean>;
}
