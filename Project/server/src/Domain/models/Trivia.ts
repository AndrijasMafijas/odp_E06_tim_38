export class Trivia {
  public constructor(
    public id: number = 0,
    public pitanje: string = '',
    public odgovor: string = '',
    public sadrzajId: number = 0
  ) {}
}