import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import KontrolnaTabla from "./components/kontrolna_tabla/KontrolnaTabla";
import AutentifikacionaForma from "./components/autentifikacija/AutentifikacionaForma";
import { authApi } from "./api_services/auth/AuthAPIService";
import KatalogFilmova from "./pages/KatalogFilmova";
import KatalogSerija from "./pages/KatalogSerija";
import SerieDetail from "./pages/SerieDetail";
import Pocetna from "./pages/Pocetna";
import Navigacija from "./components/Navigacija";
import ThemeToggle from "./components/ThemeToggle";
import type { UserLoginDto } from "./models/auth/UserLoginDto";

export default function AppRouter() {
  const [prijavljen, setPrijavljen] = useState<boolean>(() => {
    return !!localStorage.getItem("korisnik");
  });

  useEffect(() => {
    setPrijavljen(!!localStorage.getItem("korisnik"));
  }, []);

  const handleLoginSuccess = (user?: UserLoginDto) => {
    setPrijavljen(true);
    if (user) {
      localStorage.setItem("korisnik", JSON.stringify(user));
    }
  };

  const handleLogout = () => {
    setPrijavljen(false);
    localStorage.removeItem("korisnik");
  };

  return (
    <div className="min-h-screen w-full bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300 m-0 p-0">
      <BrowserRouter>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Navigacija prijavljen={prijavljen} onLogout={handleLogout} />
          </div>
          <div className="p-4">
            <ThemeToggle />
          </div>
        </div>
        <Routes>
          <Route path="/" element={<Pocetna />} />
          <Route path="/katalog" element={<KatalogFilmova />} />
          <Route path="/serije" element={<KatalogSerija />} />
          <Route path="/serije/:id" element={<SerieDetail />} />
          <Route path="/login" element={<AutentifikacionaForma authApi={authApi} onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/signup" element={<AutentifikacionaForma authApi={authApi} onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/dashboard" element={prijavljen ? <KontrolnaTabla onLogout={handleLogout} /> : <Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
