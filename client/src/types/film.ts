export interface Trivija {
  tekst: string;
}

export interface Film {
  id: number;
  naziv: string;
  opis: string;
  prosecnaOcena: number;
  trivija: Trivija;
}