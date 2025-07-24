export class User {
  public constructor(
    public id: number = 0,
    public korisnickoIme: string = '',
    public lozinka: string = '',
    public email: string = '',
    public uloga: 'korisnik' | 'admin' = 'korisnik'
  ) {}
}