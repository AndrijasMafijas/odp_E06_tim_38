export class Grade {
    public constructor(
        public id: number = 0,
        public korisnikId: number = 0,
        public sadrzajId: number = 0,
        public ocena: number = 0,
        public komentar: string = ''
    ) {}
}