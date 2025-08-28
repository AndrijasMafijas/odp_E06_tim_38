export class UserLoginDto {
   public constructor(
        public id: number = 0,
        public korisnickoIme: string = '',
        public uloga: 'korisnik' | 'admin' = 'korisnik'
    ) {}
}