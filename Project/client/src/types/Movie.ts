export interface Movie {
  id: number;
  naziv: string;
  opis: string;
  prosecnaOcena: number;
  zanr?: string;
  godinaIzdanja?: number;
  cover_image?: string;
}

export interface CreateMovieDto {
  naziv: string;
  opis: string;
  zanr?: string;
  trajanje?: string;
  godinaIzdanja?: string;
  cover_image?: string;
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
