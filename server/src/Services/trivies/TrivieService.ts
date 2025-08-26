import { ITriviesService } from "../../Domain/services/trivies/ITriviesService";
import { Trivia } from "../../Domain/models/Trivia";
import { TriviesRepository } from "../../Database/repositories/trivies/TriviesRepository";

export class TrivieService implements ITriviesService {
  private triviesRepository: TriviesRepository;

  constructor() {
    this.triviesRepository = new TriviesRepository();
  }

  async create(trivia: Trivia): Promise<Trivia> {
    return await this.triviesRepository.create(trivia);
  }

  async getById(id: number): Promise<Trivia> {
    return await this.triviesRepository.getById(id);
  }

  async getAll(): Promise<Trivia[]> {
    return await this.triviesRepository.getAll();
  }

  async update(trivia: Trivia): Promise<Trivia> {
    return await this.triviesRepository.update(trivia);
  }

  async delete(id: number): Promise<boolean> {
    return await this.triviesRepository.delete(id);
  }

  async getByContent(sadrzajId: number, tipSadrzaja: string): Promise<Trivia[]> {
    return await this.triviesRepository.getByContent(sadrzajId, tipSadrzaja);
  }
}
