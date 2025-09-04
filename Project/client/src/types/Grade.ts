export interface Grade {
  id: number;
  ocena: number;
  userId: number;
  contentId: number;
  contentType: 'movie' | 'series';
  datumOcenjivanja?: Date;
}

export interface CreateGradeDto {
  ocena: number;
  userId: number;
  contentId: number;
  contentType: 'movie' | 'series';
}
