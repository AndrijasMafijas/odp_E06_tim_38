import axios from "axios";
import { type Film } from "../types/film";

export async function ucitajFilmove(): Promise<Film[]> {
  const res = await axios.get<Film[]>("/api/movies");
  return res.data;
}