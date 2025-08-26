export class Grade {
    public constructor(
        public id: number = 0,
        public korisnikId: number = 0,
        public sadrzajId: number = 0,
        public tipSadrzaja: 'movie' | 'episode' | 'series' | 'trivia' = 'movie',
        public ocena: number = 0,
        public komentar: string = ''
    ) {}
}