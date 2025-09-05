export interface Movie {
  id: number;
  naziv: string;
  opis: string;
  prosecnaOcena: number;
  zanr?: string;
  godinaIzdanja?: number;
  coverImage?: string;
}

export interface CreateMovieDto {
  naziv: string;
  opis: string;
  zanr?: string;
  trajanje?: string;
  godinaIzdanja?: string;
  coverImage?: string;
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
