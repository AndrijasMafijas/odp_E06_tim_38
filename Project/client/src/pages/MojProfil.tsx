import React, { useState } from 'react';
import type { UserLoginDto } from '../models/auth/UserLoginDto';
import LogoutConfirmModal from '../components/LogoutConfirmModal';

interface MojProfilProps {
  onLogout: () => void;
}

const MojProfil: React.FC<MojProfilProps> = ({ onLogout }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Učitaj korisnika iz localStorage
  let korisnik: UserLoginDto | null = null;
  try {
    const korisnikStr = localStorage.getItem("korisnik");
    if (korisnikStr) korisnik = JSON.parse(korisnikStr);
  } catch {
    // Ignore errors
  }

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  if (!korisnik) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Грешка</h2>
        <p className="text-gray-600 dark:text-gray-300">Корисник није пронађен. Молим вас пријавите се поново.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-8">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-white">Мој профил</h1>
              <p className="text-white/80">Добродошли у ваш лични простор</p>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-6 py-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Основни подаци</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Корисничко име
                  </label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {korisnik.korisnickoIme}
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Улога
                  </label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                      korisnik.uloga === 'admin' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    }`}>
                      {korisnik.uloga === 'admin' ? '👑 Администратор' : '👤 Корисник'}
                    </span>
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    ID корисника
                  </label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    #{korisnik.id}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Статус
                  </label>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                    ✅ Активан
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Акције</h2>
              <div className="flex flex-wrap gap-3">
                {korisnik.uloga === 'admin' && (
                  <button className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Администраторске опције
                  </button>
                )}
                
                <button 
                  onClick={handleLogoutClick}
                  className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Одјави се
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal 
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};

export default MojProfil;
