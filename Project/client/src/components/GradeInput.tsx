import React, { useState } from "react";
import type { GradeDto } from "../models/GradeDto";
import { gradeApi } from "../api_services/GradeAPIService";

interface GradeInputProps {
  userId: number;
  contentId: number;
  contentType: "movie" | "series";
  onSuccess?: () => void;
}

const GradeInput: React.FC<GradeInputProps> = ({ userId, contentId, contentType, onSuccess }) => {
  const [value, setValue] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const grade: GradeDto = { userId, contentId, contentType, value };
    const res = await gradeApi.submitGrade(grade);
    setMessage(res.message);
    setLoading(false);
    if (res.success && onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
      <label>Оцени:</label>
      <select value={value} onChange={e => setValue(Number(e.target.value))} disabled={loading} className="border rounded px-2 py-1">
        {[...Array(10)].map((_, i) => (
          <option key={i + 1} value={i + 1}>{i + 1}</option>
        ))}
      </select>
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
        {loading ? "Снимање..." : "Потврди"}
      </button>
      {message && <span className="ml-2 text-sm">{message}</span>}
    </form>
  );
};

export default GradeInput;
