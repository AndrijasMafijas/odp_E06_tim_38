import React from 'react';
import type { Series } from '../../types/Series';
import type { Trivia } from '../../types/Trivia';
import type { UserLoginDto } from '../../models/auth/UserLoginDto';
import GradeInput from '../forms/GradeInput';

interface SeriesCardProps {
  series: Series;
  trivia?: Trivia[];
  currentUser: UserLoginDto | null;
  onRefreshSeries: () => void;
  onDeleteSeries: (series: Series) => void;
}

export const SeriesCard: React.FC<SeriesCardProps> = ({
  series,
  trivia,
  currentUser,
  onRefreshSeries,
  onDeleteSeries
}) => {
  const handleDeleteClick = () => {
    onDeleteSeries(series);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between">
      {series.coverImage && (
        <img 
          src={series.coverImage} 
          alt={series.naziv} 
          className="mb-3 w-full h-48 object-cover rounded-md"
        />
      )}
      <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white line-clamp-1">
        {series.naziv}
      </h3>
      <p className="text-sm mb-3 text-gray-700 dark:text-gray-300 line-clamp-2">
        {series.opis}
      </p>
      <div className="space-y-1 mb-3">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <span className="font-medium">Žanr:</span> {series.zanr ?? "-"}
        </p>
        {series.brojEpizoda && (
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium">Epizode:</span> {series.brojEpizoda}
          </p>
        )}
        {series.status && (
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium">Status:</span> {series.status}
          </p>
        )}
        {trivia && trivia[0] && (
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1" title={trivia[0].pitanje}>
            <span className="font-medium">Trivia:</span> {trivia[0].pitanje}
          </p>
        )}
      </div>
      
      {/* Ocena i dugme u posebnom boxu */}
      <div className="mt-auto">
        <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-2 flex flex-col items-center">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-sm text-gray-700 dark:text-gray-300 mr-1">Prosečna ocena:</span>
            <span className="text-yellow-500 text-lg">⭐</span>
            <span className="text-base font-semibold text-gray-900 dark:text-white">
              {series.prosecnaOcena?.toFixed(1) ?? "N/A"}
            </span>
          </div>
          <div className="space-y-2">
            {currentUser && (
              <GradeInput
                userId={currentUser.id}
                contentId={series.id}
                contentType="series"
                onSuccess={onRefreshSeries}
              />
            )}
            {currentUser && currentUser.uloga === 'admin' && (
              <button
                onClick={handleDeleteClick}
                className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
              >
                🗑️ Ukloni seriju
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
