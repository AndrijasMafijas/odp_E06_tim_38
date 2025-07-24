import { Movie } from "../../models/Movie";

/**
 * Repository interfejs za upravljanje filmovima
 */
export interface IMoviesRepository {
  /**
   * Kreira novi film u bazi podataka
   * @param movie - Objekat filma za kreiranje
   * @returns Promise koji vraća kreirani film sa dodeljenim ID-om ili prazan objekat
   */
  create(movie: Movie): Promise<Movie>;

  /**
   * Pronalazi film po ID-u
   * @param id - Jedinstveni identifikator filma
   * @returns Promise koji vraća film ili prazan objekat ako nije pronađen
   */
  getById(id: number): Promise<Movie>;

  /**
   * Vraća sve filmove iz baze podataka
   * @returns Promise koji vraća niz svih filmova
   */
  getAll(): Promise<Movie[]>;

  /**
   * Ažurira postojeći film
   * @param movie - Objekat filma sa ažuriranim podacima
   * @returns Promise koji vraća ažurirani film ili prazan objekat ako ažuriranje nije uspešno
   */
  update(movie: Movie): Promise<Movie>;

  /**
   * Briše film iz baze podataka
   * @param id - ID filma za brisanje
   * @returns Promise koji vraća true ako je brisanje uspešno, false inače
   */
  delete(id: number): Promise<boolean>;

  /**
   * Proverava da li film postoji u bazi podataka
   * @param id - ID filma za proveru
   * @returns Promise koji vraća true ako film postoji, false inače
   */
  exists(id: number):Promise<boolean>;
}