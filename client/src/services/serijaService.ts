import axios from "axios";
import { type Serija } from "../types/serija";

export async function ucitajSerije(): Promise<Serija[]> {
  const res = await axios.get<Serija[]>("/api/series");
  return res.data;
}