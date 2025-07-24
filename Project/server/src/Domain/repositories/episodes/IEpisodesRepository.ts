import { Episode } from "../../models/Episode";

/**
 * Repository interfejs za upravljanje epizodama
 */
export interface IEpisodesRepository {
  /**
   * Kreira novu epizodu u bazi podataka
   * @param episode - Objekat epizode za kreiranje
   * @returns Promise koji vraća kreiranu epizodu sa dodeljenim ID-om ili prazan objekat
   */
  create(episode: Episode): Promise<Episode>;

  /**
   * Pronalazi epizodu po ID-u
   * @param id - Jedinstveni identifikator epizode
   * @returns Promise koji vraća epizodu ili prazan objekat ako nije pronađena
   */
  getById(id: number): Promise<Episode>;

  /**
   * Vraća sve epizode iz baze podataka
   * @returns Promise koji vraća niz svih epizoda
   */
  getAll(): Promise<Episode[]>;

  /**
   * Ažurira postojeću epizodu
   * @param episode - Objekat epizode sa ažuriranim podacima
   * @returns Promise koji vraća ažuriranu epizodu ili prazan objekat ako ažuriranje nije uspešno
   */
  update(episode: Episode): Promise<Episode>;

  /**
   * Briše epizodu iz baze podataka
   * @param id - ID epizode za brisanje
   * @returns Promise koji vraća true ako je brisanje uspešno, false inače
   */
  delete(id: number): Promise<boolean>;

  /**
   * Proverava da li epizoda postoji u bazi podataka
   * @param id - ID epizode za proveru
   * @returns Promise koji vraća true ako epizoda postoji, false inače
   */
  exists(id: number): Promise<boolean>;
}