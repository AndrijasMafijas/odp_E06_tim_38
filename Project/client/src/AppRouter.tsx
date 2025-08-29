import { BrowserRouter } from "react-router-dom";
import AppContent from "./AppContent";
import { useDarkMode } from "./helpers/useDarkMode";

export default function AppRouter() {
  // Inicijalizuj temu odmah na početku
  useDarkMode(true);
  
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
