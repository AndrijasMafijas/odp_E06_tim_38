export interface UserLoginDto {
   id: number;
   korisnickoIme: string;
   uloga?: 'korisnik' | 'admin';
}