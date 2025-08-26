export class Series {
  public constructor(
    public id: number = 0,
    public naziv: string = '',
    public opis: string = '',
    public brojEpizoda: number = 0,
    public zanr: string = '',
    public godinaIzdanja: number = 0,
    public prosecnaOcena: number = 0
  ) {}
}