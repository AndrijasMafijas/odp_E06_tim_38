export interface GradeDto {
  id?: number;
  userId: number;
  contentId: number; // id filma ili serije
  contentType: "movie" | "series";
  value: number; // 1-10
}
