import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import KontrolnaTabla from "./components/kontrolna_tabla/KontrolnaTabla";
import AutentifikacionaForma from "./components/autentifikacija/AutentifikacionaForma";
import { authApi } from "./api_services/auth/AuthAPIService";
import KatalogFilmova from "./pages/KatalogFilmova";
import Navigacija from "./components/Navigacija";
import type { UserLoginDto } from "./models/auth/UserLoginDto";

function Pocetna() {
  // Prikaz nekoliko filmova/serija (dummy prikaz, može se proširiti)
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Добродошли!</h2>
      <p>Погледајте најновије филмове и серије!</p>
      {/* Ovde možeš prikazati nekoliko izdvojenih filmova/serija */}
    </div>
  );
}

export default function AppRouter() {
  const [prijavljen, setPrijavljen] = useState<boolean>(() => {
    // Provera da li postoji korisnik u localStorage
    return !!localStorage.getItem("korisnik");
  });

  useEffect(() => {
    // Provera na mount-u
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
    <BrowserRouter>
      <Navigacija prijavljen={prijavljen} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Pocetna />} />
        <Route path="/katalog" element={<KatalogFilmova />} />
        {/* Dodaj rutu za serije */}
        <Route path="/serije" element={<div style={{padding:'2rem'}}><h2>Каталог серија</h2><p>Ускоро...</p></div>} />
        <Route path="/login" element={<AutentifikacionaForma authApi={authApi} onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/signup" element={<AutentifikacionaForma authApi={authApi} onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/dashboard" element={prijavljen ? <KontrolnaTabla onLogout={handleLogout} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
