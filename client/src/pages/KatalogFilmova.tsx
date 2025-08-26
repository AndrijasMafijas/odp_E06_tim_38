import { useEffect, useState } from "react";
import { ucitajFilmove } from "../services/filmService";
import { type Film } from "../types/film";
import Trivija from "../components/Trivija";

export default function KatalogFilmova() {
  const [filmovi, setFilmovi] = useState<Film[]>([]);
  const [greska, setGreska] = useState("");
  const [ucitava, setUcitava] = useState(true);

  useEffect(() => {
    ucitajFilmove()
      .then(setFilmovi)
      .catch(() => setGreska("Грешка при учитавању филмова"))
      .finally(() => setUcitava(false));
  }, []);

  if (ucitava) return <div>Учитавање...</div>;
  if (greska) return <div style={{ color: "red" }}>{greska}</div>;

  return (
    <div>
      <h2>Каталог филмова</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {filmovi.map((film) => (
          <div
            key={film.id}
            style={{ border: "1px solid #ccc", padding: "1rem", width: 250 }}
          >
            <h3>{film.naziv}</h3>
            <p>{film.opis}</p>
            <p>Просечна оцена: {film.prosecnaOcena?.toFixed(2) ?? "N/A"}</p>
            <Trivija trivija={film.trivija} />
          </div>
        ))}
      </div>
    </div>
  );
}
