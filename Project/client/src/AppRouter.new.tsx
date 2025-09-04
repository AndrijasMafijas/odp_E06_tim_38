import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PročitajVrednostPoKljuču } from "./helpers/local_storage";
import KontrolnaTabla from "./components/kontrolna_tabla/KontrolnaTabla";
import AutentifikacionaForma from "./components/autentifikacija/AutentifikacionaForma";
import { authApi } from "./api_services/auth/AuthAPIService";
import KatalogFilmova from "./pages/KatalogFilmova";
import Navigacija from "./components/navigation/Navigacija";

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
  const [prijavljen, setPrijavljen] = useState<boolean>(false);

  useEffect(() => {
    const token = PročitajVrednostPoKljuču("authToken");
    if (token && token.includes("/")) {
      setPrijavljen(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <Navigacija prijavljen={prijavljen} onLogout={() => setPrijavljen(false)} />
      <Routes>
        <Route path="/" element={<Pocetna />} />
        <Route path="/katalog" element={<KatalogFilmova />} />
        {/* Dodaj rutu za serije */}
        <Route path="/serije" element={<div style={{padding:'2rem'}}><h2>Каталог серија</h2><p>Ускоро...</p></div>} />
        <Route path="/login" element={<AutentifikacionaForma authApi={authApi} onLoginSuccess={() => setPrijavljen(true)} />} />
        <Route path="/signup" element={<AutentifikacionaForma authApi={authApi} onLoginSuccess={() => setPrijavljen(true)} />} />
        <Route path="/dashboard" element={prijavljen ? <KontrolnaTabla onLogout={() => setPrijavljen(false)} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
