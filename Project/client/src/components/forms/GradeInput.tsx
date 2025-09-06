import React, { useState, useMemo, useEffect } from "react";
import type { CreateGradeDto, Grade } from "../../types/Grade";
import type { IGradeApiService } from "../../api_services/interfaces/IGradeApiService";
import { GradeApiService } from "../../api_services/services/GradeApiService";

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
  const [existingGrade, setExistingGrade] = useState<Grade | null>(null);
  const [checkingGrade, setCheckingGrade] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const gradeService: IGradeApiService = useMemo(() => new GradeApiService(), []);

  // Proveriti da li korisnik već ima ocenu za ovaj sadržaj
  useEffect(() => {
    const checkExistingGrade = async () => {
      if (userId > 0 && contentId > 0) {
        setCheckingGrade(true);
        try {
          const grade = await gradeService.getUserGradeForContent(userId, contentId, contentType);
          setExistingGrade(grade);
        } catch (error) {
          console.error('Greška pri proveri postojeće ocene:', error);
        } finally {
          setCheckingGrade(false);
        }
      } else {
        setCheckingGrade(false);
      }
    };

    checkExistingGrade();
  }, [userId, contentId, contentType, gradeService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      let result;
      
      if (existingGrade && isUpdating) {
        // Ažuriranje postojeće ocene
        const gradeData: CreateGradeDto = { 
          ocena: value,
          userId, 
          contentId, 
          contentType 
        };
        result = await gradeService.updateGrade(existingGrade.id, gradeData);
        
        if (result.success) {
          // Ažuriraj lokalno stanje
          setExistingGrade({
            ...existingGrade,
            ocena: value
          });
        }
      } else {
        // Kreiranje nove ocene
        const gradeData: CreateGradeDto = { 
          ocena: value,
          userId, 
          contentId, 
          contentType 
        };
        result = await gradeService.submitGrade(gradeData);
        
        if (result.success && result.data) {
          // Ažuriraj postojeću ocenu sa pravim ID-om iz backend response-a
          setExistingGrade(result.data);
        }
      }
      
      setMessage(result.message);
      
      if (result.success) {
        if (onSuccess) onSuccess();
        setShowForm(false);
        setIsUpdating(false);
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error('Greška pri rukovanju ocenom:', error);
      setMessage('Greška pri rukovanju ocenom');
    } finally {
      setLoading(false);
    }
  };

  if (checkingGrade) {
    return (
      <div className="mt-3">
        <div className="w-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium py-2 px-3 rounded-md text-sm text-center">
          Proverava ocenu...
        </div>
      </div>
    );
  }

  // Ako korisnik već ima ocenu, prikaži je
  if (existingGrade && !showForm) {
    return (
      <div className="mt-3">
        <div className="w-full bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 font-medium py-2 px-3 rounded-md text-sm text-center border border-cyan-300 dark:border-cyan-600 mb-2">
          ⭐ Već ocenjeno: {existingGrade.ocena}/10
        </div>
        <button
          onClick={() => {
            setValue(existingGrade.ocena);
            setIsUpdating(true);
            setShowForm(true);
          }}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-3 rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
        >
          ✏️ Ažuriraj ocenu
        </button>
        {message && (
          <div className={`mt-2 text-sm text-center ${
            message.includes('uspešno') || message.includes('Uspešno') 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {message}
          </div>
        )}
      </div>
    );
  }

  if (!showForm) {
    return (
      <div className="mt-3">
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-3 rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1"
        >
          ⭐ Oceni
        </button>
        {message && (
          <div className={`mt-2 text-sm text-center ${
            message.includes('uspešno') || message.includes('Uspešno') 
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
    <div className="mt-3">
      {/* Prikaži postojeću ocenu i kada je update mode */}
      {existingGrade && isUpdating && (
        <div className="w-full bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 font-medium py-2 px-3 rounded-md text-sm text-center border border-cyan-300 dark:border-cyan-600 mb-3">
          ⭐ Trenutna ocena: {existingGrade.ocena}/10
        </div>
      )}
      
      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {isUpdating ? 'Nova ocena:' : 'Tvoja ocena:'}
            </label>
            <select 
              value={value} 
              onChange={e => setValue(Number(e.target.value))} 
              disabled={loading}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
              className={`flex-1 ${isUpdating ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'} disabled:opacity-50 text-white font-medium py-2 px-3 rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 ${isUpdating ? 'focus:ring-amber-500' : 'focus:ring-green-500'}`}
            >
              {loading ? "Snimanje..." : (isUpdating ? "✏️ Ažuriraj" : "✓ Potvrdi")}
            </button>
            <button 
              type="button"
              onClick={() => {
                setShowForm(false);
                setIsUpdating(false);
                setValue(1);
              }}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-3 rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Otkaži
            </button>
          </div>
          
          {message && (
            <div className={`text-sm text-center ${
              message.includes('uspešno') || message.includes('Uspešno') 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default GradeInput;
