export interface Series {
  id: number;
  naziv: string;
  opis: string;
  prosecnaOcena: number;
  zanr?: string;
  cover_image?: string;
  brojSezona?: number;
  brojEpizoda?: number;
  godinaIzdanja?: number;
  status?: string;
}

export interface CreateSeriesDto {
  naziv: string;
  opis: string;
  zanr?: string;
  brojSezona?: number;
  brojEpizoda?: number;
  godinaIzdanja?: number;
  status?: string;
  cover_image?: string;
  triviaPitanje?: string;
  triviaOdgovor?: string;
}

export type SeriesSortKey = "naziv" | "prosecnaOcena" | "brojSezona";
export type SeriesSortOrder = "asc" | "desc";

export interface SeriesSortConfig {
  key: SeriesSortKey;
  order: SeriesSortOrder;
}

export interface SeriesFilterConfig {
  searchTerm: string;
}
