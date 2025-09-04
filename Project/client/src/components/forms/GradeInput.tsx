import React, { useState } from "react";
import type { CreateGradeDto } from "../../types/Grade";
import { ServiceFactory } from "../../api_services/factories/ServiceFactory";

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
  const [showForm, setShowForm] = useState(false);

  const gradeService = ServiceFactory.getGradeService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    const gradeData: CreateGradeDto = { 
      ocena: value,
      userId, 
      contentId, 
      contentType 
    };
    
    const result = await gradeService.submitGrade(gradeData);
    setMessage(result.message);
    setLoading(false);
    
    if (result.success) {
      if (onSuccess) onSuccess();
      setShowForm(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (!showForm) {
    return (
      <div className="mt-3">
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          ⭐ Оцени
        </button>
        {message && (
          <div className={`mt-2 text-sm text-center ${
            message.includes('успешно') || message.includes('Успешно') 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Твоја оцена:
          </label>
          <select 
            value={value} 
            onChange={e => setValue(Number(e.target.value))} 
            disabled={loading}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i + 1 === 10 ? '⭐' : ''}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-2">
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-3 rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {loading ? "Снимање..." : "✓ Потврди"}
          </button>
          <button 
            type="button"
            onClick={() => setShowForm(false)}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-3 rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Откажи
          </button>
        </div>
        
        {message && (
          <div className={`text-sm text-center ${
            message.includes('успешно') || message.includes('Успешно') 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default GradeInput;
