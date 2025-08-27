import { useEffect, useState } from "react";

export function useDarkMode(defaultValue = true) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved !== null ? saved === "true" : defaultValue;
  });

  useEffect(() => {
    const html = document.documentElement;
    
    // Ukloni sve postojeće klase za temu
    html.classList.remove("dark", "light");
    
    // Dodaj odgovarajuću klasu
    if (dark) {
      html.classList.add("dark");
    } else {
      html.classList.add("light");
    }
    
    // Sačuvaj u localStorage
    localStorage.setItem("darkMode", String(dark));
    
    // Debug - proveravamo da li se klasa dodala
    console.log("Dark mode:", dark, "HTML classes:", html.className);
  }, [dark]);

  return [dark, setDark] as const;
}
