export class Episode {
    public constructor(
        public id: number = 0,
        public naziv: string = '',
        public opis: string = '',
        public trajanje: number = 0,
        public brojEpizode: number = 0, 
        public serijaId: number = 0,
        public prosecnaOcena: number = 0,
        public cover_image: string = ''
    ) {}
}