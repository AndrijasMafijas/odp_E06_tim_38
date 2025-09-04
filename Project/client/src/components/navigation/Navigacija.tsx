 
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import LogoutConfirmModal from "../modals/LogoutConfirmModal";
//import { useDarkMode } from "../helpers/useDarkMode";

interface NavigacijaProps {
  prijavljen: boolean;
  onLogout: () => void;
}

export default function Navigacija({ prijavljen, onLogout }: NavigacijaProps) {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  //const [dark, setDark] = useDarkMode(true);
  
  // Učitaj trenutnog korisnika iz localStorage-a
  const getCurrentUser = () => {
    try {
      const korisnikStr = localStorage.getItem("korisnik");
      return korisnikStr ? JSON.parse(korisnikStr) : null;
    } catch {
      return null;
    }
  };
  
  const currentUser = getCurrentUser();
  
  // Zatvori dropdown kada se klikne van njega
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;
      if (dropdownOpen && !target.closest('.profile-dropdown')) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const navLinks = [
    { to: "/", label: "Почетна" },
    { to: "/katalog", label: "Каталог филмова" },
    { to: "/serije", label: "Каталог серија" },
  ];

  return (
    <div>
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/60 dark:bg-gray-900/80 shadow-md border-b border-gray-200 dark:border-gray-700 m-0 p-0">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center bg-white/80 dark:bg-gray-900/90 shadow-lg border-l-0 border-r-0 border-t-0 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-6">
          <span className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 tracking-tight drop-shadow-sm select-none">
            🎬 MovieVerse
          </span>
          <div className="hidden md:flex space-x-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? "bg-cyan-600 text-white shadow dark:bg-cyan-500 dark:text-gray-900"
                    : "text-gray-700 dark:text-gray-200 hover:bg-cyan-100/70 dark:hover:bg-cyan-800/50 hover:text-cyan-700 dark:hover:text-cyan-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

  <div className="flex items-center space-x-3">
          {prijavljen ? (
            <div className="relative profile-dropdown">
              {/* Profile Icon */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-full shadow-md transition-all duration-200 border border-cyan-300/50 hover:border-cyan-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Добродошли</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {currentUser && currentUser.uloga === 'admin' ? 'Админ' : 'Корисник'}
                    </p>
                  </div>
                  
                  <Link
                    to="/profil"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    👤 Мој профил
                  </Link>
                  
                  {/* Контролна табла - само за админе */}
                  {currentUser && currentUser.uloga === 'admin' && (
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      📊 Контролна табла
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      setShowLogoutModal(true);
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    🚪 Одјави се
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-cyan-700 dark:text-cyan-300 hover:text-white hover:bg-cyan-500/80 font-semibold px-4 py-2 rounded-lg transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg transition duration-200 shadow-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>

    {/* Logout Confirmation Modal */}
    <LogoutConfirmModal
      isOpen={showLogoutModal}
      onClose={() => setShowLogoutModal(false)}
      onConfirm={onLogout}
    />
    </div>
  );
}
