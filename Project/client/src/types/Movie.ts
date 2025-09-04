export interface Movie {
  id: number;
  naziv: string;
  opis: string;
  prosecnaOcena: number;
  zanr?: string;
  coverUrl?: string;
}

export interface CreateMovieDto {
  naziv: string;
  opis: string;
  zanr?: string;
  trajanje?: string;
  godinaIzdanja?: string;
  triviaPitanje?: string;
  triviaOdgovor?: string;
}

export type SortKey = "naziv" | "prosecnaOcena";
export type SortOrder = "asc" | "desc";

export interface MovieSortConfig {
  key: SortKey;
  order: SortOrder;
}

export interface MovieFilterConfig {
  searchTerm: string;
}
