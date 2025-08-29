import axios from "axios";

export const movieApi = {
  async deleteMovie(movieId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete(`http://localhost:3000/api/v1/movies/public/${movieId}`);
      return response.data;
    } catch (error: unknown) {
      console.error("Greška pri brisanju filma:", error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        success: false, 
        message: axiosError?.response?.data?.message || "Грешка при уклањању филма." 
      };
    }
  },
};
