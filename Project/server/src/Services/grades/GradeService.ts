import { IGradeService } from "../../Domain/services/grades/IGradeService";
import { Grade } from "../../Domain/models/Grade";
import { GradesRepository } from "../../Database/repositories/grades/GradesRepository";

export class GradeService implements IGradeService {
  private gradesRepository: GradesRepository;

  constructor() {
    this.gradesRepository = new GradesRepository();
  }

  async create(grade: Grade): Promise<Grade> {
    // Proveriti da li korisnik već ima ocenu za ovaj sadržaj
    const hasGraded = await this.gradesRepository.userHasGraded(
      grade.korisnikId, 
      grade.sadrzajId, 
      grade.tipSadrzaja
    );
    
    if (hasGraded) {
      // Vratiti prazan objekat ako korisnik već ima ocenu
      return new Grade();
    }
    
    return await this.gradesRepository.create(grade);
  }

  async getById(id: number): Promise<Grade> {
    return await this.gradesRepository.getById(id);
  }

  async getAll(): Promise<Grade[]> {
    return await this.gradesRepository.getAll();
  }

  async update(grade: Grade): Promise<Grade> {
    return await this.gradesRepository.update(grade);
  }

  async delete(id: number): Promise<boolean> {
    return await this.gradesRepository.delete(id);
  }
}
