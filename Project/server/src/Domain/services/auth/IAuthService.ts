import { UserLoginDto } from "../../DTOs/auth/UserLoginDto";

export interface IAuthService {
    /**
     * Prijavljuje korisnika sa datim korisničkim imenom i lozinkom.
     * @param korisnickoIme - Korisničko ime korisnika.
     * @param lozinka - Lozinka korisnika.
     * @returns Podatke o korisniku ako je prijava uspešna, ili prazan objekat ako nije.
     */
  prijava(korisnickoIme: string, lozinka: string): Promise<UserLoginDto>;

  /**
   * Registruje novog korisnika sa datim korisničkim imenom i lozinkom.
   * @param korisnickoIme - Korisničko ime korisnika.
   * @param lozinka - Lozinka korisnika.
   * @returns Podatke o korisniku ako je registracija uspešna, ili prazan objekat ako nije.
  */
  registracija(korisnickoIme: string, lozinka: string): Promise<UserLoginDto>;
}
