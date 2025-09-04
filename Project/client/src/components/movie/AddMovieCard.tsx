import React from 'react';

interface AddMovieCardProps {
  onAddMovie: () => void;
}

export const AddMovieCard: React.FC<AddMovieCardProps> = ({ onAddMovie }) => {
  return (
    <div
      onClick={onAddMovie}
      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer group flex flex-col items-center justify-center min-h-[400px]"
    >
      <div className="text-6xl text-gray-400 dark:text-gray-500 group-hover:text-green-500 transition-colors duration-200 mb-4">
        +
      </div>
      <h3 className="font-semibold text-lg text-gray-600 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200 text-center">
        Додај нови филм
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 text-center">
        Кликни да додаш филм
      </p>
    </div>
  );
};
