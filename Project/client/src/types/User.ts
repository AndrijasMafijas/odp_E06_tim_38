export interface User {
  id: number;
  korisnickoIme: string;
  email: string;
  uloga: 'korisnik' | 'admin';
  datumRegistracije?: Date;
}

export interface CreateUserDto {
  korisnickoIme: string;
  email: string;
  lozinka: string;
  uloga?: 'korisnik' | 'admin';
}

export interface UpdateUserRoleDto {
  uloga: 'korisnik' | 'admin';
}
