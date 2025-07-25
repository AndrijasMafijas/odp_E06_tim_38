import { Trivia } from "../../models/Trivia";

export interface ITriviesService {
  create(trivia: Trivia): Promise<Trivia>;
  getById(id: number): Promise<Trivia>;
  getAll(): Promise<Trivia[]>;
  update(trivia: Trivia): Promise<Trivia>;
  delete(id: number): Promise<boolean>;
  getByContent(sadrzajId: number, tipSadrzaja: string): Promise<Trivia[]>;
}
