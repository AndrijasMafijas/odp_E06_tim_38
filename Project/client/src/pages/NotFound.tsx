import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            404
          </h1>
        </div>

        {/* Error Icon */}
        <div className="mb-6">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m-3 8v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
        </div>

        {/* Main Message */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Stranica nije pronađena
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Ups! Izgleda da je stranica koju tražite premestena, obrisana ili nikad nije postojala.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link
            to="/"
            className="inline-block w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🏠 Nazad na početnu
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-block w-full sm:w-auto px-8 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            ⬅️ Nazad
          </button>
        </div>

        {/* Additional Links */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Možda vas zanima:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link 
              to="/filmovi" 
              className="text-blue-600 dark:text-blue-400 hover:underline transition-colors"
            >
              🎬 Katalog filmova
            </Link>
            <Link 
              to="/serije" 
              className="text-purple-600 dark:text-purple-400 hover:underline transition-colors"
            >
              📺 Katalog serija
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 left-1/6 w-16 h-16 bg-indigo-200 dark:bg-indigo-800 rounded-full opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
    </div>
  );
}
