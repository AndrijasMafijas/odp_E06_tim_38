export interface Trivia {
  id: number;
  pitanje: string;
  odgovor: string;
  contentId: number;
  contentType: 'movie' | 'series';
}

export interface CreateTriviaDto {
  pitanje: string;
  odgovor: string;
  contentId: number;
  contentType: 'movie' | 'series';
}
