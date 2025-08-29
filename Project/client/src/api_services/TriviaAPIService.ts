import axios from "axios";
import type { TriviaDto } from "../models/TriviaDto";

const API_URL = import.meta.env.VITE_API_URL;

export const triviaApi = {
  async getByContent(contentId: number, contentType: string): Promise<TriviaDto[]> {
    const res = await axios.get<TriviaDto[]>(`${API_URL}trivias/content/${contentType}/${contentId}`);
    return res.data;
  },
};
