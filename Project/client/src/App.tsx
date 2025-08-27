import AppRouter from "./AppRouter";
import { useDarkMode } from "./helpers/useDarkMode";

function App() {
  // Inicijalizuj temu odmah na početku
  useDarkMode(true);
  
  return <AppRouter />;
}

export default App;