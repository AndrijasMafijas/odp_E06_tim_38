import axios from "axios";

export const seriesApi = {
  async deleteSeries(seriesId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete(`http://localhost:3000/api/v1/series/public/${seriesId}`);
      return response.data;
    } catch (error: unknown) {
      console.error("Greška pri brisanju serije:", error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { 
        success: false, 
        message: axiosError?.response?.data?.message || "Грешка при уклањању серије." 
      };
    }
  },
};
