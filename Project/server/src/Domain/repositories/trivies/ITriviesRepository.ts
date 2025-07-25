import { Trivia } from "../../models/Trivia";

/**
 * Repository interfejs za upravljanje trivia podacima
 */
export interface ITriviesRepository {
  /**
   * Kreira novu trivia stavku u bazi podataka
   * @param trivia - Objekat trivia za kreiranje
   * @returns Promise koji vraća kreiranu trivia stavku sa dodeljenim ID-om ili prazan objekat
   */
  create(trivia: Trivia): Promise<Trivia>;

  /**
   * Pronalazi trivia stavku po ID-u
   * @param id - Jedinstveni identifikator trivia stavke
   * @returns Promise koji vraća trivia stavku ili prazan objekat ako nije pronađena
   */
  getById(id: number): Promise<Trivia>;

  /**
   * Vraća sve trivia stavke iz baze podataka
   * @returns Promise koji vraća niz svih trivia stavki
   */
  getAll(): Promise<Trivia[]>;

  /**
   * Ažurira postojeću trivia stavku
   * @param trivia - Objekat trivia sa ažuriranim podacima
   * @returns Promise koji vraća ažuriranu trivia stavku ili prazan objekat ako ažuriranje nije uspešno
   */
  update(trivia: Trivia): Promise<Trivia>;

  /**
   * Briše trivia stavku iz baze podataka
   * @param id - ID trivia stavke za brisanje
   * @returns Promise koji vraća true ako je brisanje uspešno, false inače
   */
  delete(id: number): Promise<boolean>;

  /**
   * Proverava da li trivia stavka postoji u bazi podataka
   * @param id - ID trivia stavke za proveru
   * @returns Promise koji vraća true ako trivia stavka postoji, false inače
   */
  exists(id: number): Promise<boolean>;
  /**
   * Dohvata trivije po sadrzaju i tipu sadrzaja
   * @param sadrzajId - ID sadržaja
   * @param tipSadrzaja - tip sadržaja (movie, episode, series)
   * @returns Promise koji vraća niz trivia stavki
   */
  getByContent(sadrzajId: number, tipSadrzaja: string): Promise<Trivia[]>;
}