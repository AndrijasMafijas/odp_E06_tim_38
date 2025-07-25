import { Link, useLocation } from "react-router-dom";

interface NavigacijaProps {
  prijavljen: boolean;
  onLogout: () => void;
}

export default function Navigacija({ prijavljen, onLogout }: NavigacijaProps) {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Почетна" },
    { to: "/katalog", label: "Каталог филмова" },
    { to: "/serije", label: "Каталог серија" },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/60 dark:bg-gray-900/60 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <span className="text-3xl font-extrabold text-cyan-600 tracking-tight drop-shadow-sm select-none">
            🎬 MovieVerse
          </span>
          <div className="hidden md:flex space-x-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? "bg-cyan-600 text-white shadow"
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
            <button
              onClick={onLogout}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold px-5 py-2 rounded-full shadow-md transition-all duration-200 border border-cyan-300/50 hover:border-cyan-200"
            >
              Logout
            </button>
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
  );
}
