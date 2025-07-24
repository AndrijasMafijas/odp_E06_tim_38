import { Series } from "../../models/Series";

/**
 * Repository interfejs za upravljanje serijama
 */
export interface ISeriesRepository {
  /**
   * Kreira novu seriju u bazi podataka
   * @param series - Objekat serije za kreiranje
   * @returns Promise koji vraća kreiranu seriju sa dodeljenim ID-om ili prazan objekat
   */
  create(series: Series): Promise<Series>;

  /**
   * Pronalazi seriju po ID-u
   * @param id - Jedinstveni identifikator serije
   * @returns Promise koji vraća seriju ili prazan objekat ako nije pronađena
   */
  getById(id: number): Promise<Series>;

  /**
   * Vraća sve serije iz baze podataka
   * @returns Promise koji vraća niz svih serija
   */
  getAll(): Promise<Series[]>;

  /**
   * Ažurira postojeću seriju
   * @param series - Objekat serije sa ažuriranim podacima
   * @returns Promise koji vraća ažuriranu seriju ili prazan objekat ako ažuriranje nije uspešno
   */
  update(series: Series): Promise<Series>;

  /**
   * Briše seriju iz baze podataka
   * @param id - ID serije za brisanje
   * @returns Promise koji vraća true ako je brisanje uspešno, false inače
   */
  delete(id: number): Promise<boolean>;

  /**
   * Proverava da li serija postoji u bazi podataka
   * @param id - ID serije za proveru
   * @returns Promise koji vraća true ako serija postoji, false inače
   */
  exists(id: number): Promise<boolean>;
}