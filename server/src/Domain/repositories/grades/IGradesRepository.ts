import { Grade } from "../../models/Grade";

/**
 * Repository interfejs za upravljanje ocenama
 */
export interface IGradesRepository {
  /**
   * Kreira novu ocenu u bazi podataka
   * @param grade - Objekat ocene za kreiranje
   * @returns Promise koji vraća kreiranu ocenu sa dodeljenim ID-om ili prazan objekat
   */
  create(grade: Grade): Promise<Grade>;

  /**
   * Pronalazi ocenu po ID-u
   * @param id - Jedinstveni identifikator ocene
   * @returns Promise koji vraća ocenu ili prazan objekat ako nije pronađena
   */
  getById(id: number): Promise<Grade>;

  /**
   * Vraća sve ocene iz baze podataka
   * @returns Promise koji vraća niz svih ocena
   */
  getAll(): Promise<Grade[]>;

  /**
   * Ažurira postojeću ocenu
   * @param grade - Objekat ocene sa ažuriranim podacima
   * @returns Promise koji vraća ažuriranu ocenu ili prazan objekat ako ažuriranje nije uspešno
   */
  update(grade: Grade): Promise<Grade>;

  /**
   * Briše ocenu iz baze podataka
   * @param id - ID ocene za brisanje
   * @returns Promise koji vraća true ako je brisanje uspešno, false inače
   */
  delete(id: number): Promise<boolean>;

  /**
   * Proverava da li ocena postoji u bazi podataka
   * @param id - ID ocene za proveru
   * @returns Promise koji vraća true ako ocena postoji, false inače
   */
  exists(id: number): Promise<boolean>;
}